// import { registerAs } from '@nestjs/config';

// export default registerAs('app', () => ({
export default () => ({
    port: process.env.PORT || 3080,
    db: {
      type: 'mongodb',
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      clusterName: process.env.DB_CLUSTER_NAME,
    },
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    typeOrmSync: process.env.TYPEORM_SYNC
  });