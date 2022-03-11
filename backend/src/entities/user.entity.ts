import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { File } from './file.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ name: 'first_name' })
  @Field()
  firstName: string;

  @Column({ name: 'last_name' })
  @Field()
  lastName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => File, file => file.user)
  files: File[];
}

@ObjectType()
export class UserToken extends User {
  @Field()
  token: string;
}

@InputType()
export class UserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInfo {
  @Field()
  email: string;

  @Field()
  password: string;
}