import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ default: false })
    isRead: boolean;

    @ManyToOne(() => UserEntity, (user) => user.sentMessages)
    sender: UserEntity;

    @ManyToOne(() => Session, (session) => session.messages)
    session: Session;
}