import { getConnection } from 'typeorm';
import { Id } from '../dto/id';
import Keyword from '../entities/mongodb/article/Keywords';
import PostView from '../entities/mongodb/article/PostView';
import Log from '../entities/mongodb/sys/Log';
import Statistic from '../entities/mongodb/sys/Statistic';
import { AdminRoute, Route } from '../libs/decorators/RouterRegister';
import BaseController from './BaseController';

/**
 * @Controller 首页
 */
export default class HomeController extends BaseController {
  /**
   * @api {get} / 首页
   * @apiName home
   * @apiGroup 首页
   */
  @Route('get', '/')
  public async index() {
    const { ctx } = this;

    // await (app.redis as any).set('foo', 'bar');

    // const a = await (ctx.repo as any).article.Posts.find();
    // const b = await (app.redis as any).get('foo');

    // await ctx.repo.sys.User.save({
    //   id: ctx.helper.getNanoid(),
    //   username: 'zhangsan',
    //   password: '123456',
    //   isLock: 0,
    //   operator: '',
    //   lastLogin: ctx.helper.now()
    // });

    // await ctx.repo.sys.Setting.save({
    //   siteName: 'Humandetail',
    //   seoTitle: 'Human',
    //   seoKeywords: 'keywords',
    //   seoDescription: 'desc',
    //   status: 1,
    //   logoId: 1,
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.resource.PictureCategory.save({
    //   name: 'pic_category',
    //   displayName: '测试图片分类',
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.article.Category.save({
    //   name: 'cate',
    //   displayName: '分类',
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.article.Tag.save({
    //   name: 'Tag',
    //   displayName: '测试标签',
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.resource.PostTemplate.save({
    //   name: 'Template',
    //   coverId: 1,
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.resource.Blogroll.save({
    //   name: 'blogroll',
    //   link: 'https://www.humandetail.com',
    //   remarks: '-',
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.resource.Picture.save({
    //   name: 'pic',
    //   qiniuDomain: 'https://img1.humandetail.com/',
    //   qiniuKey: '123.jpg',
    //   width: 0,
    //   height: 0,
    //   size: 0,
    //   cateId: 1,
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.article.Post.save({
    //   id: ctx.helper.getNanoid(),
    //   title: 'TIT',
    //   summary: 'SUMMARY',
    //   content: '# abc',
    //   author: '-',
    //   source: '原创',
    //   seoTitle: '',
    //   seoKeywords: '123、123、123',
    //   seoDescription: 'desc',
    //   cateId: 1,
    //   coverId: 1,
    //   templateId: 1,
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.personal.PersonalBase.save({
    //   userId: '123',
    //   avatarId: 1,
    //   nickname: 'nick',
    //   qq: 'qq',
    //   email: 'email',
    //   blog: 'blog',
    //   github: 'git',
    //   intro: 'intro',
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.personal.PersonalSkill.save({
    //   name: 'skill',
    //   description: 'none',
    //   iconId: 1,
    //   operator: 'zhangsan'
    // });

    // await ctx.repo.personal.PersonalWork.save({
    //   name: 'work',
    //   description: 'none',
    //   link: 'https://baidu.com',
    //   operator: 'zhangsan'
    // });

    const manager = getConnection('mongodb').manager;

    const keyword = new Keyword();
    keyword.ip = '127.0.0.1';
    keyword.keyword = '123';
    await manager.save(Keyword, keyword);

    const postView = new PostView();
    postView.ip = '127.0.0.1';
    postView.postId = '123';
    await manager.save(PostView, postView);

    const log = new Log();
    log.username = 'zhangsan';
    log.ip = '127.0.0.1';
    log.action = 'create';
    log.module = '文章管理';
    log.content = '文章 - 123';
    log.result = '成功';
    await manager.save(Log, log);

    const statistic = new Statistic();
    statistic.ip = '127.0.0.1';
    statistic.page = 'https://www.humandetail.com';
    statistic.source = 'https://www.humandetail.com';
    statistic.entry = 'https://www.humandetail.com';
    await manager.save(Statistic, statistic);

    // ctx.body = {
    //   a,
    //   b,
    // };

    ctx.body = 'Success';
  }

  /**
   * @api {get} /user/:id Request User information
   * @apiName GetUser
   * @apiGroup User
   *
   * @apiParam {Number} id Users unique ID.
   *
   * @apiSuccess {String} firstname Firstname of the User.
   * @apiSuccess {String} lastname  Lastname of the User.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "firstname": "John",
   *       "lastname": "Doe"
   *     }
   *
   * @apiError UserNotFound The id of the User was not found.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "UserNotFound"
   *     }
   */
  @AdminRoute('get', '/test')
  public async test () {
    await this.ctx.validate(Id, this.ctx.request.query);
    this.ctx.body = 'test';
  }

  /**
   * @api {post} /admin/sys/user/add 新增系统用户
   * @apiGroup User
   * @apiUse Auth
   * @apiUse BaseRes
   * @apiUse Page
   * @apiParam {Number} departmentId 部门编号
   * @apiParam {String} name 管理员名称
   * @apiParam {String} username 用户名
   * @apiParam {String} nickName 别名
   * @apiParam {Number[]} roles 关联角色编号列表，最多三个
   * @apiParam {String} remark 用户备注
   * @apiParam {String} email 邮箱
   * @apiParam {String} phone 手机
   * @apiParam {Number} status 状态
   */

  /**
   * @apiDefine BaseRes test
   * @apiSuccess {Number} code 错误码，成功则返回200
   * @apiSuccess {String} message 错误信息，成功则返回success
   * @apiSuccess {Object} data 返回的数据
   */

  /**
   * @apiDefine Auth test
   * @apiHeader {String} Authorization 管理员登陆Token
   */

  /**
  * @apiDefine Page test
  * @apiSuccess {Array} data.list 查询数据列表
  * @apiSuccess {Object} data.pagination 分页信息
  * @apiSuccess {Number} data.pagination.page 当前页数
  * @apiSuccess {Number} data.pagination.size 限制个数
  * @apiSuccess {Number} data.pagination.total 总数量
  */

  /**
   * @api {get} /admin/sys/task-log/page 获取任务日志列表
   * @apiGroup User
   * @apiUse Auth
   * @apiUse BaseRes
   * @apiUse Page
   */

  /**
   * @api {get} /admin/sys/task/page 获取任务列表
   * @apiGroup User
   * @apiUse Auth
   * @apiUse BaseRes
   * @apiUse Page
   */

  /**
   * @api {post} /admin/sys/task/add 新增任务
   * @apiGroup 首页
   * @apiUse Auth
   * @apiUse BaseRes
   * @apiParam {String} name 任务名称
   * @apiParam {String} service 调用服务路径
   * @apiParam {Number} type 任务类型
   * @apiParam {Number} status 任务状态
   * @apiParam {String} startTime 启动时间
   * @apiParam {String} endTime 启动时间
   * @apiParam {Number} limit 最大运行次数，小于等于0则不限次数
   * @apiParam {String} cron cron表达式
   * @apiParam {Number} every 间隔时间
   * @apiParam {String} data 运行参数，JSON格式的字符串
   * @apiParam {String} remark 任务备注
   */

  /**
   * @api {post} /admin/sys/task/update 更新任务
   * @apiGroup 首页
   * @apiUse Auth
   * @apiUse BaseRes
   * @apiParam {String} name 任务名称
   * @apiParam {String} service 调用服务路径
   * @apiParam {Number} type 任务类型
   * @apiParam {Number} status 任务状态
   * @apiParam {String} startTime 启动时间
   * @apiParam {String} endTime 启动时间
   * @apiParam {Number} limit 最大运行次数，小于等于0则不限次数
   * @apiParam {String} cron cron表达式
   * @apiParam {Number} every 间隔时间
   * @apiParam {String} data 运行参数，JSON格式的字符串
   * @apiParam {String} remark 任务备注
   * @apiParam {Number} id 任务编号
   */
}
