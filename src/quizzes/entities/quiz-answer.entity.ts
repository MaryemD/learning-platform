import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

    @ManyToOne(() => Quiz, (quiz) => quiz.answers, { onDelete: 'CASCADE' })
    quiz: Quiz;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
