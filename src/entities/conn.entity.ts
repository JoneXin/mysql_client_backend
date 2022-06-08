import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'conn_list' })
export default class ConnectionList {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column({ type: 'varchar', unique: true })
  connection_name: string;

  @Column({ type: 'varchar' })
  host: string;

  @Column({ type: 'int' })
  port: string;

  @Column({ type: 'varchar' })
  user: string;

  @Column({ type: 'varchar' })
  password: string;
}
