import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../../courses/graphql/models/user.model';
import { CourseModel } from '../../../courses/graphql/models/course.model';
import { MessageModel } from '../../../messages/graphql/models/message.model';
import { QuizModel } from '../../../quizzes/graphql/models/quiz.model';

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

    @Field(() => CourseModel)
    course: CourseModel;

    @Field(() => [MessageModel], { nullable: 'itemsAndList' })
    messages: MessageModel[];

    @Field(() => [QuizModel], { nullable: 'itemsAndList' })
    quizzes: QuizModel[];
}