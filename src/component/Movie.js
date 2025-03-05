import React, { useEffect, useState } from "react";

function Movie() {
    const [Movielist, setMovielist] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const getMovie = (query) => {
        fetch(`http://www.omdbapi.com/?s=${query}&apikey=1a3cdeee`)
            .then(res => res.json())
            .then(json => setMovielist(json.Search || [])); // Assuming the API returns a list of movies in 'Search'
    };

    useEffect(() => {
        getMovie("batman"); // Default search query
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        getMovie(searchQuery);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a movie..."
                />
                <button type="submit">Search</button>
            </form>
            {Movielist.map((movie) => {
                return (
                    <div key={movie.imdbID}>
                        <h1>{movie.Title}</h1>
                        <h2>{movie.Year}</h2>
                        <img src={movie.Poster} alt={movie.Title} />
                    </div>
                );
            })}
        </div>
    );
}

export default Movie;