import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class IpRequestCount extends Document {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  timestamp: Date;
}

export const IpRequestCountSchema = SchemaFactory.createForClass(IpRequestCount);
