import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Package } from 'src/package/entities/package.entity';

export enum OrderItemType {
  PRODUCT = 'product',
  PACKAGE = 'package',
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column({ type: 'enum', enum: OrderItemType })
  item_type: OrderItemType;

  @Column({ nullable: true })
  product_id: number;

  @Column({ nullable: true })
  package_id: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  // Store product/package details at time of order (for historical accuracy)
  @Column({ length: 200 })
  item_name: string;

  @Column({ length: 100, nullable: true })
  item_sku: string;

  @Column({ type: 'json', nullable: true })
  item_details: {
    description?: string;
    image_url?: string;
    attributes?: Record<string, any>;
  };

  @Column({ type: 'json', nullable: true })
  product_options: Record<string, any>; // For product variants

  @Column({ type: 'json', nullable: true })
  applied_discounts: {
    offer_id: number;
    offer_code: string;
    discount_amount: number;
  }[];

  // Relationships
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.order_items, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Package, (pkg) => pkg.order_items, { nullable: true })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
