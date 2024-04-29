import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BannedIp extends Document {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  expirationTime: Date;
}
export const BannedIpSchema = SchemaFactory.createForClass(BannedIp);
