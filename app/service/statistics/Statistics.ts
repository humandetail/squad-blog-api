import * as moment from 'moment';
import BaseService from '../BaseService';
import Statistic from '../../entities/mongodb/sys/Statistic';
import Keyword from '../../entities/mongodb/article/Keywords';
import PostView from '../../entities/mongodb/article/PostView';
import { In } from 'typeorm';

export type StatisticRange =
  // 今日
  | 1
  // 昨日
  | 2
  // 最近7天
  | 3
  // 最近30天
  | 4;

const computedUV = (data: Statistic[]) => {
  const uv: Statistic[] = [];
  data.forEach(item => {
    if (!uv.find(i => i.ip === item.ip && i.ua === item.ua)) {
      uv.push(item);
    }
  });

  return uv;
};

export default class StatisticService extends BaseService {
  async addStatistic (data: Pick<Statistic, 'page' | 'source' | 'ua'>) {
    await this.getMongoDBManger().save(Statistic, {
      ...data,
      entry: data.page,
      created_at: new Date()
    });

    return true;
  }

  async addKeyword (data: Keyword) {
    await this.getMongoDBManger().save(Keyword, {
      ...data,
      created_at: new Date()
    });

    return true;
  }

  async addPostView (data: PostView) {
    await this.getMongoDBManger().save(PostView, {
      ...data,
      created_at: new Date()
    });

    return true;
  }

  async getTodayFlow () {
    // const today = moment().format('YYYY-MM-DD');
    // const startDate = new Date(`${today} 00:00:00`);
    // const endDate = new Date(`${today} 23:59:59`);

    const { startDate, endDate } = this.getRangeDate(1);
    const { startDate: yesterdayStartDate, endDate: yesterdayEndDate } = this.getRangeDate(2);

    // const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    // const yesterdayStartDate = new Date(`${yesterday} 00:00:00`);
    // const yesterdayEndDate = new Date(`${yesterday} 23:59:59`);

    // const d = new Statistic();
    // d.ip = '127.2.1';
    // d.source = 'http://www.baidu.com/';
    // d.entry = 'http://www.baidu.com/';
    // d.page = 'http://www.baidu.com/';
    // d.ua = 'aaa';
    // d.created_at = new Date();
    // await this.getMongoDBManger().save(Statistic, d);

    // const d2 = new Statistic();
    // d2.ip = '127.2.1';
    // d2.source = 'http://www.baidu.com/';
    // d2.entry = 'http://www.baidu.com/';
    // d2.page = 'http://www.baidu.com/';
    // d2.ua = 'xxxx';
    // d2.created_at = new Date();
    // await this.getMongoDBManger().save(Statistic, d2);

    const todayData = await this.getMongoDBManger()
      .find(Statistic, {
        where: {
          created_at: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            $gte: startDate,
            $lte: endDate
          }
        },
        select: ['ip', 'ua', 'created_at']
      });

    const todayFlow = {
      pv: todayData.length,
      uv: computedUV(todayData).length,
      ip: new Set(todayData.map(item => item.ip)).size
    };

    const yesterdayData = await this.getMongoDBManger()
      .find(Statistic, {
        where: {
          created_at: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            $gte: yesterdayStartDate,
            $lte: yesterdayEndDate
          }
        },
        select: ['ip', 'ua', 'created_at']
      });

    const yesterdayFlow = {
      pv: yesterdayData.length,
      uv: computedUV(yesterdayData).length,
      ip: new Set(yesterdayData.map(item => item.ip)).size
    };

    return {
      todayFlow,
      yesterdayFlow
    };
  }

  async getPV (range: StatisticRange) {
    const { startDate, endDate } = this.getRangeDate(range);

    const data = await this.getMongoDBManger()
      .find(Statistic, {
        where: {
          created_at: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            $gte: startDate,
            $lte: endDate
          }
        },
        select: ['created_at']
      });

    return this.groupPV(data, range);
  }

  async getUV (range: StatisticRange) {
    const { startDate, endDate } = this.getRangeDate(range);

    const data = await this.getMongoDBManger()
      .find(Statistic, {
        where: {
          created_at: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            $gte: startDate,
            $lte: endDate
          }
        },
        select: ['ip', 'ua', 'created_at']
      });

    return this.groupUV(data, range);
  }

  async getTop10Keywords (range: StatisticRange) {
    // const d = Array.from({ length: 2 }, (_, index) => {
    //   return {
    //     ip: `192.168.0.${index + 1}`,
    //     keyword: 'Random' + index
    //   };
    // });

    // for (let i = 0; i < d.length; i++) {
    //   const k = new Keyword();
    //   k.ip = d[i].ip;
    //   k.keyword = d[i].keyword;
    //   k.created_at = new Date(moment().subtract(i, 'day').format('YYYY-MM-DD'));

    //   await this.getMongoDBManger().save(Keyword, k);
    // }

    const { startDate, endDate } = this.getRangeDate(range);

    const data = await this.getMongoDBManger()
      .getMongoRepository(Keyword)
      .aggregate([
        {
          $match: {
            created_at: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: {
              ip: '$ip',
              keyword: '$keyword'
            },
            // keyword: {
            //   $push: '$keyword'
            // },
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $limit: 10
        }
      ])
      .toArray();

    return (data as any[]).map(({ _id, count }) => {
      return {
        ..._id,
        count,
      };
    });
  }

  async getTop10PostViews (range: StatisticRange) {
    // const ids = ['1YPyygP004', '41Qgc6pC7W', '4WyTFe7AAH',
    //   '5JfZxGzfgh', '61sCNaK9IP', '6JHJDsxJHw', '6Q9UC5HHtD', '85Ngxbjv41'
    // ];

    // const d = Array.from({ length: 20 }, (_, index) => {
    //   return {
    //     ip: `192.168.0.${index + 1}`,
    //     postId: ids[Math.floor(Math.random() * 2 + 8)]
    //   };
    // });

    // for (let i = 0; i < d.length; i++) {
    //   const k = new PostView();
    //   k.ip = d[i].ip;
    //   k.postId = d[i].postId;
    //   k.created_at = new Date();

    //   await this.getMongoDBManger().save(PostView, k);
    // }

    const { startDate, endDate } = this.getRangeDate(range);

    const data = await this.getMongoDBManger()
      .getMongoRepository(PostView)
      .aggregate([
        {
          $match: {
            created_at: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: '$postId',
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $limit: 10
        }
      ])
      .toArray() as any[];

    const posts = await this.getRepo().post.Post.find({
      where: {
        id: In(data.map(({ _id }) => _id))
      },
      select: ['id', 'title']
    });

    return data.map(({ _id, count, }) => {
      const item = posts.find(post => post.id === _id);

      return {
        id: _id,
        count,
        title: item?.title
      };
    }).filter(item => item.title);
  }

  protected getRangeDate (range: StatisticRange) {
    let startDate = new Date();
    let endDate = new Date();

    switch (range) {
      case 2:
        startDate = new Date(`${moment().subtract(1, 'day').format('YYYY-MM-DD')} 00:00:00`);
        endDate = new Date(`${moment().subtract(1, 'day').format('YYYY-MM-DD')} 23:59:59`);
        break;

      case 3:
        startDate = new Date(`${moment().subtract(7, 'day').format('YYYY-MM-DD')} 00:00:00`);
        break;

      case 4:
        startDate = new Date(`${moment().subtract(30, 'day').format('YYYY-MM-DD')} 00:00:00`);
        break;

      case 1:
      default:
        startDate = new Date(`${moment().format('YYYY-MM-DD')} 00:00:00`);
        break;
    }

    return {
      startDate,
      endDate
    };
  }

  protected groupPV (data: Statistic[], range: StatisticRange) {
    const group = this.getGroup(range);

    let key = '';

    data.forEach(item => {
      if ([1, 2].includes(range)) {
        key = moment(item.created_at).format('HH') + ':00';
      } else {
        key = moment(item.created_at).format('YYYY-MM-DD');
      }
      group.set(key, group.get(key)! + 1);
    });

    return Object.fromEntries(group);
  }

  protected groupUV (data: Statistic[], range: StatisticRange) {
    const group = this.getGroup(range);

    const exists = new Set<string>();

    let key = '';

    data.forEach(item => {
      if ([1, 2].includes(range)) {
        key = moment(item.created_at).format('HH') + ':00';
      } else {
        key = moment(item.created_at).format('YYYY-MM-DD');
      }
      group.set(key, group.get(key)! + (exists.has(key + ':' + item.ua) ? 0 : 1));

      exists.add(key + ':' + item.ua);
    });

    return Object.fromEntries(group);
  }

  protected getGroup (range: StatisticRange) {
    const group = new Map<string, number>();

    let i = 0;

    if ([1, 2].includes(range)) {
      i = 0;
      const max = range === 1 ? Number(moment().format('HH')) : 23;

      while (i <= max) {
        group.set(`${i}`.padStart(2, '0') + ':00', 0);
        i++;
      }
    } else {
      const max = range === 3 ? 7 : 30;

      while (i <= max) {
        group.set(moment().subtract(max - i, 'day').format('YYYY-MM-DD'), 0);
        i++;
      }
    }

    return group;
  }
}
