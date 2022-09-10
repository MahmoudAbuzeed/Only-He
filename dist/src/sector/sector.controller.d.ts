import { SectorService } from './sector.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
export declare class SectorController {
    private readonly sectorService;
    constructor(sectorService: SectorService);
    create(createSectorDto: CreateSectorDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/sector.entity").Sector[]>;
    findOne(id: string): Promise<import("./entities/sector.entity").Sector>;
    update(id: string, updateSectorDto: UpdateSectorDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findAllProjects(id: string): Promise<any>;
}
