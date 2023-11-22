import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
