const API_KEY = 'acd18e9ed5677fc14b4a5f75457b4d13';
const BASE_URL = 'https://api.themoviedb.org/3/';
const API_URL = BASE_URL + 'discover/movie?sort_by=popularity.desc&api_key=' + API_KEY;
const NOW_PLAYING_URL = BASE_URL + 'movie/now_playing?api_key=' + API_KEY; // Now Playing endpoint
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + 'search/movie?api_key=' + API_KEY + '&query=';
const POPULAR_TV_SHOWS_URL = BASE_URL + 'tv/popular?api_key=' + API_KEY;
const ON_THE_AIR_TV_SHOWS_URL = BASE_URL + 'tv/on_the_air?api_key=' + API_KEY;
const TV_SHOW_DETAILS_URL = BASE_URL + 'tv/';
const genres = [
    { "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
];

let currentPage = 1;
let totalPages = 1;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsE1 = document.getElementById('tags');
const nowPlayingBtn = document.getElementById('now-playing');
const popularTVBtn = document.getElementById('popular-tv'); // Button for popular TV shows
const onAirTVBtn = document.getElementById('on-air-tv'); // Button for on-air TV shows
// Add references to loading spinner and pagination controls
const loadingDiv = document.getElementById('loading');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const currentPageSpan = document.getElementById('current-page');
const trailerModal = document.getElementById('trailerModal');
const trailerVideo = document.getElementById('trailerVideo');
const closeModalBtn = document.querySelector('.close');

var selectedGenre = [];

setGenre();
function setGenre() {
    tagsE1.innerHTML = ''; // Clear previous tags
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            // Toggle genre selection
            if (selectedGenre.includes(genre.id)) {
                selectedGenre = selectedGenre.filter(id => id !== genre.id); // Unselect if already selected
            } else {
                selectedGenre.push(genre.id); // Add genre to selected
            }
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(','))); // Fetch movies based on selected genres
            highlightSelection(); // Update tag styling
        });
        tagsE1.append(t);
    });
}

// Highlight selected genres
function highlightSelection() {
    document.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('highlight');
    });
    if (selectedGenre.length !== 0) {
        selectedGenre.forEach(id => {
            document.getElementById(id).classList.add('highlight'); // Add highlight class to selected genres
        });
    }
}



getMovies(API_URL);

// Fetch movies based on URL
function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            hideLoading(); // Hide loading spinner
            totalPages = data.total_pages; // Set total pages based on API response

            showMovies(data.results);
            updatePaginationControls(); // Update pagination buttons

        })
        .catch(error => {
            console.error('Error fetching data:', error);
            hideLoading(); // Hide loading spinner even if there's an error
        });
}
// Show loading spinner
function showLoading() {
    loadingDiv.style.display = 'block';
    main.style.display = 'none'; // Hide main content during loading
}

// Hide loading spinner
function hideLoading() {
    loadingDiv.style.display = 'none';
    main.style.display = 'flex'; // Show main content after loading
}

// Update pagination controls based on current page and total pages
function updatePaginationControls() {
    currentPageSpan.textContent = currentPage;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Add event listeners for pagination buttons
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getMovies(`${API_URL}&page=${currentPage}`);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        getMovies(`${API_URL}&page=${currentPage}`);
    }
});



// Display movies
function showMovies(data) {
    main.innerHTML = ''; // Clear the movie container
    data.forEach(movie => {
        const { id, title, poster_path, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');
        movieE1.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                ${overview}
            </div>
        `;
        movieE1.addEventListener('click', () => {
            window.location.href = `movie.html?id=${id}`; // Redirect to details page with movie id in URL
        });
        main.appendChild(movieE1);
    });
}

// Handle vote average colors
function getColor(vote) {
    if (vote >= 7) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Search functionality
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(searchURL + searchTerm); // Search movies based on search term
    } else {
        getMovies(API_URL); // If search is empty, go back to popular movies
    }
});

// Fetch and display "Now Playing" movies when the button is clicked
nowPlayingBtn.addEventListener('click', () => {
    getMovies(NOW_PLAYING_URL); // Use the now playing API endpoint
});

// Fetch and display "Popular TV Shows" when the button is clicked
popularTVBtn.addEventListener('click', () => {
    getTVShows(POPULAR_TV_SHOWS_URL); // Fetch popular TV shows
});

// Fetch and display "On the Air TV Shows" when the button is clicked
onAirTVBtn.addEventListener('click', () => {
    getTVShows(ON_THE_AIR_TV_SHOWS_URL); // Fetch currently airing TV shows
});

// Fetch TV shows based on URL
function getTVShows(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showTVShows(data.results);
        })
        .catch(error => console.error('Error fetching TV shows:', error));
}

// Display TV shows
function showTVShows(data) {
    main.innerHTML = ''; // Clear the TV show container
    data.forEach(tvShow => {
        const { id, name, poster_path, vote_average, overview } = tvShow;
        const tvShowE1 = document.createElement('div');
        tvShowE1.classList.add('tv-show');
        tvShowE1.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${name}">
            <div class="tv-show-info">
                <h3>${name}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                ${overview}
            </div>
        `;
        tvShowE1.addEventListener('click', () => {
            getTVShowDetails(id); // Fetch TV show details on click
        });
        main.appendChild(tvShowE1);
    });
}



// Fetch TV show details by ID
function getTVShowDetails(tvId) {
    const tvShowDetailsURL = TV_SHOW_DETAILS_URL + tvId + '?api_key=' + API_KEY;
    fetch(tvShowDetailsURL)
        .then(res => res.json())
        .then(data => {
            console.log('TV Show Details:', data); // You can display the details as needed
        })
        .catch(error => console.error('Error fetching TV show details:', error));
}

// Fetch TV shows that are on air
getTVShows(ON_THE_AIR_TV_SHOWS_URL);

function getTVShows(url) {
    showLoading(); // Show loading spinner
    fetch(url)
        .then(res => res.json())
        .then(data => {
            hideLoading(); // Hide loading spinner
            showTVShows(data.results); // Display TV shows
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            hideLoading(); // Hide loading spinner even if there's an error
        });
}

function showTVShows(data) {
    main.innerHTML = ''; // Clear previous shows
    data.forEach(show => {
        const { id, name, poster_path, vote_average, overview } = show;
        const showE1 = document.createElement('div');
        showE1.classList.add('movie');
        showE1.innerHTML = 
            `<img src="${IMG_URL + poster_path}" alt="${name}">
            <div class="movie-info">
                <h3>${name}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                ${overview}
            </div>`;
        showE1.setAttribute('data-id', id); // Add data attribute for TV show ID
        main.appendChild(showE1);
    });
    addTrailerEventListeners(); // Add event listeners for both movies and TV shows
}

// Add event listeners for trailers
function addTrailerEventListeners() {
    const movieElements = document.querySelectorAll('.movie');
    movieElements.forEach(movie => {
        movie.addEventListener('click', () => {
            const movieId = movie.getAttribute('data-id'); // Fetch the movie or TV show ID
            if (movieId) {
                getTrailer(movieId); // Fetch and display the trailer based on the ID
            }
        });
    });
}

// Fetch trailer for both movies and TV shows
function getTrailer(id) {
    const trailerUrlMovie = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`;
    const trailerUrlTV = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`;

    // First, try fetching a movie trailer. If it fails, attempt fetching a TV show trailer.
    fetch(trailerUrlMovie)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                displayTrailer(data.results[0]);
            } else {
                // If no movie trailer found, try for a TV show
                fetch(trailerUrlTV)
                    .then(res => res.json())
                    .then(tvData => {
                        if (tvData.results && tvData.results.length > 0) {
                            displayTrailer(tvData.results[0]);
                        } else {
                            alert('Trailer not available.');
                        }
                    })
                    .catch(tvError => {
                        console.error('Error fetching TV show trailer:', tvError);
                    });
            }
        })
        .catch(error => {
            console.error('Error fetching movie trailer:', error);
        });
}

// Display the fetched trailer
function displayTrailer(trailer) {
    const trailerModal = document.getElementById('trailerModal');
    const trailerVideo = document.getElementById('trailerVideo');
    trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}`; // Embed YouTube video
    trailerModal.style.display = 'block'; // Show modal
    const closeBtn = trailerModal.querySelector('.close');
    closeBtn.onclick = () => {
        trailerModal.style.display = 'none'; // Hide modal on close
        trailerVideo.src = ''; // Stop video
    };
}

// Initial movie fetch
getMovies(`${API_URL}&page=${currentPage}`);
