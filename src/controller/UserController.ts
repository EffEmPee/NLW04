import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

export class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const usersRepository = getRepository(User);

    const userAlreadyExists = await usersRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      return response.status(408).json({
        error: 'Email already in use!',
      });
    };

    const user = usersRepository.create({
      name,
      email
    });

    await usersRepository.save(user);

    return response.json(user);
  }
}
