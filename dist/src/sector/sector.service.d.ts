import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorRepo } from './sector.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class SectorService {
    private readonly sectorRepo;
    private readonly errorHandler;
    constructor(sectorRepo: SectorRepo, errorHandler: ErrorHandler);
    create(createSectorDto: CreateSectorDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/sector.entity").Sector[]>;
    findOne(id: number): Promise<import("./entities/sector.entity").Sector>;
    update(id: number, updateSectorDto: UpdateSectorDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findAllProjects(sectorId: number): Promise<any>;
}
