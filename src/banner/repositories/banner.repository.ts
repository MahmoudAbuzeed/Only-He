import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Banner } from "../entities/banner.entity";

@Injectable()
export class BannerRepository extends Repository<Banner> {
  constructor(private dataSource: DataSource) {
    super(Banner, dataSource.createEntityManager());
  }

  async findActiveBanners(): Promise<Banner[]> {
    const now = new Date();

    return this.createQueryBuilder("banner")
      .where("banner.isActive = :isActive", { isActive: true })
      .andWhere("(banner.startDate IS NULL OR banner.startDate <= :now)", {
        now,
      })
      .andWhere("(banner.endDate IS NULL OR banner.endDate >= :now)", { now })
      .orderBy("banner.displayOrder", "ASC")
      .addOrderBy("banner.createdAt", "DESC")
      .getMany();
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean
  ) {
    const query = this.createQueryBuilder("banner");

    if (isActive !== undefined) {
      query.where("banner.isActive = :isActive", { isActive });
    }

    const [banners, total] = await query
      .orderBy("banner.displayOrder", "ASC")
      .addOrderBy("banner.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      banners,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.increment({ id }, "viewCount", 1);
  }

  async incrementClickCount(id: number): Promise<void> {
    await this.increment({ id }, "clickCount", 1);
  }

  async updateDisplayOrder(id: number, newOrder: number): Promise<void> {
    await this.update(id, { displayOrder: newOrder });
  }
}
