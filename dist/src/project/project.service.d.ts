import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepo } from './project.repository';
import { ComponentService } from '../component/component.service';
import { TaskService } from '../task/task.service';
import { ProjectHistoryService } from '../project-history/project-history.service';
import { AttachmentService } from 'src/attachment/attachment.service';
import { FinanceService } from 'src/finance/finance.service';
import { ErrorHandler } from 'shared/errorHandler.service';
import { SectorService } from 'src/sector/sector.service';
import { Sector } from 'src/sector/entities/sector.entity';
import { StackHolderService } from 'src/stack-holder/stack-holder.service';
import { StackHolder } from 'src/stack-holder/entities/stack-holder.entity';
export declare class ProjectService {
    private readonly projectRepo;
    private readonly componentService;
    private readonly taskService;
    private readonly attachmentService;
    private readonly projectHistoryService;
    private readonly financeService;
    private readonly sectorService;
    private readonly stackholderService;
    private readonly errorHandler;
    constructor(projectRepo: ProjectRepo, componentService: ComponentService, taskService: TaskService, attachmentService: AttachmentService, projectHistoryService: ProjectHistoryService, financeService: FinanceService, sectorService: SectorService, stackholderService: StackHolderService, errorHandler: ErrorHandler);
    createComponents(components: any[], project: any): Promise<void>;
    createActivities(activities: any[], createdComponents: any): Promise<void>;
    createAttachments(attachments: any[], project: any): Promise<void>;
    createProjectHistory(history: any, project: any): Promise<void>;
    createFinance(finance: any, id: number): Promise<void>;
    getSectors(sectors: any): Promise<Sector[]>;
    getStackHolders(stackHolders: any): Promise<StackHolder[]>;
    create(createProjectDto: CreateProjectDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/project.entity").Project[]>;
    findOne(id: number): Promise<any>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<{
        message: string;
    }>;
    updateSectors(id: number, updateProjectDto: UpdateProjectDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    upload(files: any): Promise<any>;
    count(): Promise<number>;
    loans(): Promise<any>;
    grants(): Promise<any>;
}
