import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quiz } from './quiz.entity';
import { UserEntity } from '../../users/entities/user.entity';

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

    @ManyToOne(() => UserEntity, (user) => user.quizAnswers)
    user: UserEntity;
}
