import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequestDTO {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async excecute({
    provider_id,
    year,
    month,
    day,
  }: IRequestDTO): Promise<Appointment[]> {
    const cachKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(cachKey);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        { provider_id, day, month, year },
      );

      await this.cacheProvider.save(cachKey, appointments);
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
