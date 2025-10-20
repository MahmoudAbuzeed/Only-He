import { Injectable, NotFoundException } from "@nestjs/common";
import { BannerRepository } from "./repositories/banner.repository";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { ResponseUtil } from "../common/utils/response.util";

@Injectable()
export class BannerService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  // Mobile: Get active banners
  async getActiveBanners() {
    const banners = await this.bannerRepository.findActiveBanners();
    return ResponseUtil.success(
      "Active banners retrieved successfully",
      banners
    );
  }

  // Mobile: Track banner view
  async trackView(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }

    await this.bannerRepository.incrementViewCount(id);
    return ResponseUtil.successNoData("View tracked successfully");
  }

  // Mobile: Track banner click
  async trackClick(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }

    await this.bannerRepository.incrementClickCount(id);
    return ResponseUtil.successNoData("Click tracked successfully");
  }

  // Admin: Get all banners with pagination
  async getAllBanners(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean
  ) {
    const result = await this.bannerRepository.findAllWithPagination(
      page,
      limit,
      isActive
    );

    return ResponseUtil.paginated(
      "Banners retrieved successfully",
      result.banners,
      result.total,
      result.page,
      result.limit
    );
  }

  // Admin: Get banner by ID
  async getBannerById(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }
    return ResponseUtil.success("Banner retrieved successfully", banner);
  }

  // Admin: Create banner
  async createBanner(createBannerDto: CreateBannerDto) {
    const banner = this.bannerRepository.create(createBannerDto);
    const savedBanner = await this.bannerRepository.save(banner);
    return ResponseUtil.success("Banner created successfully", savedBanner);
  }

  // Admin: Update banner
  async updateBanner(id: number, updateBannerDto: UpdateBannerDto) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }

    Object.assign(banner, updateBannerDto);
    const updatedBanner = await this.bannerRepository.save(banner);
    return ResponseUtil.success("Banner updated successfully", updatedBanner);
  }

  // Admin: Delete banner
  async deleteBanner(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }

    await this.bannerRepository.remove(banner);
    return ResponseUtil.successNoData("Banner deleted successfully");
  }

  // Admin: Toggle banner status
  async toggleStatus(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }

    banner.isActive = !banner.isActive;
    await this.bannerRepository.save(banner);

    return ResponseUtil.success("Banner status updated successfully", {
      id: banner.id,
      isActive: banner.isActive,
    });
  }

  // Admin: Reorder banners
  async reorderBanners(bannerOrders: { id: number; displayOrder: number }[]) {
    for (const { id, displayOrder } of bannerOrders) {
      await this.bannerRepository.updateDisplayOrder(id, displayOrder);
    }
    return ResponseUtil.successNoData("Banners reordered successfully");
  }

  // Admin: Get banner analytics
  async getBannerAnalytics(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }

    const ctr =
      banner.viewCount > 0
        ? ((banner.clickCount / banner.viewCount) * 100).toFixed(2)
        : 0;

    return ResponseUtil.success("Banner analytics retrieved successfully", {
      id: banner.id,
      title: banner.title,
      viewCount: banner.viewCount,
      clickCount: banner.clickCount,
      clickThroughRate: `${ctr}%`,
      isActive: banner.isActive,
      createdAt: banner.createdAt,
    });
  }

  // Admin: Get all banners analytics
  async getAllBannersAnalytics() {
    const banners = await this.bannerRepository.find({
      order: { displayOrder: "ASC" },
    });

    const analytics = banners.map((banner) => {
      const ctr =
        banner.viewCount > 0
          ? ((banner.clickCount / banner.viewCount) * 100).toFixed(2)
          : 0;

      return {
        id: banner.id,
        title: banner.title,
        viewCount: banner.viewCount,
        clickCount: banner.clickCount,
        clickThroughRate: `${ctr}%`,
        isActive: banner.isActive,
        displayOrder: banner.displayOrder,
      };
    });

    const totalViews = banners.reduce((sum, b) => sum + b.viewCount, 0);
    const totalClicks = banners.reduce((sum, b) => sum + b.clickCount, 0);
    const averageCtr =
      totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

    return ResponseUtil.success("Analytics retrieved successfully", {
      banners: analytics,
      summary: {
        totalBanners: banners.length,
        activeBanners: banners.filter((b) => b.isActive).length,
        totalViews,
        totalClicks,
        averageClickThroughRate: `${averageCtr}%`,
      },
    });
  }
}
