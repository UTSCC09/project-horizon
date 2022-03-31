import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Comment {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @Field()
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  @ManyToOne(() => User, user => user.comments)
  @Field(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => Post, post => post.comments)
  @Field(() => Post, { nullable: true })
  post: Post;
}
