import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { BannerService } from "../../banner/banner.service";
import { CreateBannerDto } from "../../banner/dto/create-banner.dto";
import { UpdateBannerDto } from "../../banner/dto/update-banner.dto";
import { BannerQueryDto } from "../../banner/dto/banner-query.dto";
import { AdminGuard } from "../guards/admin.guard";

@Controller("admin/banners")
@UseGuards(AdminGuard)
export class AdminBannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  getAllBanners(@Query() query: BannerQueryDto) {
    return this.bannerService.getAllBanners(
      query.page,
      query.limit,
      query.isActive
    );
  }

  @Get("analytics")
  getAllBannersAnalytics() {
    return this.bannerService.getAllBannersAnalytics();
  }

  @Get(":id")
  getBannerById(@Param("id", ParseIntPipe) id: number) {
    return this.bannerService.getBannerById(id);
  }

  @Get(":id/analytics")
  getBannerAnalytics(@Param("id", ParseIntPipe) id: number) {
    return this.bannerService.getBannerAnalytics(id);
  }

  @Post()
  createBanner(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.createBanner(createBannerDto);
  }

  @Patch(":id")
  updateBanner(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBannerDto: UpdateBannerDto
  ) {
    return this.bannerService.updateBanner(id, updateBannerDto);
  }

  @Delete(":id")
  deleteBanner(@Param("id", ParseIntPipe) id: number) {
    return this.bannerService.deleteBanner(id);
  }

  @Patch(":id/toggle-status")
  toggleStatus(@Param("id", ParseIntPipe) id: number) {
    return this.bannerService.toggleStatus(id);
  }

  @Post("reorder")
  reorderBanners(
    @Body() body: { banners: { id: number; displayOrder: number }[] }
  ) {
    return this.bannerService.reorderBanners(body.banners);
  }
}
