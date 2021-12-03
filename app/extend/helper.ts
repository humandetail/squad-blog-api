import * as fs from 'fs';
import * as path from 'path';
import { IHelper } from 'egg';
import { customAlphabet } from 'nanoid';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import * as NodeRSA from 'node-rsa';
import * as jwt from 'jsonwebtoken';
import resCode from '../../config/resCode';

export type IResCode = keyof typeof resCode;

/**
 * 使用 openssl 生成公钥/私钥
 * # 在当前目录生成私钥
 * openssl genrsa -out rsa_private.pem 1024
 * # 在当前目录生成对应的公钥
 * openssl rsa -in rsa_private.pem -out rsa_public.pem -pubout
 */
const _privateKey = fs.readFileSync(path.resolve(__dirname, '../../config/cert/rsa_private.pem'));
// 使用 publicKey 生成 abc@123
// VL5Mw/szCqxDzyvHNbT6NnJAhskqWOuKY65ECZQbAv++6EZMjqzHeINgepSHlkSzaHJ/3yP6LN4BZWF9kk8lU3z/gaIjaC1ntddA3Vz9/fuuO0/NO3LDQDsgB8FuCkPvdxYnY5hLopf7G6rmjER0VUi7NqvsijNh4Nr/0/dD7EI=
// 123@abc
// mkNW4gS9VXIWYXTXSQg/2ovA7sLsbecKj0d3/VA3RNr9C/oyR2j2KXby8+0Zvbek764PrPCdYR3lLkOK6Z8J5/zxsNWbvCS5On4mRUl0enqO4io5akbWy/NIynZQfcC0kFf4rqymRblEZo9Iy1cQcY5cLyH8+oKfHiyi7YO5+1w=

export default {
  /**
   * 获取指定长度的 nanoid
   * @param size - 长度
   * @returns 指定长度的 nanoid
   */
  getNanoid (size = 10) {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', size);
    return nanoid();
  },

  genRandomString (size = 64, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    const len = alphabet.length;
    let str = '';
    for (let i = 0; i < size; i++) {
      str += alphabet.charAt(Math.floor(Math.random() * len));
    }

    return str;
  },

  formatDate (date: any, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format);
  },

  /**
   * 获取当前时间
   * @param format -
   * @returns
   */
  now (format = 'YYYY-MM-DD HH:mm:ss') {
    return moment().format(format);
  },

  /**
   * aes 加密
   * @param this -
   * @param content - 需要加密的字符
   * @param secret -
   * @returns
   */
  aesEncrypt (this: IHelper, content: string, secret: string): string {
    return CryptoJS.AES.encrypt(content, secret).toString();
  },

  /**
   * aes 解密
   * @param this -
   * @param encrypted - 已加密的字符串
   * @param secret -
   * @returns
   */
  aesDecrypt (this: IHelper, encrypted: string, secret: string): string {
    return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
  },

  /**
   * rsa 解密
   * @see https://github.com/rzcoder/node-rsa
   *
   * @param decrypted -
   * @returns
   */
  rsaDecrypt (decrypted: string): string {
    if (!decrypted) return decrypted;

    const key = new NodeRSA(_privateKey);
    key.setOptions({ encryptionScheme: 'pkcs1' }); // jsencrypt 使用 pkcs1 格式
    return key.decrypt(decrypted, 'utf8');
  },

  /**
   * MD5 加密
   * @param content -
   * @returns
   */
  md5 (content: string): string {
    return CryptoJS.MD5(content).toString();
  },

  /**
   * SHA-1 加密
   * @param content -
   * @returns
   */
  sha1 (content: string): string {
    return CryptoJS.SHA1(content).toString();
  },

  /**
   * 密码加密
   * @param this -
   * @param content - 前端传递过来的密文
   * @param salt - 对应的密码盐
   * @return { string }
   */
  passwordEncrypt (this: IHelper, content: string, salt: string): string {
    return this.sha1(`${this.md5(content)}${salt}`);
  },

  /**
   * JsonWebToken Sign
   * @see https://github.com/auth0/node-jsonwebtoken
   */
  jwtSign(this: IHelper, sign: any, options?: any) {
    return jwt.sign(sign, this.config.jwt.secret, options);
  },

  /**
   * JsonWebToken Verify
   * @see https://github.com/auth0/node-jsonwebtoken
   */
  jwtVerify(this: IHelper, token: string, options?: any) {
    return jwt.verify(token, this.config.jwt.secret, options);
  },

  /**
   * 获取 ip
   */
  getIp (this: IHelper): string {
    const req = this.ctx.req as any;

    return (
      req?.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      req?.connection?.remoteAddress || // 判断 connection 的远程 IP
      req?.socket?.remoteAddress || // 判断后端的 socket 的 IP
      req?.connection?.socket?.remoteAddress
    ).replace('::ffff:', '');
  },

  /**
   * 获取返回码对应的信息
   * @param code - 返回码
   * @return 信息
   */
  getResMessage (code: IResCode): string {
    const message = resCode[code][0];

    return message;
  }
};
