import Log from '../src/middlewares/Log';
import Locals from './providers/Local';

Log;
console.log(Locals.config().url)
console.log(Locals.config().port);