import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
  authenticateUserService,
  createUserService,
} from './auth.service';
import { UserRole } from './auth.types';

export const authenticateUserController = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }
  console.log('REGISTER BODY:', req.body);
  const { email, password } = req.body;

  if (email === undefined) {
    throw Boom.badRequest('Email is required');
  }

  if (password === undefined) {
    throw Boom.badRequest('Password is required');
  }

  const user = await authenticateUserService({ email, password });
  return res.json(user);
};


export const createUserController = async (req: Request, res: Response) => {
  console.log('REGISTER BODY:', req.body);
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { email, name, password, role, storename } = req.body;
  console.log('ROLE RECIBIDO:', role);
  console.log('ROLES VALIDOS:', Object.values(UserRole));
  
  if (email === undefined) {
    throw Boom.badRequest('Email is required');
  }

  if (name === undefined) {
    throw Boom.badRequest('Name is required');
  }

  if (password === undefined) {
    throw Boom.badRequest('Password is required');
  }

  if (!Object.values(UserRole).includes(role)) {
    throw Boom.badRequest(
      `Role must be one of: ${Object.values(UserRole).join(', ')}`
    );
  }

  const user = await createUserService({ email, name, password, role, storename });
  return res.status(201).json(user);
};