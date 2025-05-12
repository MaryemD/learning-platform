import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRoleEnum } from '../../../enums/user-role.enum';

@ObjectType()
export class UserModel {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field(() => String)
    role: UserRoleEnum;
}
