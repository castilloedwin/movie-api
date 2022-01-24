import express from 'express';
const app = express();
import api from './routes';

app.use(express.json());
app.use('/api', api);

export default app;