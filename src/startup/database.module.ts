import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (logger: Logger) => {
        return {
          uri: 'mongodb://localhost/nest',
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.log('Connected to MongoDB database', 'Database');
            });
            connection.on('error', (error) => {
              logger.error(`MongoDB connection error: ${error}`, 'Database');
            });
            connection.on('disconnected', () => {
              logger.warn('MongoDB disconnected');
            });
            connection._events.connected();
            return connection;
          },
        };
      },
      inject: [WINSTON_MODULE_NEST_PROVIDER],
    }),
  ],
})
export class DatabaseModule {}
