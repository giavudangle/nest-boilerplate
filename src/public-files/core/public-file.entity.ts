import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('public-files')
export class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
  })
  public url: string;

  @Column({
    nullable:true
  })
  public key: string;
}