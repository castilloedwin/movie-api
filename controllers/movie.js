import fs from 'fs';
import { promisify } from 'util';
import { v1 as uuid } from 'uuid';
import { createAccessToken } from '../services';
import { requiredKeys } from '../utils/requiredKeys';
import { messages } from '../utils/messages';
import { queryLimit } from '../utils/queryLimit';
const readFile = promisify(fs.readFile);

const path = './data/info.json';

const getMovie = async (req, res) => {
    try {
        if (!fs.existsSync(path)) return res.json([]);
        const data = await readFile(path, 'utf-8');
        const { id: movieId } = req.params;
        const dataFound = JSON.parse(data).find((movie) => movie.id === movieId);
        if (!dataFound) return res.status(404).json({ status: 404, message: messages.movieNotFound })
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

        if (req.query.genre || req.query.title || req.query.year) {
            const dataFiltered = JSON.parse(data).filter((movie) => req.query.genre !== undefined && movie.genre === req.query.genre || req.query.title !== undefined && queryTitle.test(movie.title) || req.query.year !== undefined && movie.year == req.query.year);
            return res.json(dataFiltered);
        }

        if (req.query.limit) {
            const limit = Number(req.query.limit);
            if (queryLimit(data, limit).status === 400) return res.status(400).json(queryLimit(data, limit));
            return res.status(200).json(queryLimit(data, limit));
        }

        return res.json(JSON.parse(data));
    } catch(error) {
        console.log(error);
    }
}

const storeMovie = async (req, res) => {
    try {
        const movieId = uuid();
        let emptyKeyName = '';

        for (const key of requiredKeys) {
            if (!req.body[key]) { emptyKeyName = key; break };
        }

        if (emptyKeyName) {
            return res.status(400).json({
                status: 400,
                message: `[${emptyKeyName}] is required!`
            });
        }

        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify([{ ...req.body, id: movieId }]));
            return res.status(201).json({
                status: 201,
                message: messages.movieSaved,
                movieId
            });
        }

        const data = await readFile(path);
        const dataParsed = JSON.parse(data);
        dataParsed.push({ ...req.body, id: movieId });
        fs.writeFileSync(path, JSON.stringify(dataParsed));

        return res.status(201).json({
            status: 201,
            message: messages.movieSaved,
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
                message: messages.noDataToUpdate
            });
        }

        const data = await readFile(path);
        const dataParsed = JSON.parse(data);
        const { id: movieId } = req.params;
        let moviesEdited = dataParsed.filter((movie) => movie.id !== movieId);

        if (moviesEdited.length === dataParsed.length) {
            return res.status(404).json({
                status: 404,
                message: messages.movieNotFound
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
                message: messages.noDataToDelete
            });
        }

        const data = await readFile(path);
        const dataParsed = JSON.parse(data);
        const { id: movieId } = req.params;

        let moviesEdited = dataParsed.filter((movie) => movie.id !== movieId);
        if (moviesEdited.length === dataParsed.length) {
            return res.status(404).json({
                status: 404,
                message: messages.movieNotFound
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
        if (!email || !password) return res.status(400).json({ status: 400, message: messages.emptyBody });
        let validate = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!validate.test(email)) return res.status(400).json({ status: 400, message: messages.wrongEmail });
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