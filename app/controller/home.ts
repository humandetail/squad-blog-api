import { Controller } from 'egg';
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
  public async index() {
    const { ctx, app } = this;

    await (app.redis as any).set('foo', 'bar');

    const a = await (ctx.repo as any).sys.User.find();
    const b = await (app.redis as any).get('foo');

    ctx.body = {
      a,
      b,
    };
  }
}
