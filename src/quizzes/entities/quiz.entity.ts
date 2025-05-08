import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { QuizQuestion } from './quiz-question.entity';
import { QuizAnswer } from './quiz-answer.entity';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Session, (session) => session.quizzes)
    session: Session;

    @OneToMany(() => QuizQuestion, (question) => question.quiz)
    questions: QuizQuestion[];

    @OneToMany(() => QuizAnswer, (answer) => answer.quiz)
    answers: QuizAnswer[];
}