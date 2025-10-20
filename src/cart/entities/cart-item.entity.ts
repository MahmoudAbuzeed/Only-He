import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ValueTransformer,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "src/product/entities/product.entity";
import { Package } from "src/package/entities/package.entity";

// Transformer to convert decimal strings to numbers
const decimalTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

export enum CartItemType {
  PRODUCT = "product",
  PACKAGE = "package",
}

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cart_id: number;

  @Column({ type: "enum", enum: CartItemType })
  item_type: CartItemType;

  @Column({ nullable: true })
  product_id: number;

  @Column({ nullable: true })
  package_id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  unit_price: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  total_price: number;

  @Column({ type: "json", nullable: true })
  product_options: Record<string, any>; // For product variants (size, color, etc.)

  @Column({ type: "json", nullable: true })
  applied_discounts: {
    offer_id: number;
    discount_amount: number;
  }[];

  // Relationships
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cart_items, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Package, (pkg) => pkg.cart_items, { nullable: true })
  @JoinColumn({ name: "package_id" })
  package: Package;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
