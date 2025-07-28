import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import config from "../config/config";

// Estendi Request per includere userId
export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "Serve il token di autorizzazione" });
    return;
  }

  try {
    const parsedText = token.split(" ")[1];
    const decoded = verify(parsedText, config.jwtSecret as string) as { sub: string };

    (req as AuthRequest).userId = decoded.sub;

    next();
  } catch (error) {
    res.status(401).json({ message: "Non autorizzato" });
  }
};

export default authenticate;
