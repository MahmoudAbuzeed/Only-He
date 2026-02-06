import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  ValueTransformer,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { Payment } from "src/payment/entities/payment.entity";

// Transformer to convert decimal strings to numbers
const decimalTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  order_number: string; // e.g., ORD-2024-001

  @Column({ nullable: true })
  user_id: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  guest_phone: string;

  @Column({ type: "timestamp", nullable: true })
  phone_validated_at: Date;

  @Column({ type: "timestamp", nullable: true })
  confirmed_at: Date;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  payment_status: PaymentStatus;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
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
    transformer: decimalTransformer,
  })
  total_amount: number;

  @Column({ nullable: true })
  coupon_code: string;

  @Column({ type: "json", nullable: true })
  applied_offers: {
    offer_id: number;
    offer_code: string;
    discount_amount: number;
  }[];

  // Shipping Information
  @Column({ type: "json" })
  shipping_address: {
    first_name: string;
    last_name: string;
    company?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };

  @Column({ type: "json", nullable: true })
  billing_address: {
    first_name: string;
    last_name: string;
    company?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };

  @Column({ nullable: true })
  shipping_method: string;

  @Column({ nullable: true })
  tracking_number: string;

  @Column({ type: "timestamp", nullable: true })
  shipped_at: Date;

  @Column({ type: "timestamp", nullable: true })
  delivered_at: Date;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "text", nullable: true })
  admin_notes: string;

  // Relationships
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
