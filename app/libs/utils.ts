/**
 * 工具类
 */

import * as moment from 'moment';
import PersonalBase from '../entities/mysql/personal/PersonalBase';
import PersonalSkill from '../entities/mysql/personal/PersonalSkill';
import PersonalWork from '../entities/mysql/personal/PersonalWork';
import Post from '../entities/mysql/post/Post';
import PostTemplate from '../entities/mysql/resource/PostTemplate';
import Role from '../entities/mysql/sys/Role';
import Setting from '../entities/mysql/sys/Setting';
import User from '../entities/mysql/sys/User';
import { IPostWithViewCount } from '../service/post/Post';

interface DateFileds {
  createdTime: Date;
  updatedTime: Date;
}

type IAdditionalUserInfo = Pick<PersonalBase, 'nickname'> & { avatarPic: string, roleId: number | null, roleName: string };

export function formatDate (date: Date, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(format);
}

export function formatDateField<T extends DateFileds> (input: T): Omit<T, 'createdTime' | 'updatedTime'> & { createdTime: string; updatedTime: string; } {
  const { createdTime, updatedTime, ...otherProps } = input;
  return {
    ...otherProps,
    createdTime: formatDate(createdTime),
    updatedTime: formatDate(updatedTime)
  };
}

/**
 * 格式化返回的用户信息
 * @param userInfo - 用户信息
 */
export const formatUserInfo = (userInfo: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, salt, personalBases, role, lastLogin, ...user } = userInfo;

  const additionalUser: IAdditionalUserInfo = {
    nickname: '',
    avatarPic: '',
    roleId: null,
    roleName: ''
  };
  if (personalBases && personalBases[0]) {
    const {
      nickname,
      avatar
    } = personalBases[0];

    additionalUser.nickname = nickname;

    if (avatar) {
      additionalUser.avatarPic = avatar.qiniuDomain + avatar.qiniuKey;
    }
  }

  if (role) {
    additionalUser.roleId = role.id;
    additionalUser.roleName = role.name;
  }

  return formatDateField({
    ...user,
    ...additionalUser,
    lastLogin: lastLogin ? formatDate(lastLogin) : ''
  });
};

/**
 * 格式化返回的个人简介信息
 */
export function formatPersonalBase (baseInfo: PersonalBase) {
  const { user, avatar, ...other } = baseInfo;

  let userId = '';
  let username = '';
  let avatarId: number | null = null;
  let avatarPic = '';

  if (user) {
    userId = user.id;
    username = user.username;
  }

  if (avatar) {
    avatarId = avatar.id;
    avatarPic = avatar.qiniuDomain + avatar.qiniuKey;
  }

  return formatDateField({
    ...other,
    userId,
    username,
    avatarId,
    avatarPic
  });
}

/**
 * 格式化返回的个人技能信息
 */
export function formatPersonalSkill (skillInfo: PersonalSkill) {
  const { base, icon, ...other } = skillInfo;

  let baseId: number | null = null;
  let baseNickname = '';
  let iconId: number | null = null;
  let iconPic = '';

  if (base) {
    baseId = base.id;
    baseNickname = base.nickname;
  }

  if (icon) {
    iconId = icon.id;
    iconPic = icon.qiniuDomain + icon.qiniuKey;
  }

  return formatDateField({
    ...other,
    baseId,
    baseNickname,
    iconId,
    iconPic
  });
}

/**
 * 格式化返回的个人作品集信息
 */
export function formatPersonalWork (personalWork: PersonalWork) {
  const { base, pictures, ...other } = personalWork;

  let baseId: number | null = null;
  let baseNickname = '';

  if (base) {
    baseId = base.id;
    baseNickname = base.nickname;
  }
  return formatDateField({
    ...other,
    baseId,
    baseNickname,
    pictures: pictures.map(({ id, qiniuDomain, qiniuKey }) => ({ id, url: qiniuDomain + qiniuKey }))
  });
}

/**
 * 格式化返回的网站设置信息
 */
export function formatSetting ({ logo, ...setting }: Setting) {
  let logoId: number | null = null;
  let logoPic = '';

  if (logo) {
    logoId = logo.id;
    logoPic = logo.qiniuDomain + logo.qiniuKey;
  }

  return formatDateField({
    ...setting,
    logoId,
    logoPic
  });
}


/**
 * 格式化返回的网站设置信息
 */
export function formatPostTemplate ({ cover, ...template }: PostTemplate) {
  let coverId: number | null = null;
  let coverPic = '';

  if (cover) {
    coverId = cover.id;
    coverPic = cover.qiniuDomain + cover.qiniuKey;
  }

  return formatDateField({
    ...template,
    coverId,
    coverPic
  });
}

/**
 * 格式化返回的文章信息
 */
export function formatPost ({
  tags,
  cover,
  category,
  template,
  ...post
}: IPostWithViewCount) {
  let coverId: number | null = null;
  let coverPic = '';
  let categoryId: number | null = null;
  let categoryName = '';
  let templateId: number | null = null;
  let templateName = '';

  if (cover) {
    coverId = cover.id;
    coverPic = cover.qiniuDomain + cover.qiniuKey;
  }

  if (category) {
    categoryId = category.id;
    categoryName = category.displayName;
  }

  if (template) {
    templateId = template.id;
    templateName = template.name;
  }

  return formatDateField({
    ...post,
    categoryId,
    categoryName,
    coverId,
    coverPic,
    tags: tags ? tags.map(({ id, displayName }) => ({ id, displayName })) : [],
    templateId,
    templateName
  });
}

/**
 * 格式化返回的文章信息
 */
export function formatFrontendPost ({
  tags,
  cover,
  category,
  id,
  title,
  summary,
  author,
  recommendationIndex,
  createdTime,
  updatedTime
}: IPostWithViewCount) {
  let coverPic = '';
  let categoryName = '';
  let categoryDisplayName = '';

  if (cover) {
    coverPic = cover.qiniuDomain + cover.qiniuKey;
  }

  if (category) {
    categoryName = category.name;
    categoryDisplayName = category.displayName;
  }

  return formatDateField({
    id,
    title,
    summary,
    author,
    recommendationIndex,
    categoryName,
    categoryDisplayName,
    coverPic,
    tags: tags ? tags.map(({ name, displayName }) => ({ name, displayName })) : [],
    createdTime,
    updatedTime
  });
}

// 格式化前台返回的文章详情信息
export function formatFrontendPostDetail ({
  createdTime,
  updatedTime,
  id,
  title,
  summary,
  content,
  author,
  source,
  recommendationIndex,
  seoTitle,
  seoKeywords,
  seoDescription,
  tags,
  category,
  cover,
  template
}: Post) {
  return {
    id,
    title,
    summary,
    content,
    author,
    source,
    recommendationIndex,
    seoTitle,
    seoKeywords,
    seoDescription,
    createdTime,
    updatedTime,
    tags: (tags || []).map(({ name, displayName }) => ({ name, displayName })),
    category: category ? { name: category.name, displayName: category.displayName } : null,
    coverPic: cover ? cover.qiniuDomain + cover.qiniuKey : '',
    template: template ? template.qiniuDomain + template.qiniuKey : ''
  };
}

// 格式化角色权限菜单信息
export function formatRoleMenus ({ menus, ...role }: Role) {
  return formatDateField({
    ...role,
    menus: menus.map(({ id, name, parentId }) => ({ id, name, parentId }))
  });
}
