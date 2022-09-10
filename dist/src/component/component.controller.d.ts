import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
export declare class ComponentController {
    private readonly componentService;
    constructor(componentService: ComponentService);
    create(createComponentDto: CreateComponentDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/component.entity").Component[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateComponentDto: UpdateComponentDto): Promise<{
        message: string;
    }>;
    updateSectors(id: string, updateComponentDto: any): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
