import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StackHolderService } from './stack-holder.service';
import { StackHolderController } from './stack-holder.controller';
import { StackHolderRepo } from './stack-holder.repository';
import { StackHolder } from './entities/stack-holder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StackHolder])],

  controllers: [StackHolderController],
  providers: [StackHolderService, StackHolderRepo],
})
export class StackHolderModule {}
