import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';
import { GeoLoc } from '../model/geoLoc.model';

export type MapSpotDocument = MapSpot & Document;

@Schema()
export class MapSpot {
    @Prop({ type: String, required: true, select: false })
    _id: mSchema.Types.ObjectId;

    @Prop({ type: String })
    mapSpotId: string;

    @Prop({ type: mSchema.Types.ObjectId, ref: 'User' })
    user: string;

    @Prop({ type: Object })
    geoLoc: GeoLoc;

    @Prop({ type: Date })
    createdAt: Date;
}

export const MapSpotSchema = SchemaFactory.createForClass(MapSpot)

// MapSpotSchema1.virtual(
//     'user', {
//     ref: 'User',
//     localField: 'userId',
//     foreignField: 'userId',
// }
// );

// export const MapSpotSchema = MapSpotSchema