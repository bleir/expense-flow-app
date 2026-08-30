import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Color } from './color.enum';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Color })
  color: Color;
}
