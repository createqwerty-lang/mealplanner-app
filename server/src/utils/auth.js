import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

export const hashPassword = async (password) => bcrypt.hash(password, 10);

export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

export const signAccessToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  });

export const signRefreshToken = (user) =>
  jwt.sign({ sub: user.id, type: 'refresh' }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);
