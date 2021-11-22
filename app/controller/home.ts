import { Controller } from 'egg';
import { getConnection } from 'typeorm';
import Keyword from '../entities/mongodb/article/Keywords';
import PostView from '../entities/mongodb/article/PostView';
import Log from '../entities/mongodb/sys/Log';
import Statistic from '../entities/mongodb/sys/Statistic';
import { AdminRoute, Route } from '../libs/decorators/RouterRegister';

/**
 * @Controller 首页
 */
export default class HomeController extends Controller {
  /**
   * @Summary 首页
   * @Description 首页desc
   * @Router get /
   * @Response 200 BaseReseponse
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

  @AdminRoute('get', '/test')
  public async test () {
    this.ctx.validate({ id: { type: 'string' } }, this.ctx.request.query);
    this.ctx.body = 'test';
  }
}
