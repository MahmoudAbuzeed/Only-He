import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Package } from './package.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class PackageProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  package_id: number;

  @Column()
  product_id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price: number; // Price of this product in the package (can be different from regular price)

  @Column({ default: 0 })
  sort_order: number;

  // Relationships
  @ManyToOne(() => Package, (pkg) => pkg.package_products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @ManyToOne(() => Product, (product) => product.package_products)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
