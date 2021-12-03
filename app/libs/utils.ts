/**
 * 工具类
 */

import * as moment from 'moment';
import PersonalBase from '../entities/mysql/personal/PersonalBase';
import PersonalSkill from '../entities/mysql/personal/PersonalSkill';
import User from '../entities/mysql/sys/User';

interface DateFileds {
  createdTime: Date;
  updatedTime: Date;
}

type IAdditionalUserInfo = Pick<PersonalBase, 'nickname'> & { avatarPic: string };

export function formatDate (date: Date, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(format);
}

export function formateDateField<T extends DateFileds> (input: T): Omit<T, 'createdTime' | 'updatedTime'> & { createdTime: string; updatedTime: string; } {
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
  const { password, salt, personalBases, lastLogin, ...user } = userInfo;

  let additionalUser: IAdditionalUserInfo | null = null;
  if (personalBases && personalBases[0]) {
    const {
      nickname,
      avatar
    } = personalBases[0];
    let avatarPic = '';

    if (avatar) {
      avatarPic = avatar.qiniuDomain + avatar.qiniuKey;
    }

    additionalUser = {
      nickname,
      avatarPic
    };
  }

  return formateDateField({
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

  return formateDateField({
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

  return formateDateField({
    ...other,
    baseId,
    baseNickname,
    iconId,
    iconPic
  });
}
