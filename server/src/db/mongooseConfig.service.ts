import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
      const uri = 'mongodb://localhost/nest'
      console.log(uri);
    return {
      uri: 'mongodb://localhost/nest',
    };
  }
}