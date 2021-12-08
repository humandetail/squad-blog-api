import { FindConditions, FindManyOptions, In } from 'typeorm';
import { isNull, isUndefined, isEqual } from 'lodash';
import { BatchPostCategoryDto, BatchPostShowDto, BatchPostTagDto, BatchPostTemplateDto, CreatePostDto, EBatchTagAction, UpdatePostDto } from '../../dto/post/post';
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

  async batchCategory ({ categoryId, newCategoryId, isAll, ids = [] }: BatchPostCategoryDto) {
    const where: FindConditions<Post> = {};

    if (categoryId) {
      const category = await this.getRepo().post.Category.findOne({ id: categoryId });
      if (!category) {
        this.ctx.throw('原分类不存在', 422);
      }
      where.category = category;
    }

    if (!isAll) {
      where.id = In(ids);
    }

    const posts = await this.getRepo().post.Post.find({
      relations: ['category'],
      where
    });

    if (posts.length === 0) {
      return false;
    }

    const newCategory = await this.getRepo().post.Category.findOne({ id: newCategoryId });

    if (!newCategory) {
      this.ctx.throw('新分类不存在', 422);
    }

    await this.getRepo().post.Post.save(posts.map(post => {
      post.category = newCategory;
      return post;
    }));

    return true;
  }

  async batchTemplate ({ templateId, newTemplateId, isAll, ids = [] }: BatchPostTemplateDto) {
    const where: FindConditions<Post> = {};

    if (templateId) {
      const template = await this.getRepo().resource.PostTemplate.findOne({ id: templateId });
      if (!template) {
        this.ctx.throw('原模板不存在', 422);
      }
      where.template = template;
    }

    if (!isAll) {
      where.id = In(ids);
    }

    const posts = await this.getRepo().post.Post.find({
      relations: ['template'],
      where
    });

    if (posts.length === 0) {
      return false;
    }

    const newTemplate = await this.getRepo().resource.PostTemplate.findOne({ id: newTemplateId });

    if (!newTemplate) {
      this.ctx.throw('新模板不存在', 422);
    }

    await this.getRepo().post.Post.save(posts.map(post => {
      post.template = newTemplate;
      return post;
    }));

    return true;
  }

  async batchShow ({ isShow, isAll, ids = [] }: BatchPostShowDto) {
    const posts = await this.getRepo().post.Post.find({
      ...(!isAll ? { where: { id: In(ids) } } : null)
    });

    if (!posts) {
      return false;
    }

    await this.getRepo().post.Post.save(posts.map(post => {
      post.isShow = isShow;
      return post;
    }));

    return true;
  }

  async batchDelete (ids: string[]) {
    const posts = await this.getRepo().post.Post.find({
      where: { id: In(ids) }
    });
    if (!posts) {
      return false;
    }

    await this.getRepo().post.Post.remove(posts);

    return true;
  }

  async batchTag ({ tagId, newTagId, action, isAll = false, ids = [] }: BatchPostTagDto) {
    const tag = await this.getRepo().post.Tag.findOne({ id: newTagId });
    if (!tag) {
      this.ctx.throw('不存在的标签', 422);
    }

    const posts = await this.getRepo().post.Post.find({
      relations: ['tags'],
      ...(!isAll ? { where: { id: In(ids) } } : null)
    });

    let newPosts: Post[] = [];

    switch (action) {
      case EBatchTagAction.add:
        newPosts = posts.map(post => {
          post.tags.push(tag);
          return post;
        });
        break;
      case EBatchTagAction.change:
        // eslint-disable-next-line no-case-declarations
        const oldTag = await this.getRepo().post.Tag.findOne({ id: tagId });
        if (!oldTag) {
          this.ctx.throw('旧标签不存在', 422);
        }
        newPosts = posts.map(post => {
          post.tags = post.tags.map(t => (t.id === oldTag.id ? tag : t));
          return post;
        });
        break;
      case EBatchTagAction.remove:
        newPosts = posts.map(post => {
          post.tags = post.tags.filter(t => t.id !== tag.id);
          return post;
        });
        break;
      default:
        return false;
    }

    await this.getRepo().post.Post.save(newPosts);
    return true;
  }
}
