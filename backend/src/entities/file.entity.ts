import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class File {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  filename: string;

  @Column()
  @Field()
  mimetype: string;

  @Column()
  @Field()
  encoding: string;

  @Column()
  @Field()
  size: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.files)
  user: User;

  @ManyToMany(() => Post, post => post.files)
  posts: Post[];
}
