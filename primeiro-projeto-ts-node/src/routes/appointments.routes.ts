import { Router, Response, Request } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentsRepository();

appointmentsRouter
  .get('/', (request: Request, response: Response) => {
    return response.json(appointmentRepository.all());
  })
  .post('/', (request: Request, response: Response) => {
    const { provider, date } = request.body;

    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentInSameDate = appointmentRepository.findByDate(
      parsedDate,
    );

    if (findAppointmentInSameDate) {
      return response
        .status(400)
        .json({ error: 'this appointment is already booked' });
    }

    const appointment = appointmentRepository.create({
      provider,
      date: parsedDate,
    });

    return response.json(appointment);
  });

export default appointmentsRouter;
