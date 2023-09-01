import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { Order } from "src/order/entities/order.entity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;
}
