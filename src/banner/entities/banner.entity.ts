import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum BannerActionType {
  NONE = "none",
  PRODUCT = "product",
  CATEGORY = "category",
  PACKAGE = "package",
  EXTERNAL_URL = "external_url",
  INTERNAL_SCREEN = "internal_screen",
}

@Entity("banners")
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "image_url" })
  imageUrl: string;

  @Column({ name: "mobile_image_url", nullable: true })
  mobileImageUrl: string; // Optional: separate image for mobile

  @Column({ name: "tablet_image_url", nullable: true })
  tabletImageUrl: string; // Optional: separate image for tablet

  @Column({
    type: "enum",
    enum: BannerActionType,
    default: BannerActionType.NONE,
    name: "action_type",
  })
  actionType: BannerActionType;

  @Column({ name: "action_value", nullable: true })
  actionValue: string; // Product ID, Category ID, URL, etc.

  @Column({ name: "display_order", default: 0 })
  displayOrder: number;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "start_date", type: "timestamp", nullable: true })
  startDate: Date;

  @Column({ name: "end_date", type: "timestamp", nullable: true })
  endDate: Date;

  @Column({ name: "view_count", default: 0 })
  viewCount: number;

  @Column({ name: "click_count", default: 0 })
  clickCount: number;

  @Column({ name: "button_text", nullable: true, length: 50 })
  buttonText: string; // Optional: "Shop Now", "Learn More", etc.

  @Column({ name: "text_color", nullable: true, length: 7 })
  textColor: string; // Hex color for overlay text

  @Column({ name: "background_color", nullable: true, length: 7 })
  backgroundColor: string; // Background color if image fails to load

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
