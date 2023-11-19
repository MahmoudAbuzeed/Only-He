import { Order } from "src/order/entities/order.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  first_name: string;

  @Column({ length: 40 })
  last_name: string;

  @Column({ length: 40 })
  user_name: string;

  @Column({ nullable: true })
  token: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
