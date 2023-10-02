import { IsString,IsInt } from 'class-validator'
import {z} from 'zod'

export const CreateCatSchema = z.object({
  name: z.string(),
  age: z.number(),
  breed: z.string()
}).required()

// export type CreateCatDto = Required<z.infer<typeof CreateCatSchema>>

export class CreateCatDto {
  @IsString()
  name: string;
  
  @IsInt()
  age: number;
  
  @IsString()
  breed: string;
}