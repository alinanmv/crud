import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 50 })
  username: string;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @Column({ type: "int", default: 0 })
  quantity: number;

  @Column({ type: "double precision", default: 0 })
  price: number;

  @Column({ type: "varchar", nullable: true })
  image: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
