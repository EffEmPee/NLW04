import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u),
    });

    if (!surveyUser) {
      throw new AppError('SurveyUser does not exists');
    };

    if (surveyUser.value) {
      throw new AppError('You have answered this survey already!');
    };

    if (!['1','2','3','4','5','6','7','8','9','10',].includes(value)) {
      throw new AppError('Use a valid grade!');
    }

    surveyUser.value = Number(value);


    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  };
}

export { AnswerController };
