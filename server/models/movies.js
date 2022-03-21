const db = require('../db/');

module.exports = {
  getAll: () => {
    let getMovies = 'SELECT moviename, watched FROM movies';

    return new Promise((resolve, reject) => {
      db.query(getMovies, (err, data) => {
        if (err) { reject(err) }
        else { resolve(data) }
      })
    })
  },

  create: (movie) => {
    let createMovie = `INSERT INTO movies(moviename, watched) VALUE('${movie.moviename}', ${movie.watched})`;

    return new Promise((resolve, reject) => {
      db.query(createMovie, (err, data) => {
        if (err) { reject(err) }
        else { resolve(data) }
      })
    });
  },

  update: (movie) => {
    let updateStatus = `UPDATE movies SET watched = ${movie.watched} WHERE moviename = '${movie.moviename}'`;

    return new Promise((resolve, reject) => {
      db.query(updateStatus, (err, data) => {
        if (err) { reject(err) }
        else { resolve(data) }
      });
    });
  },

  search: (query) => {
    let searchMovies = `SELECT moviename, watched FROM movies WHERE moviename LIKE '%${query}%'`;

    return new Promise((resolve, reject) => {
      db.query(searchMovies, (err, data) => {
        if (err) { reject(err) }
        else { resolve(data) }
      });
    });
  }
}