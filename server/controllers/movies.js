let model = require('../models/movies');

module.exports = {
  // get all movies from the database
  get: (request, response) => {
    model.getAll()
      .then((data) => { response.send(data) })
      .catch(err => console.log(err));
  },

  // make a new movie listing in the database
  post: (request, response) => {
    model.create(request.body.params)
      .then(response.status(201).end('Movie successfully added'))
      .catch(err => console.log(err));
  },

  patch: (request, response) => {
    console.log(request.body.params.movie);
    model.update(request.body.params.movie)
      .then(response.status(200).end('Watched status successfully updated'))
      .catch(err => console.log(err));
  },

  search: (request, response) => {
    model.search(request.query.query)
      .then((data) => { response.send(data) })
      .catch(err => console.log(err));
  }
}