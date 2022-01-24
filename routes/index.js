import express from 'express';
import { getMovie, getMovies, storeMovie, updateMovie, deleteMovie, registerUser } from '../controllers/movie';
import auth from '../middlewares/auth';
const api = express.Router();

api.get('/movies', getMovies);
api.get('/movies/:id', getMovie);
api.post('/movies', auth, storeMovie);
api.post('/register', registerUser);
api.put('/movies/:id', auth, updateMovie);
api.delete('/movies/:id', auth, deleteMovie);

export default api;