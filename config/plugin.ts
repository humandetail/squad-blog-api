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
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc',
  },
};

export default plugin;
