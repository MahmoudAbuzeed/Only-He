import { Injectable } from '@nestjs/common';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepo } from './project.repository';
import { ComponentService } from '../component/component.service';
import { TaskService } from '../task/task.service';
import { ProjectHistoryService } from '../project-history/project-history.service';
import { AttachmentService } from 'src/attachment/attachment.service';
import { FinanceService } from 'src/finance/finance.service';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';
import { SectorService } from 'src/sector/sector.service';

import { Sector } from 'src/sector/entities/sector.entity';
import { StackHolderService } from 'src/stack-holder/stack-holder.service';
import { StackHolder } from 'src/stack-holder/entities/stack-holder.entity';
@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepo: ProjectRepo,
    private readonly componentService: ComponentService,
    private readonly taskService: TaskService,
    private readonly attachmentService: AttachmentService,
    private readonly projectHistoryService: ProjectHistoryService,
    private readonly financeService: FinanceService,
    private readonly sectorService: SectorService,
    private readonly stackholderService: StackHolderService,

    private readonly errorHandler: ErrorHandler,
  ) {}

  async createComponents(components: any[], project: any) {
    for (let index = 0; index < components.length; index++) {
      components[index].project = project.id;
      const sectors = await this.getSectors(
        components[index].currentComponentSector,
      );
      components[index].sectors = sectors;
      try {
        await this.componentService.create(components[index]);
      } catch (error) {
        throw this.errorHandler.badRequest(error);
      }
    }
  }

  async createActivities(activities: any[], createdComponents: any) {
    for (let index = 0; index < activities.length; index++) {
      let relatedComponentActivity: any = activities[index];
      for (let j = 0; j < createdComponents.length; j++) {
        if (activities[index].component_name === createdComponents[j].name) {
          const sectors = await this.getSectors(
            activities[index].currentActivitySector,
          );
          activities[index].sectors = sectors;
          relatedComponentActivity = activities[index];
          relatedComponentActivity.component = createdComponents[j].id;
        }
      }
      try {
        await this.taskService.create(relatedComponentActivity);
      } catch (error) {
        throw this.errorHandler.badRequest(error);
      }
    }
  }

  async createAttachments(attachments: any[], project: any) {
    for (let index = 0; index < attachments.length; index++) {
      attachments[index].project = project.id;
      try {
        await this.attachmentService.create(attachments[index]);
      } catch (error) {
        throw this.errorHandler.badRequest(error);
      }
    }
  }

  async createProjectHistory(history: any, project: any) {
    history.project = project.id;
    try {
      await this.projectHistoryService.create(history);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async createFinance(finance: any, id: number) {
    finance.project = id;
    try {
      await this.financeService.create(finance);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getSectors(sectors: any) {
    const sectorObjs: Sector[] = [];
    for (let index = 0; index < sectors.length; index++) {
      try {
        const sector = await this.sectorService.findOne(sectors[index]);
        sectorObjs.push(sector);
      } catch (error) {
        throw this.errorHandler.badRequest(error);
      }
    }
    return sectorObjs;
  }

  async getStackHolders(stackHolders: any) {
    const stackHolderObjs: StackHolder[] = [];
    for (let index = 0; index < stackHolders.length; index++) {
      try {
        const stackHolder = await this.stackholderService.findOne(
          stackHolders[index],
        );
        stackHolderObjs.push(stackHolder);
      } catch (error) {
        throw this.errorHandler.badRequest(error);
      }
    }
    return stackHolderObjs;
  }

  async create(createProjectDto: CreateProjectDto) {
    // throw this.errorHandler.notFound();
    try {
      const stackHolders = await this.getStackHolders(
        createProjectDto.assignedProjectDonors,
      );

      const sectors = await this.getSectors(
        createProjectDto.assignedProjectSectors,
      );

      createProjectDto['sectors'] = sectors;
      createProjectDto['stackHolders'] = stackHolders;
      const project = await this.projectRepo.create(createProjectDto);
      const { components, activities, attachments, history, finance } =
        createProjectDto;

      await this.createComponents(components, project);
      await this.createActivities(activities, components);
      await this.createAttachments(attachments, project);
      await this.createProjectHistory(history, project);
      await this.createFinance(finance, project.id);

      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.projectRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne(id);
    if (!project) throw this.errorHandler.notFound();
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const updatedProject = await this.projectRepo.update(id, updateProjectDto);
    if (updatedProject.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async updateSectors(id: number, updateProjectDto: UpdateProjectDto) {
    const sectors: any = await this.getSectors(updateProjectDto);
    const updatedProject = await this.projectRepo.save(+id, sectors);

    this.componentService.updateComponentsSectors(
      updatedProject.components,
      updatedProject.sectors,
    );

    if (updatedProject.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    /**
     * TODO
     * Handle remove components and activities related to this project to avoid Errors
     **/
    const deletedProject = await this.projectRepo.remove(+id);
    if (deletedProject.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }

  async upload(files: any) {
    return files;
  }

  async count() {
    try {
      return await this.projectRepo.count();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async loans() {
    try {
      return await this.projectRepo.loans();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async grants() {
    try {
      return await this.projectRepo.grants();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }
}
