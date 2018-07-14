import * as express from 'express';
import { Application, Request, Response, NextFunction, Errback } from 'express';
import * as cors from 'cors';
import caesarCipher from './src/caesarCipher';

interface ExpressError {
  status?: number;
  message: string;
}

/**
 * Constants
 */

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

/**
 * Setup
 */

app.use(cors());
app.use(express.json());
app.options('*', cors());

/**
 * Routes
 */

app.post('/transform', (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ data: caesarCipher({ ...req.body }) });
  } catch (error) {
    if (error instanceof TypeError || error instanceof RangeError) {
      const err: ExpressError = new Error(error.message);

      err.status = 400;

      return next(err);
    }

    return next(new Error('Internal Error'));
  }
});

/**
 * Error handler
 */

app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);

  if (!err.status) {
    err.status = 500;
  }

  res.status(err.status).json({ status: err.status, message: err.message });
});

/**
 * Ignition
 */

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
