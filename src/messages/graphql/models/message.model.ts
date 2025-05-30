import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SessionModel } from '../../../sessions/graphql/models/session.model';
import { UserModel } from '../../../courses/graphql/models/user.model';


@ObjectType('MessageModel')
export class MessageModel {
    @Field(() => Int)
    id: number;

    @Field()
    content: string;

    @Field()
    timestamp: Date;

    @Field(() => Boolean)
    isRead: boolean;

    @Field(() => UserModel)
    sender: UserModel;

    @Field(() => SessionModel)
    session: SessionModel;
}
