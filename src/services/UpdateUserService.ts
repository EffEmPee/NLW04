import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { UsersRepository } from "../repositories/UsersRepository";

export class UpdateUserService {
  public usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  };

  async execute(id: string, email: string, name: string) {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new AppError('User not found!');
    };

    const emailTaken = await this.usersRepository.findOne({ email });

    if (emailTaken && emailTaken.email !== user.email) {
      throw new AppError('This e-mail is already in use!');
    }

    user.name = name;
    user.email = email;

    this.usersRepository.save(user);
  };
};

