import { Controller, Get, Param, Post, ParseIntPipe, Request } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { toLocalizedEntity } from "../common/utils/i18n.util";

@Controller("banner")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get("active")
  async getActiveBanners(@Request() req: any) {
    const result = await this.bannerService.getActiveBanners();
    const lang = req.language || "en";
    if (result?.data && Array.isArray(result.data)) {
      (result as any).data = result.data.map((b: any) =>
        toLocalizedEntity(b, lang as "en" | "ar", "banner")
      );
    }
    return result;
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
