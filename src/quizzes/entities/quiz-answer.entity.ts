import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quiz } from './quiz.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class QuizAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionId: number;

    @Column()
    selectedOptionIndex: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.answers)
    quiz: Quiz;

    @ManyToOne(() => User, (user) => user.quizAnswers)
    user: User;
}
