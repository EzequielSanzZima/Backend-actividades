import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import * as fs from 'fs';

interface User {
  id: number;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  private readonly users: User[];

  constructor() {
    const usersJson = fs.readFileSync('users.json', 'utf8');
    this.users = JSON.parse(usersJson).users;
  }

  @Get()
  findAll(): User[] {
    return this.users;
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.users.find(user => user.id === +id);
  }

  @Post()
  create(@Body() user: User): User {
    user.id = this.users.length + 1;
    this.users.push(user);
    this.saveUsers();
    return user;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User): User {
    const index = this.users.findIndex(u => u.id === +id);
    this.users[index] = { id: +id, ...user };
    this.saveUsers();
    return this.users[index];
  }

  @Delete(':id')
  delete(@Param('id') id: string): User {
    const index = this.users.findIndex(user => user.id === +id);
    const user = this.users[index];
    this.users.splice(index, 1);
    this.saveUsers();
    return user;
  }

  private saveUsers() {
    fs.writeFileSync('users.json', JSON.stringify({ users: this.users }));
  }
}
