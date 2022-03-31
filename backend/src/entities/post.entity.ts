import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { File } from './file.entity';
import { Comment } from './comment.entity';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts)
  @Field(() => User)
  user: User;

  @OneToMany(() => File, file => file.post)
  @Field(() => [File])
  files: File[];

  @OneToMany(() => Comment, comment => comment.post)
  @Field(() => [Comment])
  comments: Comment[];
}
