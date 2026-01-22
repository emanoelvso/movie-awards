import { Module } from '@nestjs/common';
import { ProducerModule } from '@producerModule/producer.module';

@Module({
  imports: [ProducerModule.forRoot()],
})
export class AppModule {}
