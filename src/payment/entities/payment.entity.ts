import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  WALLET = 'wallet',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  transaction_id: string;

  @Column()
  order_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  gateway_transaction_id: string; // ID from payment gateway (Stripe, PayPal, etc.)

  @Column({ nullable: true })
  gateway_response: string; // Response from payment gateway

  @Column({ type: 'json', nullable: true })
  gateway_data: Record<string, any>; // Additional data from gateway

  @Column({ type: 'json', nullable: true })
  payment_details: {
    card_last_four?: string;
    card_brand?: string;
    bank_name?: string;
    account_number?: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refunded_amount: number;

  @Column({ type: 'timestamp', nullable: true })
  processed_at: Date;

  @Column({ type: 'text', nullable: true })
  failure_reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relationships
  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
