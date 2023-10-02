import { Body, Controller, Get, Post } from "@nestjs/common";
import { PhotoService } from "./photo.service";
import { CreatePhotoDto } from "./photo.dto";

@Controller('/photo')
export class PhotoController {
  constructor(private photoService: PhotoService) {}
  @Get('')
  getAll() {
    console.log('mode', process.env.NODE_ENV)
    return this.photoService.getAll()
  }
  
  @Post('/update')
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photoService.update(createPhotoDto)
  }
  
}