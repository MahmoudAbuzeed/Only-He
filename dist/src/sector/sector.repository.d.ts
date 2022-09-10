import { Repository } from 'typeorm';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { Sector } from './entities/sector.entity';
export declare class SectorRepo {
    private sectorRepository;
    constructor(sectorRepository: Repository<Sector>);
    create(createSectorDto: CreateSectorDto): Promise<CreateSectorDto & Sector>;
    findAll(): Promise<Sector[]>;
    findOne(id: number): Promise<Sector>;
    update(id: number, updateSectorDto: UpdateSectorDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    findAllProjects(sectorId: number): Promise<Sector[]>;
}
