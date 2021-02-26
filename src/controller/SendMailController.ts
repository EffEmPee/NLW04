import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { isPropertyAccessChain } from "typescript";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {

  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userExists = await usersRepository.findOne({ email });

    if (!userExists) {
      throw new AppError('User does not exists');
    }

    const surveyExists = await surveysRepository.findOne({ id: survey_id });

    if (!surveyExists) {
      throw new AppError('Survey does not exists');
    };

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: { user_id: userExists.id, value: null },
      relations: ['user', 'survey'],
    });

    const variables = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      id: '',
      link: process.env.URL_MAIL
    };

    if (surveyUserExists) {
      variables.id = surveyUserExists.id;
      await SendMailService.execute(email, surveyExists.title, variables, npsPath);

      return response.json(surveyUserExists);
    };

    // Salvar as informacoes na tabela surveyUser
    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);
    variables.id = surveyUserExists.id;

    // Enviar e-mail para o usuario

    await SendMailService.execute(
      email,
      surveyExists.title,
      variables,
      npsPath
    );

    return response.json(surveyUser);
  }
}

export { SendMailController };
