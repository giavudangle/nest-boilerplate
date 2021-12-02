import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('seedings')
export class Seeding {
  @PrimaryColumn()
  public id: string;

  @CreateDateColumn()
  creationDate: Date;

  constructor(id?: string) {
    this.id = id;
  }
}
