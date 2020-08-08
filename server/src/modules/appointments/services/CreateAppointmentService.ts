import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

import AppError from '@shared/errors/AppError';

interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  appointmentsRepository = getCustomRepository(AppointmentsRepository);

  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
