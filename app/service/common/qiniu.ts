/**
 * 七牛云服务
 */
import * as qiniu from 'qiniu';
import * as path from 'path';
import * as moment from 'moment';
import BaseService from '../BaseService';

export default class QiniuService extends BaseService {
  /**
   * 上传图片
   * @param file - 需要上传的文件
   * @param categoryName - 分类名称
   * @returns -
   */
  async upload(file: any, categoryName: string) {
    return new Promise((resole, reject) => {
      const { bucket, accessKey, secretKey, zone } = this.config.qiniu;
      const key = `${categoryName}/${moment().format('YYYYMMDD')}${this.getHelper().genRandomString(8)}${path.extname(file.filename)}`;
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      const options = {
        scope: `${bucket}:${key}`,
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const qiniuConfig: any = new qiniu.conf.Config();
      qiniuConfig.zone = qiniu.zone[zone];
      const uploadToken = putPolicy.uploadToken(mac);
      const localFile = file.filepath;
      const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
      const putExtra = new qiniu.form_up.PutExtra();
      // 文件上传
      formUploader.putFile(
        uploadToken,
        key,
        localFile,
        putExtra,
        function(err, body, info) {
          if (err) {
            reject(err);
          }
          if (info.statusCode === 200) {
            resole(body);
          } else {
            reject(err || body?.error || info?.data?.error || '资源上传失败');
          }
        }
      );
    });
  }

  /**
   * 重命名资源
   * @param srcKey - 旧文件名
   * @param destKey - 新文件名
   */
  rename (srcKey: string, destKey: string) {
    return new Promise((resolve, reject) => {
      const { bucket, accessKey, secretKey, zone } = this.config.qiniu;
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      const qiniuConfig: any = new qiniu.conf.Config();
      qiniuConfig.zone = qiniu.zone[zone];
      const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig);

      bucketManager.move(
        bucket,
        srcKey,
        bucket,
        destKey,
        { force: /* 强制覆盖同名 */true },
        function(err, _body, info) {
          if (err) {
            reject(err);
          } else {
            // 200 is success
            resolve(info);
          }
        }
      );
    });
  }

  /**
   * 批量删除文件
   */
  async delete(pictures: string[]) {
    return new Promise((resolve, reject) => {
      const { bucket, accessKey, secretKey, zone } = this.config.qiniu;
      if (pictures && pictures.length > 0) {
        const keys = pictures.map(key => {
          return qiniu.rs.deleteOp(bucket, key);
        });
        const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        const qiniuConfig: any = new qiniu.conf.Config();
        qiniuConfig.zone = qiniu.zone[zone];
        const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig);
        bucketManager.batch(keys, (err, _body, info) => {
          if (err) {
            reject(err);
          } else {
            // 200 is success, 298 is part success
            if (parseInt(info.statusCode) / 100 === 2) {
              resolve(true);
            } else {
              reject(info.deleteusCode);
            }
          }
        });
      }
    });
  }
}
