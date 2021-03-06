import { container } from 'tsyringe';
import IHashProvider from './HashProvider/models/IHashProvider';
import BCrypetHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCrypetHashProvider);
