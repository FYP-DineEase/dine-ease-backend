// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@mujtaba-web/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Playlist, PlaylistSchema } from './schemas/playlist.schema';

@Module({
  imports: [
    JwtAuthModule,
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
