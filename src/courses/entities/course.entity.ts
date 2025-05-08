import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Session } from '../../sessions/entities/session.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => User, (user) => user.courses)
    instructor: User;

    @OneToMany(() => Session, (session) => session.course)
    sessions: Session[];
}