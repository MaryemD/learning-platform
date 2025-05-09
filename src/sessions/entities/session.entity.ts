import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    startTime: Date;

    @Column({ default: false })
    isLive: boolean;

    @ManyToOne(() => Course, (course) => course.sessions)
    course: Course;

    @ManyToOne(() => UserEntity, (user) => user.sessions)
    instructor: UserEntity;

    @OneToMany(() => Question, (question) => question.session)
    questions: Question[];

    @OneToMany(() => Quiz, (quiz) => quiz.session)
    quizzes: Quiz[];
}