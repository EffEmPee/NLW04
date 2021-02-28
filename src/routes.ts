import { Router } from 'express';
import { UserController } from './controller/UserController';
import { SurveyController } from './controller/SurveyController';
import { SendMailController } from './controller/SendMailController';
import { AnswerController } from './controller/AnswerController';
import { NpsController } from './controller/NpsController';


const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();

const sendMailController = new SendMailController();

const answerController = new AnswerController();

const npsController = new NpsController();

router.post('/users', userController.create);
router.get('/users', userController.read);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.read);
router.put('/surveys/:id', surveyController.update);
router.delete('/surveys/:id', surveyController.delete);

router.post('/sendMail', sendMailController.execute);

router.get('/answers/:value', answerController.execute);

router.get('/nps/:survey_id', npsController.execute);


export { router };
