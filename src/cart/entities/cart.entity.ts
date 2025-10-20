import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ValueTransformer,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { CartItem } from "./cart-item.entity";

// Transformer to convert decimal strings to numbers
const decimalTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

export enum CartStatus {
  ACTIVE = "active",
  ABANDONED = "abandoned",
  CONVERTED = "converted", // Converted to order
}

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: "enum", enum: CartStatus, default: CartStatus.ACTIVE })
  status: CartStatus;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  subtotal: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  tax_amount: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  shipping_amount: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  discount_amount: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  total: number;

  @Column({ nullable: true })
  coupon_code: string;

  @Column({ type: "json", nullable: true })
  applied_offers: {
    offer_id: number;
    offer_code: string;
    discount_amount: number;
  }[];

  @Column({ type: "timestamp", nullable: true })
  last_activity: Date;

  // Relationships
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
