import { Injectable } from '@nestjs/common';
import { CatsType } from './cats.interface';

@Injectable()
export class CatsService {
  readonly cats: CatsType[] = []
  getCats(id: number): number {
    return id
  }
  create(cat: CatsType) {
    this.cats.push(cat)
  }
  getAll() {
    return this.cats
  }
}
