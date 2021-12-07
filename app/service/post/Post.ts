import { FindManyOptions, In } from 'typeorm';
import { isNull, isUndefined, isEqual } from 'lodash';
import { CreatePostDto, UpdatePostDto } from '../../dto/post/post';
import BaseService, { IWhereCondition } from '../BaseService';
import Post from '../../entities/mysql/post/Post';
import PostView from '../../entities/mongodb/article/PostView';

export interface IPostWithViewCount extends Post {
  viewCount?: number;
}

export default class PostService extends BaseService {
  async create ({
    coverId,
    categoryId,
    tags,
    templateId = 0,
    seoTitle = '',
    seoKeywords = '',
    seoDescription = '',
    ...data
  }: CreatePostDto) {
    const Repo = this.getRepo();
    const category = await Repo.post.Category.findOne({ id: categoryId });
    if (!category) {
      this.ctx.throw('文章分类不存在', 422);
    }

    const cover = await Repo.resource.Picture.findOne({ id: coverId });
    if (!cover) {
      this.ctx.throw('图片不存在', 422);
    }

    const tagLists = await Repo.post.Tag.find({ where: { id: In(tags) } });
    if (tagLists.length === 0) {
      this.ctx.throw('文章标签不存在', 422);
    }

    const post = Repo.post.Post.create({
      ...data,
      category,
      cover,
      tags: tagLists,
      seoTitle,
      seoKeywords,
      seoDescription,
      operator: this.ctx.token.username,
      id: this.getHelper().getNanoid()
    });

    if (templateId) {
      const template = await Repo.resource.PostTemplate.findOne({ id: templateId });
      if (!template) {
        this.ctx.throw('模板不存在', 422);
      }

      post.template = template;
    }

    await Repo.post.Post.save(post);
  }

  async update (id: number, {
    categoryId,
    coverId,
    templateId,
    tags,
    ...data
  }: Partial<UpdatePostDto>) {
    const Repo = this.getRepo();
    const Post = Repo.post.Post;
    const post = await Post.findOne({
      where: { id },
      relations: ['tags', 'cover', 'template', 'category']
    });
    if (!post) {
      return false;
    }

    if (categoryId && post.category.id !== categoryId) {
      const category = await Repo.post.Category.findOne({ id: categoryId });
      if (!category) {
        this.ctx.throw('文章分类不存在', 422);
      }
      post.category = category;
    }

    if (coverId && post.cover.id !== coverId) {
      const cover = await Repo.resource.Picture.findOne({ id: coverId });
      if (!cover) {
        this.ctx.throw('图片不存在', 422);
      }
      post.cover = cover;
    }

    if (templateId && post.template.id !== templateId) {
      const template = await Repo.resource.PostTemplate.findOne({ id: templateId });
      if (!template) {
        this.ctx.throw('模板不存在', 422);
      }
      post.template = template;
    }

    if (tags && tags.length !== 0 && !isEqual(post.tags.map(v => v.id), tags)) {
      const tagLists = await Repo.post.Tag.find({ where: { id: In(tags) } });
      if (tagLists.length === 0) {
        this.ctx.throw('文章标签不存在', 422);
      }
      post.tags = tagLists;
    }

    Object.entries(data).forEach(([key, value]) => {
      if (!isUndefined(value) && !isNull(value)) {
        post[key] = value;
      }
    });
    await Post.save(post);
    return true;
  }

  async find (options: FindManyOptions, relations: string[] = [], withViewCount = false): Promise<[Array<IPostWithViewCount>, number]> {
    const [posts, total] = await this.getRepo().post.Post.findAndCount({
      ...options,
      relations
    } as any);

    if (withViewCount) {
      const data: Array<Post & { viewCount: number }> = [];
      for (const post of posts) {
        const viewCount = await this.getMongoDBManger().count(PostView, { postId: post.id });
        data.push({
          ...post,
          viewCount
        });
      }

      return [data, total];
    }

    return [posts, total];
  }

  async findOne (where: IWhereCondition<Post>, relations: string[] = [], withViewCount = false): Promise<IPostWithViewCount | undefined> {
    const post = await this.getRepo().post.Post.findOne({ where, relations });
    if (!post || !withViewCount) {
      return post;
    }
    const viewCount = await this.getMongoDBManger().count(PostView, { postId: post.id });
    return {
      ...post,
      viewCount
    };
  }

  async delete (id: string) {
    const post = await this.getRepo().post.Post.findOne(id, { relations: ['tags'] });
    if (!post) {
      return false;
    }

    await this.getRepo().post.Post.remove(post);

    try {
      await this.getMongoDBManger().getMongoRepository(PostView).deleteMany({ postId: id });
    } catch (e) {
      this.ctx.logger.error(`[Exception]: ${e}`);
    }

    return true;
  }
}
