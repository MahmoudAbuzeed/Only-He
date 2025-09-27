import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { PackageProduct } from 'src/package/entities/package-product.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  short_description: string;

  @Column({ unique: true, length: 100 })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  compare_price: number; // Original price for discount display

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_price: number; // Cost for profit calculation

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ default: 0 })
  min_stock_level: number; // For low stock alerts

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number;

  @Column({ length: 50, nullable: true })
  dimensions: string; // e.g., "10x20x30 cm"

  @Column('simple-array', { nullable: true })
  images: string[]; // Array of image URLs

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ default: false })
  is_digital: boolean; // For digital products (no shipping)

  @Column({ default: true })
  manage_stock: boolean;

  @Column({ default: false })
  allow_backorder: boolean;

  @Column({ type: 'json', nullable: true })
  attributes: Record<string, any>; // Flexible attributes (color, size, etc.)

  @Column({ type: 'json', nullable: true })
  seo_data: {
    meta_title?: string;
    meta_description?: string;
    slug?: string;
  };

  // Relationships
  @Column()
  category_id: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  order_items: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cart_items: CartItem[];

  @OneToMany(() => PackageProduct, (packageProduct) => packageProduct.product)
  package_products: PackageProduct[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
