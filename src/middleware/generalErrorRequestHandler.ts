import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// General error-handling middleware
export const errorRequestHandler: ErrorRequestHandler = (err, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(403).json({
      message: err.message ?? 'invalid signature'
    });
  }
  return res.status(500).json({
    error: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      message: err?.message || 'Internal Server Error' // Return the error message
    }
  });
};
