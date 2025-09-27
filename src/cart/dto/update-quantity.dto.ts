import { IsNumber, IsEnum, Min } from 'class-validator';

export enum QuantityAction {
  INCREASE = 'increase',
  DECREASE = 'decrease',
  SET = 'set',
}

export class UpdateQuantityDto {
  @IsEnum(QuantityAction)
  action: QuantityAction;

  @IsNumber()
  @Min(1)
  quantity?: number; // Required for 'set' action, optional for increase/decrease
}
