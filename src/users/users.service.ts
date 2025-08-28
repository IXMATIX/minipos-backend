import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    this.logger.debug(`findById called — id=${id}`);
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.debug(`User found — userId=${user.id}, email=${user.email}`);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    this.logger.debug(`findByEmail called — email=${email}`);
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    this.logger.debug(
      user
        ? `user found — userId=${user.id}, email=${user.email}`
        : `user not found — email=${email}`,
    );
    return user ?? undefined;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.debug(`create user called — email=${createUserDto.email}`);

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(user);

      this.logger.log(
        `user created successfully — userId=${savedUser.id}, email=${savedUser.email}`,
      );

      return plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      const error = err as { code?: string; message?: string };

      if (error.code === '23505') {
        this.logger.warn(
          `create user failed — duplicate email=${createUserDto.email}`,
        );
        throw new ConflictException('Email already exists');
      }

      this.logger.error(
        `error creating user — email=${createUserDto.email}`,
        (err as Error).stack,
      );
      throw new ConflictException(`Error creating user: ${error.message}`);
    }
  }
}
