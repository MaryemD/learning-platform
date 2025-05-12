import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { QuizQuestion } from './quiz-question.entity';
import { QuizAnswer } from './quiz-answer.entity';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Session, (session) => session.quizzes, { onDelete: 'CASCADE' })
    session: Session;

    @OneToMany(() => QuizQuestion, (question) => question.quiz, { cascade: true })
    questions: QuizQuestion[];

    @OneToMany(() => QuizAnswer, (answer) => answer.quiz, { cascade: true })
    answers: QuizAnswer[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}