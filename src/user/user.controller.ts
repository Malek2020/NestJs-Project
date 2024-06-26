import { BadRequestException, Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!createUserDto.email || !emailRegex.test(createUserDto.email)) {
            throw new BadRequestException('A valid email is required');
        }

        const isUserAlreadyExists: User | boolean =
            await this.userService.getUser(createUserDto.email);

        if (isUserAlreadyExists) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        return this.userService.addUser(createUserDto.email);
    }
}
