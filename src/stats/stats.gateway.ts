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
    cors: { origin: '*' }, // Permet de recevoir des connexions depuis n'importe quelle origine
    namespace: '/stats', 
})
export class StatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Logger pour les messages de connexion et de déconnexion
    private readonly logger = new Logger(StatsGateway.name);

    // Pour stocker les intervalles associés à chaque client
    private intervals: Map<string, NodeJS.Timeout> = new Map();

    constructor(private readonly statsService: StatsService) {}

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

    // Gestion de la souscription aux statistiques
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

        // Récupérer les statistiques initiales
        const initialStats = await this.statsService.getStats(sessionId);
        client.emit('statsUpdate', initialStats);

        // Mettre à jour les statistiques toutes les 3 secondes
        const interval = setInterval(async () => {
            const stats = await this.statsService.getStats(sessionId);
            client.emit('statsUpdate', stats);
        }, 3000);

        // Stocker l'intervalle pour le client pour pouvoir le nettoyer lors de la déconnexion
        this.intervals.set(client.id, interval);

        // Retourner un message de succès
        return { event: 'subscribedToStats', data: { quizId } };
    }
}