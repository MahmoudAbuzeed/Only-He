import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../order/entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    description: 'New order status',
    enum: OrderStatus,
    example: OrderStatus.SHIPPED
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({ 
    description: 'Tracking number for shipped orders',
    example: 'TRK123456789'
  })
  @IsString()
  @IsOptional()
  tracking_number?: string;

  @ApiPropertyOptional({ 
    description: 'Admin notes for status change',
    example: 'Order shipped via FedEx'
  })
  @IsString()
  @IsOptional()
  admin_notes?: string;

  @ApiPropertyOptional({ 
    description: 'Notify customer via email',
    example: true,
    default: true
  })
  @IsOptional()
  notify_customer?: boolean = true;
}
