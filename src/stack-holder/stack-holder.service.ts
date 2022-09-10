import { Injectable } from '@nestjs/common';
import { CreateStackHolderDto } from './dto/create-stack-holder.dto';
import { UpdateStackHolderDto } from './dto/update-stack-holder.dto';
import { StackHolderRepo } from './stack-holder.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';
@Injectable()
export class StackHolderService {
  constructor(
    private readonly stackHolderRepo: StackHolderRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createStackHolderDto: CreateStackHolderDto) {
    try {
      await this.stackHolderRepo.create(createStackHolderDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      const initialValue = 0;
      const stackHolders = await this.stackHolderRepo.findAll();
      stackHolders.forEach((stackHolder) =>
        stackHolder.projects.reduce((previousValue, currentValue) => {
          const sum = previousValue + currentValue.budget;
          stackHolder['sum'] = sum;
          return sum;
        }, initialValue),
      );
      return stackHolders;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const stackHolder = await this.stackHolderRepo.findOne(id);
    if (!stackHolder) throw this.errorHandler.notFound();
    return stackHolder;
  }

  async update(id: number, updateStackHolderDto: UpdateStackHolderDto) {
    const updatedStackHolder = await this.stackHolderRepo.update(
      id,
      updateStackHolderDto,
    );
    if (updatedStackHolder.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedStackHolder = await this.stackHolderRepo.remove(+id);
    if (deletedStackHolder.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
  async findAllProjects(stackHolderId: number) {
    try {
      const stackHolders = (await this.stackHolderRepo.findAllProjects(
        stackHolderId,
      )) as any;
      const result = stackHolders.map((stackHolder) => stackHolder.projects);
      return result.flat();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }
}
