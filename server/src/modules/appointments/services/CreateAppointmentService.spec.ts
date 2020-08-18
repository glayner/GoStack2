import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '../../notifications/repositories/fakes/FakeNotificationsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should not be able to create two appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentData = {
      date: new Date(2020, 4, 10, 13),
      user_id: 'user-id1',
      provider_id: 'provider-id',
    };

    await createAppointment.execute(appointmentData);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = createAppointment.execute(appointmentData);

    await expect(appointment).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    await expect(appointment).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user-id',
      provider_id: 'user-id',
    });

    await expect(appointment).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment1 = createAppointment.execute({
      date: new Date(2020, 4, 11, 7),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    const appointment2 = createAppointment.execute({
      date: new Date(2020, 4, 11, 18),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    await expect(appointment1).rejects.toBeInstanceOf(AppError);
    await expect(appointment2).rejects.toBeInstanceOf(AppError);
  });
});
