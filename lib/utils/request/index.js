import Request from '@janiscommerce/app-request';
import {getAppEnvironment} from '../deviceInfo';

export default new Request({JANIS_ENV: getAppEnvironment()});
