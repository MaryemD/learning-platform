import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity()
export class QuizQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionText: string;

    @Column('text')
    options: string;

    @Column()
    correctAnswerIndex: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    quiz: Quiz;
}