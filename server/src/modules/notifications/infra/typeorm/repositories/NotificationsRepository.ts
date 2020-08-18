import { getMongoRepository, MongoRepository } from 'typeorm';
import INotificationsRepository from '../../../repositories/INotificationsRepository';
import Notification from '../schemas/Notification';
import ICreateNotificateionDTO from '../../../dtos/ICreateNotificateionDTO';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificateionDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}
export default NotificationsRepository;
