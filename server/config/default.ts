import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: process.env.PORT || 80,
    db: {
      type: 'mongodb',
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      clusterName: process.env.DB_CLUSTER_NAME,
    },
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    typeOrmSync: process.env.TYPEORM_SYNC
  }));