import { CreateLogDto } from '../../dto/sys/log';
import Log from '../../entities/mongodb/sys/Log';
import BaseService from '../BaseService';

export default class LogService extends BaseService {
  async create ({
    ip,
    action,
    module,
    content = '',
    result = 'success',
    username
  }: CreateLogDto) {
    const log = new Log();
    log.username = username || this.ctx.token.username;
    log.ip = ip;
    log.action = action;
    log.module = module;
    log.content = content;
    log.result = result;

    return this.getMongoDBManger().save(Log, log);
  }
}
