import { Router } from 'express';

import SessionsController from '../controller/SessionsController';

const SessionsRoutes = Router();
const sessionController = new SessionsController();

SessionsRoutes.post('/', sessionController.create);

export default SessionsRoutes;
