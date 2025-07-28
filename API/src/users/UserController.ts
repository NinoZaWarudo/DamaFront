import { NextFunction, Request, Response} from 'express';
import createHttpError from 'http-errors';
import UserSchema from "./UserSchema";
import bcrypt from "bcrypt";
import {sign} from 'jsonwebtoken';
import config from "../config/config";


const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({error: 'Please enter a valid email'});
    return;
  }
  const user = await UserSchema.findOne({email});
  if (user) {
    res.status(400).json({error: 'User already exists'});
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserSchema.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      status: true,
      message: 'User creato',
      data: { _id: newUser._id, email: newUser.email},
    });
  } catch (error) {
    res.status(500).json({error: 'qualcosa non è andato a buon fine :('});
  }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({error: 'Please enter a valid email'});
    return;
  }
  const user = await UserSchema.findOne({email});
  if (!user) {
    res.status(400).json({error: 'User non trovato'});
    return;
  }
  const isPasswordMatch = await bcrypt.compare(password,user.password);
  if (!isPasswordMatch) {
    res.status(400).json({error: 'Credenziali Incorrette'});
    return;
  }
  try {
    const token = sign({ sub: user._id}, config.jwtSecret as string, {
      expiresIn: '1d'
    });

      res.status(200).json({
      status: true,
      message: 'utente loggato',
      data: { _id: user._id, email: user.email, name: user.name},
      token,
    })

  } catch (error){
    res.status(500).json({error: 'qualcosa non è andato a buon fine :('});
    return;
  }

};

const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.json({ message: "me function" });
}

export { register, login, me };
