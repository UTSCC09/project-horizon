import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserInput } from 'src/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

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
    const other = await this.usersRepository.findOne(userId, { relations: ['following'] });
    if (user.following) {
      user.following.push(other);
    } else {
      user.following = [other];
    }

    this.usersRepository.save(user);
    return other;
  }

  async unfollowUser(user: User, userId: number): Promise<User> {
    const other = await this.usersRepository.findOne(userId, { relations: ['following'] });
    user.following = user.following?.filter(u => u.id !== other.id) || [];
    this.usersRepository.save(user);
    return other;
  }

}