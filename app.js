const movies = {
    1: {
        title: "Movie Title ",
        poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        rating: 9.8
    },
    2: {
        title: "Movie Title ",
        poster: "https://image.tmdb.org/t/p/w500/ofwSiqOFShhunAIYYdSMHMJQSx2.jpg",
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        rating: 9.8
    },
    3: {
        title: "Movie Title ",
        poster: "https://image.tmdb.org/t/p/w500/1qCq228LsNtUseCnNE7Naw6NBUz.jpg",
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        rating: 9.8
    },

    4: {
        title: "Movie Title ",
        poster: "https://image.tmdb.org/t/p/w500/1qCq228LsNtUseCnNE7Naw6NBUz.jpg",
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        rating: 9.8
    }
};

// Function to open movie details in a new page
        function openMovieDetails(movieId) {
            const movie = movies[movieId];
            if (movie) {
                localStorage.setItem('selectedMovie', JSON.stringify(movie)); // Save movie details in localStorage
                window.location.href = 'movie-details.html'; // Redirect to the details page
            } 
        }