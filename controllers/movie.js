import fs from 'fs';
import { promisify } from 'util';
import { v1 as uuid } from 'uuid';
import { createAccessToken } from '../services';
const readFile = promisify(fs.readFile);

const path = './data/info.json';

const getMovie = async (req, res) => {
    try {
        if (!fs.existsSync(path)) return res.json([]);
        const data = await readFile(path, 'utf-8');
        const { id: movieId } = req.params;
        const dataFound = JSON.parse(data).find((movie) => movie.id === movieId);
        if (!dataFound) return res.status(404).json({ status: 404, message: 'Movie not found' })
        return res.json(dataFound);
    } catch(error) {
        console.log(error);
    }
}

const getMovies = async (req, res) => {
    try {
        if (!fs.existsSync(path)) return res.json([]);
        const data = await readFile(path, 'utf-8');

        const queryTitle = new RegExp(req.query.title, 'gi');

        if (req.query.genre && req.query.title) {
            const dataFiltered = JSON.parse(data).filter((movie) => req.query.genre !== undefined && movie.genre === req.query.genre && req.query.title !== undefined && queryTitle.test(movie.title));
            return res.json(dataFiltered);
        }

        if (req.query.genre || req.query.title) {
            const dataFiltered = JSON.parse(data).filter((movie) => req.query.genre !== undefined && movie.genre === req.query.genre || req.query.title !== undefined && queryTitle.test(movie.title));
            return res.json(dataFiltered);
        }

        if (req.query.limit) {
            const max = 20;
            const min = 1;
            const limit = Number(req.query.limit);
            if (limit < min || limit > max) return res.status(400).json({ status: 400, message: 'Limit must not to be minor than 1 or greater than 20' })
            const dataFiltered = JSON.parse(data).filter((movie, index) => index < limit);
            return res.json(dataFiltered);
        }
        return res.json(JSON.parse(data));
    } catch(error) {
        console.log(error);
    }
}

const storeMovie = async (req, res) => {
    try {
        const movieId = uuid();
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify([{ ...req.body, id: movieId }]));
            return res.status(201).json({
                status: 201,
                message: 'A movie has been saved',
                movieId
            });
        }

        const data = await readFile(path);
        const dataParsed = JSON.parse(data);
        dataParsed.push({ ...req.body, id: movieId });
        fs.writeFileSync(path, JSON.stringify(dataParsed));

        return res.status(201).json({
            status: 201,
            message: 'A movie has been saved',
            movieId
        });
    } catch(error) {
        console.log(error);
    }
}

const updateMovie = async (req, res) => {
    try {
        if (!fs.existsSync(path)) {
            return res.status(404).json({
                status: 404,
                message: 'There is no data to update'
            });
        }

        const data = await readFile(path);
        const dataParsed = JSON.parse(data);
        const { id: movieId } = req.params;
        let moviesEdited = dataParsed.filter((movie) => movie.id !== movieId);
        if (moviesEdited.length === dataParsed.length) {
            return res.status(404).json({
                status: 404,
                message: 'Movie not found'
            });
        }
        moviesEdited = [ ...moviesEdited, {...req.body, id: movieId} ];

        fs.writeFileSync(path, JSON.stringify(moviesEdited));

        return res.status(204).json();
        
    } catch (error) {
        console.log(error);
    }
}

const deleteMovie = async (req, res) => {
    try {
        if (!fs.existsSync(path)) {
            return res.status(404).json({
                status: 404,
                message: 'There is no data to delete'
            });
        }

        const data = await readFile(path);
        const dataParsed = JSON.parse(data);
        const { id: movieId } = req.params;

        let moviesEdited = dataParsed.filter((movie) => movie.id !== movieId);
        if (moviesEdited.length === dataParsed.length) {
            return res.status(404).json({
                status: 404,
                message: 'Movie not found'
            });
        }

        fs.writeFileSync(path, JSON.stringify(moviesEdited));

        return res.status(204).json();
    } catch (error) {
        console.log(error);
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ status: 400, message: 'Body cannot be empty' });
        let validate = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!validate.test(email)) return res.status(400).json({ status: 400, message: 'Wrong format email' });
        const token = createAccessToken({ email, password });
        return res.status(201).json({ status: 201, accessToken: token });
    } catch(error) {
        console.log(error);
    }
}

export {
    getMovie,
    getMovies,
    storeMovie,
    updateMovie,
    deleteMovie,
    registerUser
}