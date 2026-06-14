import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude, Expose } from "class-transformer";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  avatar!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Expose({ name: "avatar_url" })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    return `${process.env.APP_API_URL}/files/${this.avatar}`;
  }
}
