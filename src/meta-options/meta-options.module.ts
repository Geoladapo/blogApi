import { Module } from '@nestjs/common';
import { MetaOptionController } from './meta-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from './meta-options.entity';
import { MetaOptionService } from './provider/meta-option.service';

@Module({
  controllers: [MetaOptionController],
  providers: [MetaOptionService],
  imports: [TypeOrmModule.forFeature([MetaOption])],
})
export class MetaOptionModule {}
