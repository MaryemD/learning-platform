import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';
import { SessionModel } from 'src/sessions/graphql/models/session.model';

@ObjectType()
export class CourseModel {
    @Field(() => ID)
    id: number;

    @Field()
    title: string;

    @Field()
    description: string;

    @Field(() => UserModel)
    instructor: UserModel;

    @Field(() => [SessionModel], { nullable: 'itemsAndList' })
    sessions: SessionModel[];
}