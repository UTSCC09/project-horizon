import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Post } from './post.entity';
import { File } from './file.entity';
import { Comment } from './comment.entity';

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
  @Field(() => [Post], { nullable: true })
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  @Field(() => [File], { nullable: true })
  comments: Comment[];

  @OneToMany(() => File, file => file.user)
  @Field(() => [File], { nullable: true })
  files: File[];

  @ManyToMany(() => User, user => user.following)
  @JoinTable()
  @Field(() => [User], { nullable: true })
  followers: User[];

  @ManyToMany(() => User, user => user.followers)
  @Field(() => [User], { nullable: true })
  following: User[];

  @Field(() => Number, { defaultValue: 0 })
  followersCount: number;

  @Field(() => Number, { defaultValue: 0 })
  followingCount: number;

  @Field(() => Number, { defaultValue: 0 })
  postsCount: number;

  @Field(() => Boolean, { defaultValue: false })
  isFollowing: boolean;

  @ManyToMany(() => Comment, comment => comment.likes)
  likedComments: Comment[];

  @ManyToMany(() => Post, post => post.likes)
  likedPosts: Post[];
}

@ObjectType()
export class UserToken {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
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

  @Field()
  confirmPassword: string;
}

@InputType()
export class LoginInfo {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class Notification {
  @Field()
  sourceId: number;

  @Field()
  type: NotificationType;

  @Field()
  payload: string;

  @Field()
  createdAt: string;
}

export enum NotificationType {
	COMMENT = 'comment',
	LIKE = 'like',
	FOLLOW = 'follow',
  POST_LIKE = 'post_like',
}