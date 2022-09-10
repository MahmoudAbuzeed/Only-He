import { SetMetadata } from '@nestjs/common';
import { Occupation } from '../types/guards.enum';

export const OCCUPATIONS_KEY = 'occupations';
export const OccupationsGuard = (...occupations: Occupation[]) =>
  SetMetadata(OCCUPATIONS_KEY, occupations);
