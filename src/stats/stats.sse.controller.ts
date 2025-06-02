import { Controller, Get, Param, Res, Req, ParseIntPipe,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { Response, Request } from 'express';
import { IncomingMessage } from 'http';

@Controller('sse')
export class StatsSseController {
constructor(private readonly statsService: StatsService) {}

@Get('stats/:sessionId')
async sendStats(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Res() res: Response,
    @Req() req: Request,
    ) {

    // Configurer les headers pour le SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Mettre à jour les statistiques toutes les 3 secondes
    const intervalId = setInterval(async () => {
    const stats = await this.statsService.getStats(sessionId);
    res.write(`data: ${JSON.stringify(stats)}\n\n`);
    }, 3000); 

    // Nettoyer l'intervalle lors de la fermeture de la connexion
    const client = req as unknown as IncomingMessage;
    client.on('close', () => {
    clearInterval(intervalId);
    res.end();
    console.log(`SSE connection closed for session ${sessionId}`);
    });
    }
}