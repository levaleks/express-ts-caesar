import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import CaesarCipher from './src/caesar';

// CONSTANTS
const app = express();
const PORT = 3001;

// SETUP
app.use(cors());
app.options('*', cors());
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
});

// ROUTES

app.get('/', (req: Request, res: Response) => {
  res.send(`<a href="/hello/42?one=%20and%20two">example</a>`);
});

app.get('/hello/:id', (req: Request, res: Response) => {
  res.send('Hello World! ' + req.params['id'] + req.query['one']);
});

app.get('/encode', (req: Request, res: Response) => {
  const cipher = new CaesarCipher(+req.query.shift);
  res.json({encoded: cipher.encode(req.query.text)});
});

