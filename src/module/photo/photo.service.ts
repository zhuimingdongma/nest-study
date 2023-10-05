import { Inject, Injectable, Get, Post, Body } from "@nestjs/common";
import { Photo } from "./photo.entity";
import {Repository} from 'typeorm'
import { CreatePhotoDto } from "./photo.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User} from "../user/user.entity";

@Injectable()
export class PhotoService {
  constructor(@InjectRepository(Photo) private repository: Repository<User>) {}
  
  // getUser() {
  //   return this.repository.find()
  // }
  
  getAll() {
    return this.repository.find()
  }
  
  async update(createPhotoDto: CreatePhotoDto) {
    const photo = new Photo();
    for (const key in createPhotoDto) {
      if (Object.prototype.hasOwnProperty.call(createPhotoDto, key)) {
        const element = createPhotoDto[key];
        photo[key] = element
      }
    }
    await this.repository.save(photo).catch(err => {console.log(err)})
  }
}