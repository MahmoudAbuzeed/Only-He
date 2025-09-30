import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image, ImageType } from './entities/image.entity';

@Injectable()
export class ImagesRepository {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(imageData: Partial<Image>): Promise<Image> {
    const image = this.imageRepository.create(imageData);
    return await this.imageRepository.save(image);
  }

  async findById(id: number): Promise<Image | null> {
    return await this.imageRepository.findOne({
      where: { id, is_active: true },
    });
  }

  async findByEntity(entityType: ImageType, entityId: number): Promise<Image[]> {
    return await this.imageRepository.find({
      where: {
        entity_type: entityType,
        entity_id: entityId,
        is_active: true,
      },
      order: {
        is_primary: 'DESC',
        sort_order: 'ASC',
        created_at: 'ASC',
      },
    });
  }

  async findPrimaryImage(entityType: ImageType, entityId: number): Promise<Image | null> {
    return await this.imageRepository.findOne({
      where: {
        entity_type: entityType,
        entity_id: entityId,
        is_primary: true,
        is_active: true,
      },
    });
  }

  async findByEntityIds(entityType: ImageType, entityIds: number[]): Promise<Image[]> {
    if (entityIds.length === 0) return [];

    return await this.imageRepository.find({
      where: {
        entity_type: entityType,
        entity_id: entityIds.length === 1 ? entityIds[0] : undefined,
        is_active: true,
      },
      order: {
        is_primary: 'DESC',
        sort_order: 'ASC',
        created_at: 'ASC',
      },
    });
  }

  async update(id: number, updateData: Partial<Image>): Promise<Image | null> {
    await this.imageRepository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.imageRepository.update(id, { is_active: false });
  }

  async hardDelete(id: number): Promise<void> {
    await this.imageRepository.delete(id);
  }

  async setPrimaryImage(entityType: ImageType, entityId: number, imageId: number): Promise<void> {
    // First, remove primary flag from all images of this entity
    await this.imageRepository.update(
      {
        entity_type: entityType,
        entity_id: entityId,
      },
      { is_primary: false }
    );

    // Then set the specified image as primary
    await this.imageRepository.update(imageId, { is_primary: true });
  }

  async getImagesByEntities(
    entityType: ImageType,
    entityIds: number[]
  ): Promise<{ [entityId: number]: Image[] }> {
    if (entityIds.length === 0) return {};

    const images = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.entity_type = :entityType', { entityType })
      .andWhere('image.entity_id IN (:...entityIds)', { entityIds })
      .andWhere('image.is_active = :isActive', { isActive: true })
      .orderBy('image.is_primary', 'DESC')
      .addOrderBy('image.sort_order', 'ASC')
      .addOrderBy('image.created_at', 'ASC')
      .getMany();

    // Group images by entity_id
    const groupedImages: { [entityId: number]: Image[] } = {};
    
    entityIds.forEach(id => {
      groupedImages[id] = [];
    });

    images.forEach(image => {
      if (groupedImages[image.entity_id]) {
        groupedImages[image.entity_id].push(image);
      }
    });

    return groupedImages;
  }

  async getPrimaryImagesByEntities(
    entityType: ImageType,
    entityIds: number[]
  ): Promise<{ [entityId: number]: Image | null }> {
    if (entityIds.length === 0) return {};

    const images = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.entity_type = :entityType', { entityType })
      .andWhere('image.entity_id IN (:...entityIds)', { entityIds })
      .andWhere('image.is_primary = :isPrimary', { isPrimary: true })
      .andWhere('image.is_active = :isActive', { isActive: true })
      .getMany();

    const primaryImages: { [entityId: number]: Image | null } = {};
    
    entityIds.forEach(id => {
      primaryImages[id] = null;
    });

    images.forEach(image => {
      primaryImages[image.entity_id] = image;
    });

    return primaryImages;
  }
}
