import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Module({})
export class DatabaseModule {
  static forRoot(uri: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async (logger: Logger) => ({
            uri,
            connectionFactory: (connection) => {
              connection.on('connected', () => {
                logger.log('Connected to MongoDB database', 'Database');
              });
              connection.on('error', (error: any) => {
                logger.error(`MongoDB connection error: ${error}`, 'Database');
              });
              connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
              });
              connection._events.connected();
              return connection;
            },
          }),
          inject: [WINSTON_MODULE_NEST_PROVIDER],
        }),
      ],
    };
  }
}
