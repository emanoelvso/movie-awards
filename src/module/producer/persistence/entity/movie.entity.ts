import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { DefaultEntity } from '../../infra/module/typeorm/entity/default.entity';
import { Producer } from './producer.entity';

@Entity('Movie')
export class Movie extends DefaultEntity<Movie> {
  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'simple-array', nullable: false })
  studios: string[];

  @ManyToMany(() => Producer, (producer) => producer.movies, { cascade: true })
  @JoinTable()
  producers: Producer[];

  @Column({ type: 'boolean', nullable: true })
  winner?: boolean | null;
}
