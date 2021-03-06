import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDisplay: "toWatch",
      onWatchedTab: false,
      previousDisplay: "",
      movies: [],
      searchedMovies: [],
    };
  };

  componentDidMount() {
    this.handleLoadingAllMovies();
  }

  // handles reloading the movielist from the database
  handleLoadingAllMovies() {
    axios.get('api/movies')
      .then((movies) => {
        this.setState({
          movies: movies.data
        })
      })
  }

  // handles searching for a movie with a specified query
  handleSearch(event) {
    event.preventDefault();
    if (event.target[0].value.length === 0) {
      return;
    } else {
      axios.get('api/movies/search', {
        params: { query: event.target[0].value }
      })
        .then((searchedMovies) => {
          this.setState({
            previousDisplay: this.state.currentDisplay,
            currentDisplay: "searched",
            searchedMovies: searchedMovies.data
          })
        })
    }
  }

  // handles adding a new movie to the database
  handleAdd(event) {
    event.preventDefault();
    if (!event.target[0].value || event.target[0].value.trim() === '') {
      return;
    } else {
      axios.post('api/movies', {
        params: {
          moviename: event.target[0].value,
          watched: 0
        }
      })
        .then(this.handleLoadingAllMovies());
    }
  }

  // handles changing the watched state of a movie
  handleWatchedToggle(movie) {
    console.log(movie.moviename, movie.watched);
    if (movie.watched === 0) {
      movie.watched = 1;
    } else {
      movie.watched = 0;
    }
    axios.patch('api/movies', {
      params: {movie}
    })
      .then(this.handleLoadingAllMovies());
  }

  // handles clicking on the watched button to swap to that tab
  handleWatchedButton() {
    this.setState({
      currentDisplay: "watched"
    })
  }

  // handles clicking on the to watch button to swap to that tab
  handleToWatchButton() {
    this.setState({
      currentDisplay: "toWatch"
    })
  }

  // filters movies based on current display state
  filterMovies() {
    if (this.state.currentDisplay === "toWatch") {
      // return an array of the movie objects where the movies watchedState = 0
      return this.state.movies.filter(movie => movie.watched === 0);
    } else if (this.state.currentDisplay === "watched") {
      // return an array of the movie objects where the movies watchedState = 1
      return this.state.movies.filter(movie => movie.watched === 1);
    } else if (this.state.currentDisplay === "searched") {
      return this.state.searchedMovies;
    }
  }

  render() {
    return (
      <div>
        <h1>Movie List</h1>
        <div>
          <Search search={this.handleSearch.bind(this)} />
          <Add add={this.handleAdd.bind(this)} /><br></br>
          <button id="to-watch-button" type="submit" value="To Watch"
            onClick={this.handleToWatchButton.bind(this)}>To Watch</button>
          <button id="watched-button" type="submit" value="Watched"
            onClick={this.handleWatchedButton.bind(this)}>Watched</button>
          <MovieList movies={this.filterMovies()}
            toggleWatch={this.handleWatchedToggle.bind(this)} />
        </div>
      </div>
    )
  }
};

// search bar functionality
function Search(props) {
  return (
    <div>
      <form onSubmit={props.search}>
        <input className="seach-bar" type="text" placeholder="search movies..."/>
        <input className="search-button" type="submit" value="Search"/>
      </form>
    </div>
  )
};

// add bar functionality
function Add(props) {
  return (
    <div>
      <form onSubmit={props.add}>
        <input className="add-bar" type="text" placeholder="add a movie..." />
        <input className="add-button" type="submit" value="Add Movie"/>
      </form>
    </div>
  )
};

// each movie entry and all the tmdb logic
class MovieEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleClicked: false,
      tmdbData: []
    };
    this.handleTitleClick = this.handleTitleClick.bind(this);
  }

  handleTitleClick() {
    console.log(this.props.movie.moviename);
    if (this.state.tmdbData.length === 0) {
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=ce2c7cb6a10e5145e2d433e13db5058b&language=en-US&query=${this.props.movie.moviename}`)
        .then(searchResults => searchResults.data.results[0].id)
        .then(movieId => axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=ce2c7cb6a10e5145e2d433e13db5058b&language=en-US`))
        .then(movie => this.setState({tmdbData: movie.data}))
        .then(() => this.setState({titleClicked: !this.state.titleClicked}))
        .catch(err => console.log(err));
    } else {
      this.setState({
        titleClicked: !this.state.titleClicked
      })
    }
  }

  render(){
    return (
      <div id="movie-entry-wrapper">
        <li className="movie-entry">
          <span
            onClick={() => this.handleTitleClick()}>
            {this.props.movie.moviename}</span><br></br>
          {this.state.titleClicked ?
            <span>
              <span>Release Year: {this.state.tmdbData.release_date}</span><br></br>
              <span>Runtime: {this.state.tmdbData.runtime}</span><br></br>
              <span>Rating: {this.state.tmdbData.vote_average}</span><br></br>
              <span>Description: {this.state.tmdbData.overview}</span><br></br>
              <img src={`https://image.tmdb.org/t/p/w500/${this.state.tmdbData.poster_path}`} /><br></br>
              <button className="movie-entry-toggle"
                onClick={() => {
                  this.setState({ titleClicked: !this.state.titleClicked });
                  this.props.toggle(this.props.movie);
                }}>
                {this.props.movie.watched === 0 ? 'to watch' : 'watched'}
              </button>
            </span> : null}
        </li>
      </div>
    )
  }
};

// component that holds all the movie entries
function MovieList(props) {
  return (
    <div className ="movie=list">
      {props.movies.map((movie, index) =>
      <MovieEntry key={index} movie={movie}
        toggle={props.toggleWatch}
        click={props.titleClick}/>
      )}
    </div>
  )
};

export default App;