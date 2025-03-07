import React, { useEffect, useState } from "react";

function Movie() {
    const [Movielist, setMovielist] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [recentSearches, setRecentSearches] = useState(() => JSON.parse(localStorage.getItem("recentSearches")) || []);
    const [showDropdown, setShowDropdown] = useState(false); // Show/hide recent searches

    const currentYear = new Date().getFullYear();

    const getMovie = (query, year = "") => {
        if (isOffline) {
            setErrorMessage("You're offline. Please check your internet connection.");
            return;
        }

        let url = `http://www.omdbapi.com/?s=${query}&apikey=1a3cdeee`;

        if (year) {
            url += `&y=${year}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (json.Response === "True") {
                    setMovielist(json.Search);
                    setErrorMessage("");
                    saveRecentSearch(query);
                } else {
                    setMovielist([]);
                    setErrorMessage("No results found. Please check the spelling or try a different search term.");
                }
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
                setErrorMessage("An error occurred while fetching movies. Please try again later.");
            });
    };

    useEffect(() => {
        getMovie("movie", currentYear);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        getMovie(searchQuery);
        setShowDropdown(false);
    };

    const saveRecentSearch = (query) => {
        let updatedSearches = [...recentSearches.filter(item => item !== query)];
        updatedSearches.unshift(query);

        if (updatedSearches.length > 5) {
            updatedSearches.pop();
        }

        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    };

    const handleRecentSearchClick = (query) => {
        setSearchQuery(query);
        getMovie(query);
        setShowDropdown(false);
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    return (
        <div className={`container ${darkMode ? "dark" : "light"}`}>
            <div className="header">
                <h1>Movie<span id="x">X</span>plore</h1>
                <button onClick={toggleDarkMode} className="toggle-btn">
                    {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            {isOffline && <p className="offline-message">You're offline. Please check your internet connection.</p>}

            <form onSubmit={handleSearch} className="search-form">
                <div className="search-wrapper">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        placeholder="Search for a movie..."
                    />
                    {showDropdown && recentSearches.length > 0 && (
                        <div className="dropdown">
                            {recentSearches.map((query, index) => (
                                <div key={index} className="dropdown-item" onClick={() => handleRecentSearchClick(query)}>
                                    {query}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit">Search</button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="movie-grid">
                {Movielist.map((movie) => (
                    <div 
                        key={movie.imdbID} 
                        className="movie-card"
                        onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}/`, "_blank")}
                        style={{ cursor: "pointer" }}
                    >
                        <img src={movie.Poster} alt={movie.Title} />
                        <h2>{movie.Title}</h2>
                        <p>{movie.Year}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Movie;
