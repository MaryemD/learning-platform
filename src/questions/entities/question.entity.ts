import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ default: false })
    answered: boolean;

    @ManyToOne(() => Session, (session) => session.questions)
    session: Session;

    @ManyToOne(() => User, (user) => user.questions)
    user: User;
}