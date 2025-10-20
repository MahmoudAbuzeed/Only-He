import { Controller, Get, Param, Post, ParseIntPipe } from "@nestjs/common";
import { BannerService } from "./banner.service";

@Controller("banner")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get("active")
  getActiveBanners() {
    return this.bannerService.getActiveBanners();
  }

  @Post(":id/view")
  trackView(@Param("id", ParseIntPipe) id: number) {
    return this.bannerService.trackView(id);
  }

  @Post(":id/click")
  trackClick(@Param("id", ParseIntPipe) id: number) {
    return this.bannerService.trackClick(id);
  }
}
