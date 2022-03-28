import { Controller, Get, Param, Response, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileService } from "./file.service";

@Controller()
// @UseGuards(AuthGuard)
export class FileController {
  constructor(private fileService: FileService) {}

  @Get("uploads/:file")
  async serveFile(
    @Param("file") file: string,
    @Response() res: any,
  ) {
    if (process.env.NODE_ENV === "production" || process.env.GAE_ENV === "production") {
      res.sendFile(file, { root: "/tmp/uploads" });
    } else {
      res.sendFile(file, { root: "uploads" });
    }
  }

}