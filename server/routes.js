const controller = require('./controllers/movies.js');
const router = require('express').Router();

router.get('/movies', controller.get);

router.post('/movies', controller.post);

router.patch('/movies', controller.patch);

router.get('/movies/search', controller.search);

module.exports = router;