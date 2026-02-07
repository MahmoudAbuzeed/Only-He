import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export type SupportedLanguage = "en" | "ar";

declare global {
  namespace Express {
    interface Request {
      language?: SupportedLanguage;
    }
  }
}

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const xLang = req.headers["x-language"] as string | undefined;
    const acceptLang = req.headers["accept-language"] as string | undefined;

    if (xLang) {
      const normalized = this.normalize(xLang);
      req.language = normalized;
      return next();
    }

    if (acceptLang) {
      const first = acceptLang.split(",")[0]?.trim().toLowerCase().split("-")[0];
      req.language = this.normalize(first || "en");
      return next();
    }

    req.language = "en";
    next();
  }

  private normalize(lang: string): SupportedLanguage {
    const l = (lang || "").trim().toLowerCase();
    if (l.startsWith("ar")) return "ar";
    return "en";
  }
}
