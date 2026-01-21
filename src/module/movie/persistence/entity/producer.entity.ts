import { Column, Entity, ManyToMany } from 'typeorm';
import { DefaultEntity } from '../../infra/module/typeorm/entity/default.entity';
import { Movie } from './movie.entity';

@Entity('Producer')
export class Producer extends DefaultEntity<Producer> {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;
  @ManyToMany(() => Movie, (movie) => movie.producers)
  movies: Movie[];
}
