import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  typeorm: {
    enable: true,
    package: '@hackycy/egg-typeorm',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  classValidator: {
    enable: true,
    package: '@hackycy/egg-class-validator',
  },
  globalHeader: {
    enable: true,
    package: 'egg-global-header'
  }
};

export default plugin;
