import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Session } from '../../sessions/entities/session.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => UserEntity, (user) => user.courses)
    instructor: UserEntity;

    @OneToMany(() => Session, (session) => session.course)
    sessions: Session[];
}