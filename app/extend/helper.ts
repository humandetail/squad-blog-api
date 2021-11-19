import * as moment from 'moment';
import { customAlphabet } from 'nanoid';

export default {
  getNanoid (size = 10) {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', size);
    return nanoid();
  },

  now (format = 'YYYY-MM-DD HH:mm:ss') {
    return moment().format(format);
  }
};
