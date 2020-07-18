import { Router, Response, Request } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentsRepository();

appointmentsRouter
  .get('/', (request: Request, response: Response) => {
    return response.json(appointmentRepository.all());
  })
  .post('/', (request: Request, response: Response) => {
    try {
      const { provider, date } = request.body;

      const parsedDate = parseISO(date);

      const createAppointmentService = new CreateAppointmentService(
        appointmentRepository,
      );

      const appointment = createAppointmentService.execute({
        date: parsedDate,
        provider,
      });

      return response.json(appointment);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  });

export default appointmentsRouter;
