import { Controller, Get, Param, Response, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/guards/gql-auth.guard";
import { FileService } from "./file.service";

@Controller()
// @UseGuards(GqlAuthGuard)
export class FileController {
  constructor(private fileService: FileService) {}

  @Get("uploads/:file")
  async serveFile(
    @Param("file") file: string,
    @Response() res: any,
  ) {
    res.sendFile(file, { root: "uploads" });
  }

}