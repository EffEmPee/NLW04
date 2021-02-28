import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as Yup from 'yup';
import { AppError } from '../errors/AppError';

import { UpdateUserService } from '../services/UpdateUserService';

export class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      throw new AppError('E-mail already in use!');
    };

    const user = usersRepository.create({
      name,
      email
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  };

  async read(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository);

    const users = await usersRepository.find();

    return response.json(users);
  };

  async update(request: Request, response: Response) {
    const { name, email } = request.body;
    const { id } = request.params;

    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findOne({ id });

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório'),
      email: Yup.string().email().required('email incorreto')
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch(err) {
      throw new AppError(err);
    }

    if (!user) {
      throw new AppError('User not found!');
    };

    const emailTaken = await usersRepository.findOne({ email });

    if (emailTaken && emailTaken.email !== user.email) {
      throw new AppError('This e-mail is already in use!');
    }

    user.name = name;
    user.email = email;

    await usersRepository.save(user);

    return response.status(204).json(user);
  };

  async delete(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository);

    const { id } = request.params;

    const user = await usersRepository.findOne({ id });

    if (!user) {
      throw new AppError('User not found!');
    };

    await usersRepository.delete(user.id);

    return response.status(200).json({});
  };
}
