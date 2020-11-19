import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectID } from 'mongodb';
import { Document, Schema as mSchema } from 'mongoose';
import { MapSpot, MapSpotSchema } from './mapSpot.schema';

export type MapTraceDocument = MapTrace & Document;

@Schema()
export class MapTrace {
    @Prop({ type: String, required: true, select: false })
    _id: mSchema.Types.ObjectId;

    @Prop({ type: String, required: true })
    mapTraceId: string;

    @Prop({ type: mSchema.Types.ObjectId, ref: 'User' })
    user: string;

    @Prop({ type: Boolean, required: true })
    isActive: boolean;
    
    @Prop([{ type: MapSpotSchema, required: true }])
    userTraces: MapSpot[];

    @Prop({ type: Date})
    createdAt: Date;
}

export const MapTraceSchema = SchemaFactory.createForClass(MapTrace)