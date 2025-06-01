import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

@InputType()
export class CreateMessageInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;

    @Field(() => Int)
    @IsInt()
    sessionId: number;

    @Field(() => Int)
    @IsInt()
    senderId: number;

    @Field()
    @IsString()
    senderEmail: string;
}
