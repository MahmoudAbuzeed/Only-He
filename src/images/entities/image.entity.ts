import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ImageType {
  PRODUCT = 'product',
  CATEGORY = 'category',
  PACKAGE = 'package',
  USER_AVATAR = 'user_avatar',
  OFFER = 'offer',
  BANNER = 'banner',
}

@Entity('images')
@Index(['entity_type', 'entity_id'])
@Index(['is_primary', 'entity_type', 'entity_id'])
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  original_name: string;

  @Column({ type: 'varchar', length: 100 })
  file_name: string;

  @Column({ type: 'varchar', length: 1000 })
  s3_url: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  s3_key: string;

  @Column({ type: 'enum', enum: ImageType })
  entity_type: ImageType;

  @Column({ type: 'int' })
  entity_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mime_type: string;

  @Column({ type: 'int', nullable: true })
  file_size: number;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt_text: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  caption: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
