import { ObjectID } from 'mongodb';
import INotificationsRepository from '../INotificationsRepository';
import ICreateNotificateionDTO from '../../dtos/ICreateNotificateionDTO';
import Notification from '../../infra/typeorm/schemas/Notification';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificateionDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}
export default FakeNotificationsRepository;
