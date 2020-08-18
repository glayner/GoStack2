import ICreateNotificateionDTO from '../dtos/ICreateNotificateionDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
  create(data: ICreateNotificateionDTO): Promise<Notification>;
}
