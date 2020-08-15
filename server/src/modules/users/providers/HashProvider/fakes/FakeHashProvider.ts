import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  public async generateHash(paylad: string): Promise<string> {
    return paylad;
  }

  public async compareHash(paylad: string, hashed: string): Promise<boolean> {
    return paylad === hashed;
  }
}
