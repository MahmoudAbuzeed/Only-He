import { Occupation } from '../types/guards.enum';
export declare const OCCUPATIONS_KEY = "occupations";
export declare const OccupationsGuard: (...occupations: Occupation[]) => import("@nestjs/common").CustomDecorator<string>;
