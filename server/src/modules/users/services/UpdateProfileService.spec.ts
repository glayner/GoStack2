import AppError from '@shared/errors/AppError';

import { v4 } from 'uuid';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const updatedUser = await updateProfile.excecute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123123123',
    });

    const updatedUser = updateProfile.excecute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johndoe@example.com',
    });

    await expect(updatedUser).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const updatedUser = await updateProfile.excecute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      old_password: '123123123',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const updatedUser = updateProfile.excecute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
    });

    await expect(updatedUser).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const updatedUser = updateProfile.excecute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
      old_password: 'wrong-old-pasword',
    });

    await expect(updatedUser).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update profile from non-existing user', async () => {
    const profile = updateProfile.excecute({
      user_id: v4(),
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
      old_password: '123456',
    });

    await expect(profile).rejects.toBeInstanceOf(AppError);
  });
});
