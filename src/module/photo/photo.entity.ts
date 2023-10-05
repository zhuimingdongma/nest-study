import { UUIDVersion } from 'class-validator';
import {Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: UUIDVersion;
  
  @Column({length: 500})
  name: string;
  
  @Column('text')
  description: string;
  
  @Column()
  filename: string
  
  @Column('int')
  views: number;
  
  @Column()
  isPublished: boolean
}