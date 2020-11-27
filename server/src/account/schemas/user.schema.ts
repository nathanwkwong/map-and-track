import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema  } from 'mongoose';

export type UserDocument = User & Document;

@Schema({versionKey: false, minimize: false})
export class User {
    @Prop({ type: mSchema.Types.ObjectId})
    _id: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    username: string;

    @Prop({type: String, required: true, select: false})
    password: string;

    @Prop({type: String, required: true, select: false})
    salt: string;

    @Prop([{type: String}])
    joinedRoomIds: string[];

    @Prop([{type: String}])
    createdRoomIds: string[]

    @Prop({type: String})
    selfMapTraceId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// export const UserSchema = new mSchema( {
//     _id: { type: mSchema.Types.ObjectId },

//     userId: { type: String, required: true },

//     username: { type: String, required: true },

//     password: {type: String, required: true},

//     salt: {type: String, required: true},

//     joinedRoomIds: {type: [String]},

//     createdRoomIds: {type: [String]},

//     selfMapTraceId: {type: Boolean},
// }, {versionKey: false, minimize: false})
