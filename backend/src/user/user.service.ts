import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType, User, UserInput } from 'src/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  private publisher;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {
    this.publisher = this.redisService.publisher;
  }

  async create(data: UserInput): Promise<User> {
    const user = new User();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.password = await bcrypt.hash(data.password, 12);

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number, options?: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(id, options);
  }

  async update(id: number, user: UserInput): Promise<User> {
    const userToUpdate = await this.usersRepository.findOne(id);
    userToUpdate.firstName = user.firstName;
    userToUpdate.lastName = user.lastName;
    userToUpdate.email = user.email;

    return this.usersRepository.save(userToUpdate);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async followUser(user: User, userId: number): Promise<User> {
    const other = await this.usersRepository.findOne(userId);
    if (user.following) {
      user.following.push(other);
    } else {
      user.following = [other];
    }

    this.publishFollow(user, userId);
    this.usersRepository.save(user);
    return other;
  }

  async unfollowUser(user: User, userId: number): Promise<User> {
    const other = await this.usersRepository.findOne(userId);
    user.following = user.following?.filter(u => u.id !== other.id) || [];
    this.usersRepository.save(user);
    return other;
  }

  async publishFollow(source: User, follow_id: number) {
    this.publisher.publish(`notifications:${follow_id}`,
      JSON.stringify({
        type: NotificationType.FOLLOW,
        sourceId: source.id,
        payload: JSON.stringify({
          user: {
            firstName: source.firstName,
            lastName: source.lastName,
            email: source.email,
            id: source.id,
          },
        }),
        createdAt: new Date().toISOString()
      })
    )
  }
}