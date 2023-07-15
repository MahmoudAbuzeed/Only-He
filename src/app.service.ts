import { Injectable } from "@nestjs/common";
import { join } from "path";

@Injectable()
export class AppService {
  getHello(): string {
    return join(__dirname, "..", "uploadedFiles");
  }
}
