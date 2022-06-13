import { TableModule } from './modules/table/table.moudel';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnModule } from './modules/connection/conn.moudel';
import { DbModule } from './modules/database/db.moudel';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: '101.43.105.27',
        port: 3306,
        username: 'root',
        password: 'Leaper@123',
        database: 'mysql_client',
        timezone: '+08:00',
        logging: false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    ConnModule,
    DbModule,
    TableModule,
  ],
})
export class AppModule {}
