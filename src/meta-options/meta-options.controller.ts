import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionService } from './provider/meta-option.service';

@Controller('meta-options')
export class MetaOptionController {
  constructor(private readonly metaOptionService: MetaOptionService) {}
  @Post()
  public create(@Body() createPostMetaOptionsDto: CreatePostMetaOptionDto) {
    return this.metaOptionService.create(createPostMetaOptionsDto);
  }
}
