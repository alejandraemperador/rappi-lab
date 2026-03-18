import { AuthenticateUserDTO, CreateUserDTO, UserRole } from './auth.types';
import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase'
import {
  AuthResponse,
  AuthTokenResponsePassword,
} from '@supabase/supabase-js';
import { pool } from '../../config/database';


export const authenticateUserService = async (
  credentials: AuthenticateUserDTO
): Promise<AuthTokenResponsePassword['data']> => {
  const signInResponse = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (signInResponse.error) {
    throw Boom.unauthorized(signInResponse.error.message);
  }

  return signInResponse.data;
};


export const createUserService = async (
  user: CreateUserDTO
): Promise<AuthResponse['data']> => {
  const signUpResponse = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        name: user.name,
        role: user.role,
      },
    },
  });

  if (signUpResponse.error) {
    throw Boom.badRequest(signUpResponse.error.message);
  }

  const authUser = signUpResponse.data.user;

  if (!authUser) {
    throw Boom.internal('Error creating user in auth');
  }

  try {
    await pool.query(
      `INSERT INTO users (id, email, name, password, role)
      VALUES ($1, $2, $3, $4, $5)`,
      [authUser.id, user.email, user.name, user.password, user.role]
    );

    if (user.role === UserRole.STORE) {

      if (!user.storename || typeof user.storename !== 'string' || user.storename.trim() === '') {
        throw Boom.badRequest('Store name is required for store role');
      }

      await pool.query(
        `INSERT INTO stores (name, userid) VALUES ($1, $2)`,
        [user.storename.trim(), authUser.id]
      );
    }

  } catch (dbError: any) {
    console.error('Error insertando tienda:', dbError);
    if (dbError.code === '23505') { 
      throw Boom.conflict('El nombre de la tienda ya está en uso');
    }
    throw Boom.badImplementation('Error al crear la tienda en la base de datos');
  }

  return signUpResponse.data;
}