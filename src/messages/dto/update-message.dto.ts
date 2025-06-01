import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateMessageDto {
    @IsString()
    @IsOptional()
    content?: string;

    @IsBoolean()
    @IsOptional()
    isRead?: boolean;

    @IsInt()
    @IsOptional()
    sessionId?: number;

    @IsInt()
    @IsOptional()
    senderId?: number;
}
