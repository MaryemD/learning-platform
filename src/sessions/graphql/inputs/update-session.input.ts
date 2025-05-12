import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateSessionInput } from './create-session.input';

@InputType()
export class UpdateSessionInput extends PartialType(CreateSessionInput) {
    @Field(() => Int)
    id: number;
}