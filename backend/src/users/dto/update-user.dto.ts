// src/users/dto/update-user.dto.ts
import { IsString, IsOptional, IsPhoneNumber, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'Name cannot be longer than 100 characters' })
    name?: string;

    @IsString()
    @IsOptional()
    // @IsPhoneNumber('PE', { message: 'Please provide a valid Peruvian phone number' }) 
    phone?: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, { message: 'Address cannot be longer than 250 characters' })
    address?: string;
}
