import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class AreaSchema {
  @Prop()
  name: string;
}
