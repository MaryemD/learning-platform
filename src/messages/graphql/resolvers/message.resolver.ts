import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { MessagesService } from '../../messages.service';
import { Message } from '../../entities/message.entity';
import { CreateMessageInput } from '../inputs/create-message.input';
import { UpdateMessageInput } from '../inputs/update-message.input';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../../../courses/graphql/models/user.model';
import { SessionModel } from '../../../sessions/graphql/models/session.model';
import { SessionsService } from '../../../sessions/sessions.service';

@Resolver(() => MessageModel)
export class MessageResolver {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly sessionsService: SessionsService,
    ) {}

    @Query(() => [MessageModel])
    async messages(): Promise<Message[]> {
        return this.messagesService.findAll();
    }

    @Query(() => MessageModel)
    async message(@Args('id', { type: () => Int }) id: number): Promise<Message> {
        return this.messagesService.findOne(id);
    }

    @Query(() => [MessageModel])
    async messagesBySession(@Args('sessionId', { type: () => Int }) sessionId: number): Promise<Message[]> {
        return this.messagesService.getMessagesBySession(sessionId);
    }

    @Query(() => [MessageModel])
    async messagesByUser(@Args('userId', { type: () => Int }) userId: number): Promise<Message[]> {
        return this.messagesService.getMessagesByUser(userId);
    }

    @Mutation(() => MessageModel)
    async createMessage(
        @Args('createMessageInput') createMessageInput: CreateMessageInput
    ): Promise<Message> {
        const createData = {
            content: createMessageInput.content,
            sessionId: createMessageInput.sessionId,
            senderId: createMessageInput.senderId,
        };

        return this.messagesService.create(createData);
    }

    @Mutation(() => MessageModel)
    async updateMessage(
        @Args('updateMessageInput') updateMessageInput: UpdateMessageInput
    ): Promise<Message> {
        const { id, ...updateData } = updateMessageInput;
        return this.messagesService.update(id, updateData);
    }

    @Mutation(() => Boolean)
    async removeMessage(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        await this.messagesService.remove(id);
        return true;
    }

    @Mutation(() => MessageModel)
    async markMessageAsRead(@Args('id', { type: () => Int }) id: number): Promise<Message> {
        return this.messagesService.markAsRead(id);
    }

    @ResolveField(() => UserModel)
    async sender(@Parent() message: Message): Promise<any> {
        return this.messagesService.getSender(message.id);
    }

    @ResolveField(() => SessionModel)
    async session(@Parent() message: Message): Promise<any> {
        return this.messagesService.getSession(message.id);
    }

    @Query(() => [MessageModel])
    async recentMessages(
        @Args('sessionId', { type: () => Int }) sessionId: number,
        @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number
    ): Promise<Message[]> {
        return this.messagesService.getRecentMessages(sessionId, limit);
    }

    @Query(() => Int)
    async unreadMessagesCount(
        @Args('sessionId', { type: () => Int }) sessionId: number,
        @Args('userId', { type: () => Int }) userId: number
    ): Promise<number> {
        return this.messagesService.getUnreadMessagesCount(sessionId, userId);
    }

    @Mutation(() => Boolean)
    async markAllMessagesAsRead(
        @Args('sessionId', { type: () => Int }) sessionId: number,
        @Args('userId', { type: () => Int }) userId: number
    ): Promise<boolean> {
        await this.messagesService.markAllMessagesAsReadForUser(sessionId, userId);
        return true;
    }
}
