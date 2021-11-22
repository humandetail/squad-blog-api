import { Application } from 'egg';
import { registerRouter } from './libs/decorators/RouterRegister';

export default (app: Application) => {
  registerRouter(app);
};
