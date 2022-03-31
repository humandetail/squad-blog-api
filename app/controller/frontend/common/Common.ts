import PersonalSkill from '../../../entities/mysql/personal/PersonalSkill';
import PersonalWork from '../../../entities/mysql/personal/PersonalWork';
import { Route } from '../../../libs/decorators/RouterRegister';
import { formatSetting } from '../../../libs/utils';
import BaseController from '../../BaseController';

/**
 * 鉴权相关控制器
 */
export default class CommonController extends BaseController {
  /**
   * @api {get} /frontend-service/settings 获取网站设置
   * @apiGroup Frontend - Common
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.siteName 技能名称
   * @apiSuccess {String} data.seoTitle seo title
   * @apiSuccess {String} data.seoKeywords seo keywords
   * @apiSuccess {String} data.seoDescription seo description
   * @apiSuccess {String} data.status 运行状态
   * @apiSuccess {Number} data.logoId 外键-logo id
   * @apiSuccess {String} data.logoPic logo url
   */
  @Route('get', '/frontend-service/settings')
  async getSettings () {
    const setting = await this.service.sys.setting.findOne(true);

    if (!setting) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: formatSetting(setting)
    });
  }

  /**
   * @api {get} /frontend-service/blogrolls 获取友情链接列表
   * @apiGroup Frontend - Common
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records
   * @apiSuccess {String} data.records.name 技能名称
   * @apiSuccess {String} data.records.name 名称
   * @apiSuccess {String} data.records.link 链接
   * @apiSuccess {String} data.records.remarks 备注
   */
  @Route('get', '/frontend-service/blogrolls')
  async getBlogrolls () {
    const [ blogrolls, total ] = await this.service.resource.blogroll.findAll();

    this.res({
      data: this.pageWrapper(
        blogrolls.map(v => this.formatDateField(v)),
        1,
        total,
        total
      )
    });
  }

  /**
   * @api {get} /frontend-service/categories 获取文章分类列表
   * @apiGroup Frontend - Common
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.name 分类名称
   * @apiSuccess {String} data.records.displayName 分类显示名称
   */
  @Route('get', '/frontend-service/categories')
  async getCategories () {
    const { service } = this;


    const [categories, total] = await service.post.category.findAll();

    this.res({
      data: this.pageWrapper(
        categories.map(v => this.formatDateField(v)),
        1,
        total,
        total
      )
    });
  }

  /**
   * @api {get} /frontend-service/tags 获取文章标签列表
   * @apiGroup Frontend - Common
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.name 标签名称
   * @apiSuccess {String} data.records.displayName 标签显示名称
   */
  @Route('get', '/frontend-service/tags')
  async getTags () {
    const tags = await this.service.post.tag.findAll();
    const total = tags.length;

    this.res({
      data: this.pageWrapper(
        tags.map(v => this.formatDateField(v)),
        1,
        total,
        total
      )
    });
  }

  /**
   * @api {get} /personal/aboutUs 获取关于我们
   * @apiGroup Frontend - Common
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   */
  @Route('get', '/frontend-service/aboutUs')
  async getPeronalInfo () {
    const { service } = this;
    const personalBase = await service.personal.base.findOne({
      isDefault: 1,
      isShow: 1
    }, []);

    if (!personalBase) {
      this.res({ code: -1 });
      return;
    }

    const { nickname, qq, blog, github, email, intro, isShowSkills, isShowWorks } = personalBase;

    let skills: PersonalSkill[] = [];
    if (isShowSkills) {
      skills = await service.personal.skill.findAll();
    }

    let works: PersonalWork[] = [];
    if (isShowWorks) {
      works = await service.personal.work.findAll();
    }

    this.res({
      data: {
        nickname,
        qq,
        blog,
        github,
        email,
        intro,
        skills: skills.map(({
          icon,
          ...item
        }) => {
          return {
            ...item,
            icon: icon.qiniuDomain + icon.qiniuKey
          };
        }),
        works: works.map(({ name, description, link, pictures }) => {
          return {
            name,
            description,
            link,
            pictures: pictures.map(({ name: picName, qiniuDomain, qiniuKey }) => {
              return {
                name: picName,
                url: qiniuDomain + qiniuKey
              };
            })
          };
        })
      },
    });
  }
}
