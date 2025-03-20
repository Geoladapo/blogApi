import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UserService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/provider/tags.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';
import { Tags } from 'src/tags/tags.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly userService: UserService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    public readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async create(
    @Body() createPostDto: CreatePostDto,
    user: ActiveUserData,
  ) {
    let author: User | null = null;
    let tags: Tags[] | null = null;
    try {
      author = await this.userService.findOneById(user.sub);

      tags = await this.tagsService.findMultipleTags(createPostDto.tags || []);
    } catch (error) {
      throw new ConflictException(error);
    }

    if ((createPostDto.tags ?? []).length !== tags.length) {
      throw new BadRequestException('Please check your tags ids');
    }

    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });
    try {
      return await this.postRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }
}
