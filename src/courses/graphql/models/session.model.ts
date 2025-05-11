import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';

@ObjectType()
export class SessionModel {
    @Field(() => ID)
    id: number;

    @Field()
    title: string;

    @Field()
    startTime: Date;

    @Field()
    isLive: boolean;

    @Field(() => UserModel)
    instructor: UserModel;
}