import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.jwt = {
    secret: 'H5IOzF0AbaUhYosuT6rKeBqwRdDPiELQ'
  };

  return config;
};
