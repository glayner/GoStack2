import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

export default class BCrypetHashProvider implements IHashProvider {
  public async generateHash(paylad: string): Promise<string> {
    return hash(paylad, 8);
  }

  public async compareHash(paylad: string, hashed: string): Promise<boolean> {
    return compare(paylad, hashed);
  }
}
