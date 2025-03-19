/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/provider/tags.service';
import { PatchPostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly userService: UserService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    public readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async findAll(userId: string) {
    const posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
    return posts;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    const author = await this.userService.findOneById(createPostDto.authorId);
    const tags = await this.tagsService.findMultipleTags(
      createPostDto.tags || [],
    );
    if (!author) {
      throw new Error('Author not found');
    }
    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });
    return await this.postRepository.save(post);
  }

  public async update(patchPostDto: PatchPostDto) {
    // find the tags
    const tags = await this.tagsService.findMultipleTags(
      patchPostDto.tags || [],
    );
    // find the post
    const post = await this.postRepository.findOneBy({ id: patchPostDto.id });

    // update the property of the post
    if (!post) {
      throw new Error('Post not found');
    }
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn
      ? typeof patchPostDto.publishOn === 'string'
        ? new Date(patchPostDto.publishOn)
        : patchPostDto.publishOn
      : post.publishOn;

    // assign the new tags
    post.tags = tags;
    // save the post and return it
    return await this.postRepository.save(post);
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
    return { deleted: true, id };
  }
}
