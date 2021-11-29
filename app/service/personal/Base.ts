import { FindManyOptions } from 'typeorm';
import { CreatePersonalBaseDto, UpdatePersonalBaseDto } from '../../dto/personal/base';
import BaseService from '../BaseService';

type IUpdateInfo = Partial<UpdatePersonalBaseDto>;

export default class PersonalBaseService extends BaseService {
  async create ({
    nickname,
    avatarId,
    qq = '',
    email = '',
    blog = '',
    github = '',
    intro = '',
    sort = 0,
    isShow,
    isDefault,
    isShowSkills,
    isShowWorks
  }: CreatePersonalBaseDto) {
    const user = await this.getRepo().sys.User.findOne(this.ctx.token.id);
    if (!user) {
      this.ctx.throw('请先登录', 403);
    }

    // 获取头像信息
    const avatarInfo = avatarId
      ? await this.getRepo().resource.Picture.findOne(avatarId)
      : null;

    // 启动事务
    await this.ctx.ormManager.transaction(async manager => {
      const PersonalBase = this.getEntity().personal.PersonalBase;
      // 1. 如果 isDefault === 1，则让当前用户下所有数据的 is_default = 0
      if (isDefault === 1) {
        await manager
          .createQueryBuilder()
          .update(PersonalBase)
          .set({ isDefault: 0 })
          .where('is_default = :isDefault', { isDefault: 1 })
          .execute();
      }

      // 2. 创建新的数据
      const personalBase = manager.create(PersonalBase, {
        nickname,
        qq,
        email,
        blog,
        github,
        intro,
        sort,
        user,
        ...(avatarInfo ? { avatar: avatarInfo } : null),
        operator: user.username,
        isShow,
        isDefault,
        isShowSkills,
        isShowWorks
      });

      await manager.save(personalBase);
    });

    return true;
  }

  async update (id: number, info: IUpdateInfo) {
    const personalBase = await this.getRepo().personal.PersonalBase.findOne({
      where: { id },
      relations: ['user', 'avatar']
    });

    if (!personalBase) {
      return false;
    }

    // 开启事务
    await this.ctx.ormManager.transaction(async manager => {
      const PersonalBase = this.getEntity().personal.PersonalBase;

      // 1. 判断是否需要更改头像信息
      if (info.avatarId && info.avatarId !== personalBase.avatar.id) {
        const pic = await manager.findOne(this.getEntity().resource.Picture, info.avatarId);
        if (!pic) {
          this.ctx.throw('不存在的头像信息', 422);
        }
        personalBase.avatar = pic;
      }

      // 2. 保证只有一个默认项
      if (info.isDefault === 1) {
        await manager
          .createQueryBuilder()
          .update(PersonalBase)
          .set({ isDefault: 0 })
          .where('userId = :userId and is_default = :isDefault', { isDefault: 1, userId: personalBase.user.id })
          .execute();
      }

      // 3. 更新数据
      personalBase.nickname = info.nickname || personalBase.nickname;
      personalBase.qq = info.qq || personalBase.qq;
      personalBase.blog = info.blog || personalBase.blog;
      personalBase.github = info.github || personalBase.github;
      personalBase.email = info.email || personalBase.email;
      personalBase.intro = info.intro || personalBase.intro;
      personalBase.isDefault = info.isDefault ?? personalBase.isDefault;
      personalBase.isShow = info.isShow ?? personalBase.isShow;
      personalBase.isShowWorks = info.isShowWorks ?? personalBase.isShowWorks;
      personalBase.isShowSkills = info.isShowSkills ?? personalBase.isShowSkills;
      personalBase.sort = info.sort || personalBase.sort;
      personalBase.operator = this.ctx.token.username;

      await manager.update(PersonalBase, { id }, personalBase);
    });

    return true;
  }

  async getPersonalBase (id: number) {
    const personalBase = await this.getRepo().personal.PersonalBase.findOne(id, {
      relations: ['user', 'avatar']
    });

    if (!personalBase) {
      return null;
    }

    const { user, avatar, ...data } = this.formateDateField(personalBase);

    return {
      ...data,
      userId: user?.id || null,
      avatarId: avatar?.id || null
    };
  }

  async getPersonalBases (options: FindManyOptions) {
    const [personalBases, total] = await this.getRepo().personal.PersonalBase.findAndCount(options);

    return {
      personalBases: personalBases.map(v => this.formateDateField(v)),
      total
    };
  }

  async delete (id: number) {
    const personalBase = await this.getRepo().personal.PersonalBase.findOne(id);

    if (!personalBase) {
      return false;
    }

    await this.getRepo().personal.PersonalBase.delete(id);

    return true;
  }
}
