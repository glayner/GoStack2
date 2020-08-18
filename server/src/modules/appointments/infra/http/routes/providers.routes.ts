import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controller/ProvidersController';
import ProviderMonthAvailabilityController from '../controller/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controller/ProviderDayAvailabilityController';

const providerRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providerRouter.use(ensureAuthenticated);

providerRouter.get('/', providersController.index);
providerRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index,
);
providerRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index,
);

export default providerRouter;
