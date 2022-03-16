import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserInput } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Post } from 'src/entities/post.entity';

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

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async update(id: string, user: UserInput): Promise<User> {
    const userToUpdate = await this.usersRepository.findOne(id);
    userToUpdate.firstName = user.firstName;
    userToUpdate.lastName = user.lastName;
    userToUpdate.email = user.email;

    return this.usersRepository.save(userToUpdate);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  // async getAllPosts(id: number): Promise<Post[]> {
  //   const user = await this.usersRepository.findOne(id);
  //   console.log({user})
  //   return user.posts;
  // }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}