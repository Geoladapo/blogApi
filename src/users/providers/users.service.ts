/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/provider/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';

/**
 * class to connect to user's table and perform business logic
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async createUser(createUserDto: CreateUserDTO) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }

  /**
   *  The method to get all the users from the database
   * @param getUsersParamDto
   * @param limit
   * @param page
   * @returns
   */

  findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

    return [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Doe' },
    ];
  }

  /**
   * Fins a single user by the id of the user
   * @param id
   * @returns
   */
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }
}
