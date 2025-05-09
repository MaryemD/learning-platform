import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Course } from '../../courses/entities/course.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuizAnswer } from '../../quizzes/entities/quiz-answer.entity';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column() name: string;

    @Column({ unique: true }) email: string;

    @Column() password: string;

    @Column() salt: string;
    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.STUDENT,
    })
    role: UserRoleEnum;

    @OneToMany(() => Course,  course  => course.instructor)  courses: Course[];
    @OneToMany(() => Session, session => session.instructor) sessions: Session[];
    @OneToMany(() => Question, question => question.user)   questions: Question[];
    @OneToMany(() => QuizAnswer, answer => answer.user)     quizAnswers: QuizAnswer[];
}
