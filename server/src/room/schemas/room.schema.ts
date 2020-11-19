import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';
import { User } from 'src/account/schemas/user.schema';
import { MapSpot, MapSpotSchema } from './mapSpot.schema';
import { MapTrace, MapTraceSchema } from './mapTrace.schema';
import mongoose from 'mongoose'

export interface MapTraces {
    [userId: string]: MapTrace[];
}

export interface MapSpots {
    [userId: string]: MapSpot[];
}

export type RoomDocument = Room & Document;

@Schema({ versionKey: false, minimize: false })
export class Room {
    @Prop({ type: String, required: true, select: false })
    _id: mSchema.Types.ObjectId;

    @Prop({ type: String, required: true })
    roomId: string;

    @Prop({ type: String, required: true })
    roomName: string;

    @Prop([{ type: mSchema.Types.ObjectId, required: true, ref: 'User' }])
    users: string[];

    @Prop([{ type: MapTraceSchema, required: true }])
    mapTraces: MapTrace[];

    @Prop([{ type: MapSpotSchema, required: true }])
    mapSpots: MapSpot[];

    @Prop({ type: Date })
    createdAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

// export const RoomSchema = new mSchema({
//     _id: { type: mSchema.Types.ObjectId, required: true },

//     roomId: { type: String, required: true },

//     roomName: { type: String, required: true },

//     users: [{ type: mSchema.Types.ObjectId, required: true, ref: 'User' }],

//     mapTraces: { type: [MapTraceSchema], required: true },

//     mapSpots: { type: [MapSpotSchema], required: true },

//     createdAt: { type: Date }
// }, {
//      versionKey: false, minimize: false 
// })