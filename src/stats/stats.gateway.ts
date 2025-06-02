import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayDisconnect,
    OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StatsService } from './stats.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/stats',
})
export class StatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(StatsGateway.name);

    // Pour stocker les intervalles associés à chaque client
    private intervals: Map<string, NodeJS.Timeout> = new Map();

    constructor(private readonly statsService: StatsService) {
        console.log('StatsService injected:', statsService);
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const interval = this.intervals.get(client.id);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(client.id);
        }
    }

    @SubscribeMessage('subscribeToStats')
    async handleStatsSubscription(
        @MessageBody() data: { quizId: number },
        @ConnectedSocket() client: Socket,
    ) {
        const quizId = data.quizId;
        const session = await this.statsService.getSessionFromQuiz(quizId);

        if (!session) {
            client.emit('statsError', { message: 'Session not found for quiz' });
            return;
        }

        const sessionId = session.id;

        // Send initial stats
        const initialStats = await this.statsService.getStats(sessionId);
        client.emit('statsUpdate', initialStats);

        // Set up periodic updates
        const interval = setInterval(async () => {
            const stats = await this.statsService.getStats(sessionId);
            client.emit('statsUpdate', stats);
        }, 3000);

        this.intervals.set(client.id, interval);

        return { event: 'subscribedToStats', data: { quizId } };
    }
}