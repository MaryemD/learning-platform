import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity()
export class QuizQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    questionText: string;

    @Column('simple-json')
    options: string[];

    @Column()
    correctAnswerIndex: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
    quiz: Quiz;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}