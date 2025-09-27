import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PackageProduct } from './package-product.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';

export enum PackageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ unique: true, length: 100 })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  original_price: number; // Sum of individual product prices

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount_percentage: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'enum', enum: PackageStatus, default: PackageStatus.ACTIVE })
  status: PackageStatus;

  @Column({ type: 'timestamp', nullable: true })
  valid_from: Date;

  @Column({ type: 'timestamp', nullable: true })
  valid_until: Date;

  @Column({ default: 0 })
  max_quantity_per_order: number; // 0 means unlimited

  @Column({ default: false })
  is_featured: boolean;

  @Column({ type: 'json', nullable: true })
  terms_and_conditions: string[];

  // Relationships
  @OneToMany(() => PackageProduct, (packageProduct) => packageProduct.package, {
    cascade: true,
  })
  package_products: PackageProduct[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.package)
  order_items: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.package)
  cart_items: CartItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
