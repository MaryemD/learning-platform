import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizzesService } from './quizzes.service';
import { StartQuizDto } from './dto/start-quiz.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { Injectable } from '@nestjs/common';
import { EventPublisherService } from 'src/analytics/services/event-publisher.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/quizzes',
})
export class QuizzesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly eventPublisherService: EventPublisherService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinQuiz')
  async handleJoinQuiz(
    @MessageBody() data: { quizId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = `quiz_${data.quizId}`;
    await client.join(roomId);
    this.server.to(roomId).emit('userJoined', { userId: data.userId });
    this.eventPublisherService.notifyQuizParticipation(
      (await this.quizzesService.getSession(data.quizId)).id,
      data.userId,
      data.quizId,
    );
    return { event: 'joinedQuiz', data: { quizId: data.quizId } };
  }

  @SubscribeMessage('startQuiz')
  async handleStartQuiz(
    @MessageBody() data: StartQuizDto,
    @ConnectedSocket() client: Socket,
  ) {
    const quiz = await this.quizzesService.findOne(data.quizId);
    const roomId = `quiz_${data.quizId}`;

    // Start the quiz session
    this.server.to(roomId).emit('quizStarted', {
      quizId: data.quizId,
      questions: quiz.questions,
      timeLimit: data.timeLimit,
    });

    // If there's a time limit, schedule the quiz end
    if (data.timeLimit) {
      setTimeout(() => {
        this.server.to(roomId).emit('quizEnded', { quizId: data.quizId });
      }, data.timeLimit * 1000);
    }

    return { event: 'quizStarted', data: { quizId: data.quizId } };
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody() data: SubmitAnswerDto,
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = `quiz_${data.quizId}`;

    // Save the answer
    const answer = await this.quizzesService.createAnswer({
      quizId: data.quizId,
      questionId: data.questionId,
      userId: data.userId,
      selectedOptionIndex: data.selectedOptionIndex,
    });

    // Get the question to check if it's correct
    const question = await this.quizzesService.getQuestion(data.questionId);
    const isCorrect = question.correctAnswerIndex === data.selectedOptionIndex;

    // Notify the instructor about the submission
    this.server.to(roomId).emit('answerSubmitted', {
      userId: data.userId,
      questionId: data.questionId,
      isCorrect,
    });
    this.eventPublisherService.NotifyWithQuizQuestionResult(
      (await this.quizzesService.getSession(data.quizId)).id,
      data.quizId,
      data.questionId,
      data.userId,
      isCorrect,
    );

    return {
      event: 'answerReceived',
      data: {
        status: 'ok',
        isCorrect,
      },
    };
  }

  @SubscribeMessage('endQuiz')
  async handleEndQuiz(
    @MessageBody() data: { quizId: number; instructorId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = `quiz_${data.quizId}`;

    // Get final results
    const quiz = await this.quizzesService.findOne(data.quizId);
    const results = await this.quizzesService.calculateQuizResults(data.quizId);

    // Broadcast end of quiz and results
    this.server.to(roomId).emit('quizEnded', {
      quizId: data.quizId,
      results,
    });

    return { event: 'quizEnded', data: { quizId: data.quizId, results } };
  }
}
