import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuizAnswer } from '../../quizzes/entities/quiz-answer.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'student' })
    role: 'student' | 'instructor';

    @OneToMany(() => Course, (course) => course.instructor)
    courses: Course[];

    @OneToMany(() => Session, (session) => session.instructor)
    sessions: Session[];

    @OneToMany(() => Question, (question) => question.user)
    questions: Question[];

    @OneToMany(() => QuizAnswer, (answer) => answer.user)
    quizAnswers: QuizAnswer[];
}
