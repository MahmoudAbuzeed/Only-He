import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "src/product/entities/product.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  name_en: string;

  @Column({ length: 100, nullable: true })
  name_ar: string;

  @Column({ type: "text", nullable: true })
  description_en: string;

  @Column({ type: "text", nullable: true })
  description_ar: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  meta_title_en: string;

  @Column({ nullable: true })
  meta_title_ar: string;

  @Column({ type: "text", nullable: true })
  meta_description_en: string;

  @Column({ type: "text", nullable: true })
  meta_description_ar: string;

  // Self-referencing for parent-child categories
  @Column({ nullable: true })
  parent_id: number;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: "parent_id" })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
