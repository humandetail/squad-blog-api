import { FindManyOptions } from 'typeorm';
import { isNull, isUndefined } from 'lodash';
import { PostTagDto } from '../../dto/post/tag';
import Tag from '../../entities/mysql/post/Tag';
import BaseService, { IWhereCondition } from '../BaseService';
import { FrontendPageGetDto } from '../../dto/common/common';

export default class PostTagService extends BaseService {
  async create (tag: PostTagDto) {
    return await this.getRepo().post.Tag.insert({
      ...tag,
      operator: this.ctx.token.username
    });
  }

  async update (id: number, tag: Partial<PostTagDto>) {
    const PostTag = this.getRepo().post.Tag;
    const data = await PostTag.findOne(id);
    if (!data) {
      return false;
    }

    Object.entries(tag).forEach(([key, value]) => {
      if (!isUndefined(value) && !isNull(value)) {
        data[key] = value;
      }
    });
    await PostTag.save(data);
    return true;
  }

  async getPictureCategoies (options: FindManyOptions) {
    return this.getRepo().post.Tag.findAndCount(options);
  }

  async findOne (where: IWhereCondition<Tag>) {
    return this.getRepo().post.Tag.findOne({ where });
  }

  async findAll () {
    return this.getRepo().post.Tag.query(`
      SELECT 
        t.id AS id,
        t.name AS name,
        t.display_name AS displayName,
        COUNT(name) AS postCount,
        t.created_time AS createdTime,
        t.updated_time AS updatedTime
      FROM
        post_tags_tag c
          LEFT JOIN
        post p ON c.postId = p.id
          LEFT JOIN
        tag t ON c.tagId = t.id
      WHERE
        p.is_show = 1
      GROUP BY name
      ORDER BY t.sort DESC , t.created_time DESC;
    `);
  }

  async getPostIdsByTagId (id: number, { current = 1, pageSize = 10 }: FrontendPageGetDto) {
    return this.getRepo().post.Tag.query(`
      SELECT
        postId 
      FROM
        post_tags_tag r
        LEFT JOIN post p ON r.postId = p.id 
      WHERE
        r.tagId = ${id} 
        AND p.is_show = 1 
        LIMIT ${(current - 1) * pageSize},${pageSize};
    `);
  }

  async getPostsByTagIds (tagId: number, ids: string[]): Promise<[Record<string, any>[], number]> {
    const [ { total = 0 } ] = await this.getRepo().post.Tag.query(`
      SELECT
        COUNT( DISTINCT Post.id ) AS total 
      FROM
        post Post
        LEFT JOIN post_tags_tag Post_Post__tags ON Post_Post__tags.postId = Post.id
        LEFT JOIN tag Post__tags ON Post__tags.id = Post_Post__tags.tagId
        LEFT JOIN category Post__category ON Post__category.id = Post.categoryId
        LEFT JOIN picture Post__cover ON Post__cover.id = Post.coverId 
      WHERE
        (
          Post.is_show = 1 
        AND Post_Post__tags.tagId = ${tagId});
    `);

    if (total <= 0) {
      return [[], 0];
    }

    const posts = await this.getRepo().post.Tag.query(`
      SELECT
        Post.id AS id,
        Post.title AS title,
        Post.summary AS summary,
        Post.author AS author,
        Post.recommendation_index AS recommendationIndex,
        Post__category.name AS categoryName,
        Post__category.display_name AS categoryDisplayName,
        CONCAT(Post__cover.qiniu_domain,Post__cover.qiniu_key) AS coverPic,
        Post.created_time AS createdTime,
        Post.updated_time AS updatedTime
      FROM
        post Post
        LEFT JOIN post_tags_tag Post_Post__tags ON Post_Post__tags.postId = Post.id
        LEFT JOIN category Post__category ON Post__category.id = Post.categoryId
        LEFT JOIN picture Post__cover ON Post__cover.id = Post.coverId 
      WHERE
        Post.is_show = 1 AND Post.id IN ( "${ids.join('","')}" ) and Post_Post__tags.tagId = ${tagId}
      ORDER BY
        Post.sort DESC,
        Post.created_time DESC;
    `);

    return [posts, +total];
  }

  async delete (id: number) {
    const { affected } = await this.getRepo().post.Tag.delete(id);

    return !!affected;
  }
}
