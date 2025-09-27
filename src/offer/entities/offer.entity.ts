import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';

export enum OfferType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_SHIPPING = 'free_shipping',
}

export enum OfferStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled',
}

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ unique: true, length: 50 })
  code: string; // Coupon code

  @Column({ type: 'enum', enum: OfferType })
  type: OfferType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number; // Percentage or fixed amount

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimum_order_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximum_discount_amount: number;

  @Column({ default: 0 })
  usage_limit: number; // 0 means unlimited

  @Column({ default: 0 })
  usage_limit_per_customer: number; // 0 means unlimited

  @Column({ default: 0 })
  used_count: number;

  @Column({ type: 'timestamp' })
  valid_from: Date;

  @Column({ type: 'timestamp' })
  valid_until: Date;

  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.ACTIVE })
  status: OfferStatus;

  @Column({ default: false })
  is_stackable: boolean; // Can be combined with other offers

  @Column({ default: false })
  apply_to_all_products: boolean;

  // For Buy X Get Y offers
  @Column({ nullable: true })
  buy_quantity: number;

  @Column({ nullable: true })
  get_quantity: number;

  @Column({ type: 'json', nullable: true })
  conditions: {
    min_items?: number;
    max_items?: number;
    customer_groups?: string[];
    exclude_sale_items?: boolean;
  };

  // Relationships
  @ManyToMany(() => Product)
  @JoinTable({
    name: 'offer_products',
    joinColumn: { name: 'offer_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'offer_categories',
    joinColumn: { name: 'offer_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
