import { MongooseModuleOptions } from '@nestjs/mongoose';
import config from 'config';

const dbConfig: any = config.get('db');

export const mongooseConfig: MongooseModuleOptions = {
  //   type: dbConfig.type,
  uri: `mongodb+srv://nathandriver:nathandriver@cluster0.xpaqi.mongodb.net/map-and-track?retryWrites=true&w=majority`
  // url: `mongodb+srv://${process.env.DB_USER || dbConfig.username}:${process.env.DB_PASSWORD || dbConfig.password || dbConfig.database}@${process.env.DB_CLUSTER_NAME}.xpaqi.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`,
  //   synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  //   useUnifiedTopology: true,
  //   entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
