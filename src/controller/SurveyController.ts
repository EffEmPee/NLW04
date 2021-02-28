import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import * as Yup from 'yup';
import { SurveysRepository } from '../repositories/SurveysRepository';

class SurveyController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const schema = Yup.object().shape({
      title: Yup.string().required('Título é obrigatório'),
      description: Yup.string().required('descrição obrigatória')
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch(err) {
      throw new AppError(err);
    }

    const survey = surveysRepository.create({
      title,
      description
    });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  };

  async read(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const all = await surveysRepository.find();

    return response.json(all);
  };

  async update(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const { title, description } = request.body;
    const { id } = request.params;

    let survey = await surveysRepository.findOne({id});

    const schema = Yup.object().shape({
      title: Yup.string().required('Título é obrigatório'),
      description: Yup.string().required('descrição obrigatória')
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch(err) {
      throw new AppError(err);
    }

    if (!survey) {
      throw new AppError('Survey not found!');
    };

    survey.title = title;
    survey.description = description;

    await surveysRepository.save(survey);

    return response.status(200).json(survey);
  };

  async delete(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const { id } = request.params;

    const survey = await surveysRepository.findOne({id});

    if (!survey) {
      throw new AppError('Survey not found!');
    };

    await surveysRepository.delete(id);

    return response.status(204).json({});
  };
}

export { SurveyController };
