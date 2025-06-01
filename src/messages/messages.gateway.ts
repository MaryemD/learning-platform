import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';


@WebSocketGateway({
  cors: {
    origin: true, // Allow all origins for development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
  namespace: '/chat',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  

  @WebSocketServer()
  server: Server;

  private logger = new Logger('MessagesGateway');

  constructor(
  private readonly messagesService: MessagesService,
  private readonly jwtService: JwtService,
  private readonly userService: UserService,
) {}


  async handleConnection(client: Socket) {
  try {
    const token = client.handshake.auth?.token?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const payload = this.jwtService.verify(token);
    console.log(payload);
    const user = await this.userService.findOneByEmail(payload.email)
    client.data.user = user; // Store user data in socket instance
    console.log(user);
    

    this.logger.log(`Client connected: ${client.id}, User ID: ${payload.sub}`);
  } catch (error) {
    this.logger.warn(`Unauthorized socket connection: ${error.message}`);
    client.disconnect(); // Force disconnect if unauthorized
  }
}


  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinSession')
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: number; userId: number }
  ) {
    const room = `session_${data.sessionId}`;
    await client.join(room);
    this.logger.log(`User ${data.userId} joined session ${data.sessionId}`);

    // Send recent messages to the newly joined user
    const recentMessages = await this.messagesService.getRecentMessages(data.sessionId, 50);
    client.emit('recentMessages', recentMessages);
  }

  @SubscribeMessage('leaveSession')
  async handleLeaveSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: number; userId: number }
  ) {
    const room = `session_${data.sessionId}`;
    await client.leave(room);
    this.logger.log(`User ${data.userId} left session ${data.sessionId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto
  ) {

    const user = client.data.user;
    if (!user) {
      return client.emit('error', { message: 'Unauthorized' });
    }

    // Optionally override userId for security
    createMessageDto.senderId = user.sub || user.id;
    createMessageDto.senderEmail = createMessageDto.senderEmail || user.email;

    try {
      // Create the message
      const message = await this.messagesService.create(createMessageDto);

      // Get the full message with relations
      const fullMessage = await this.messagesService.findOne(message.id);

      // Emit to all users in the session room
      const room = `session_${createMessageDto.sessionId}`;
      this.server.to(room).emit('newMessage', fullMessage);

      this.logger.log(`Message sent to session ${createMessageDto.sessionId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to send message', error: error.message });
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: number; userId: number }
  ) {
    try {
      await this.messagesService.markAsRead(data.messageId);

      // Optionally emit read status to other users
      const message = await this.messagesService.findOne(data.messageId);
      const room = `session_${message.session.id}`;
      this.server.to(room).emit('messageRead', { messageId: data.messageId, userId: data.userId });
    } catch (error) {
      client.emit('error', { message: 'Failed to mark message as read', error: error.message });
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: number; userId: number; isTyping: boolean }
  ) {
    const room = `session_${data.sessionId}`;
    // Broadcast typing status to other users in the room (excluding sender)
    client.to(room).emit('userTyping', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }
}
