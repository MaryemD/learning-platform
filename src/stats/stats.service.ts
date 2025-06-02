import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuizAnswer } from "src/quizzes/entities/quiz-answer.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity"
import { sessionStatsStore } from "./session-stats.store";
import { QuizQuestion } from "src/quizzes/entities/quiz-question.entity";
import { Quiz } from "src/quizzes/entities/quiz.entity";

@Injectable()
export class StatsService {
constructor(
    @InjectRepository(QuizQuestion) private questionRepo: Repository<QuizQuestion>,
    @InjectRepository(QuizAnswer) private answerRepo: Repository<QuizAnswer>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
) {}

// Obtenir les statistiques d'une session
async getStats(sessionId: number) {

    // Récupérer les nombre de users connectés à la session via le store
    const connected = sessionStatsStore.get(sessionId)?.connectedUsers?.size || 0;

    const totalUsers = await this.userRepo.count(); 
    const totalQuestions = await this.questionRepo
    .createQueryBuilder('question')
    .leftJoin('question.quiz', 'quiz')
    .leftJoin('quiz.session', 'session')
    .where('session.id = :sessionId', { sessionId })
    .getCount();
    const totalAnswers = await this.answerRepo
    .createQueryBuilder('answer')
    .leftJoin('answer.quiz', 'quiz')
    .leftJoin('quiz.session', 'session')
    .where('session.id = :sessionId', { sessionId })
    .getCount();

    // Calcule du taux de participation (en %)
    const participationRate = totalUsers ? (totalAnswers / totalUsers) * 100 : 0;

    return {
    connected,
    totalQuestions,
    participationRate: Math.round(participationRate * 10) / 10,
    };
}

async getSessionFromQuiz(quizId: number) {
    const quiz = await this.quizRepo.findOne({
    where: { id: quizId },
    relations: ['session'],
    });
    return quiz?.session || null;
    }
}