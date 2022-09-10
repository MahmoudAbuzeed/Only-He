import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { StackHolder } from './entities/stack-holder.entity';

@Injectable()
export class StackHolderRepo {
  constructor(
    @InjectRepository(StackHolder)
    private stackHolderRepo: Repository<StackHolder>,
  ) {}

  async create(createStackHolderDto: Partial<StackHolder>) {
    return await this.stackHolderRepo.save(createStackHolderDto);
  }

  async findAll() {
    return await this.stackHolderRepo.find({
      relations: ['projects']
    });
  }

  async findOne(id: number) {
    return await this.stackHolderRepo.findOne(id);
  }

  async update(id: number, updateStackHolderDto: Partial<StackHolder>) {
    return await this.stackHolderRepo.update(id, updateStackHolderDto);
  }

  async remove(id: number) {
    return await this.stackHolderRepo.delete({ id });
  }
  async findAllProjects(stackHolderId: number) {
    return await this.stackHolderRepo.find({
      relations: ['projects'],
      where: { id: stackHolderId }
    });
  }
}
