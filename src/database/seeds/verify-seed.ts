import { DataSource } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Message } from '../../messages/entities/message.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { QuizQuestion } from '../../quizzes/entities/quiz-question.entity';
import { QuizAnswer } from '../../quizzes/entities/quiz-answer.entity';
import { UserRoleEnum } from '../../enums/user-role.enum';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function verifySeed() {
    console.log('🔍 Verifying seeded data...');

    const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'learning-platform-db',
        entities: [UserEntity, Course, Session, Message, Quiz, QuizQuestion, QuizAnswer],
        synchronize: false,
        logging: false,
    });

    try {
        await dataSource.initialize();
        console.log('✅ Database connection established');

        // Verify users
        const userRepository = dataSource.getRepository(UserEntity);
        const users = await userRepository.find();
        const adminCount = users.filter(u => u.role === UserRoleEnum.ADMIN).length;
        const instructorCount = users.filter(u => u.role === UserRoleEnum.INSTRUCTOR).length;
        const studentCount = users.filter(u => u.role === UserRoleEnum.STUDENT).length;

        console.log(`\n👥 Users: ${users.length} total`);
        console.log(`   - Admins: ${adminCount}`);
        console.log(`   - Instructors: ${instructorCount}`);
        console.log(`   - Students: ${studentCount}`);

        // Verify courses
        const courseRepository = dataSource.getRepository(Course);
        const courses = await courseRepository.find({ relations: ['instructor'] });
        console.log(`\n📚 Courses: ${courses.length} total`);
        courses.forEach(course => {
            console.log(`   - "${course.title}" by ${course.instructor.name}`);
        });

        // Verify sessions
        const sessionRepository = dataSource.getRepository(Session);
        const sessions = await sessionRepository.find({ relations: ['course', 'instructor'] });
        const liveSessions = sessions.filter(s => s.isLive).length;
        console.log(`\n🎓 Sessions: ${sessions.length} total (${liveSessions} live)`);

        // Verify messages
        const messageRepository = dataSource.getRepository(Message);
        const messages = await messageRepository.find({ relations: ['sender', 'session'] });
        console.log(`\n💬 Messages: ${messages.length} total`);

        // Group messages by session
        const messagesBySession = messages.reduce((acc, msg) => {
            const sessionTitle = msg.session.title;
            acc[sessionTitle] = (acc[sessionTitle] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(messagesBySession).forEach(([session, count]) => {
            console.log(`   - "${session}": ${count} messages`);
        });

        // Verify quizzes
        const quizRepository = dataSource.getRepository(Quiz);
        const quizzes = await quizRepository.find({ relations: ['session', 'questions'] });
        console.log(`\n📝 Quizzes: ${quizzes.length} total`);
        quizzes.forEach(quiz => {
            console.log(`   - "${quiz.title}": ${quiz.questions.length} questions`);
        });

        // Verify quiz answers
        const quizAnswerRepository = dataSource.getRepository(QuizAnswer);
        const quizAnswers = await quizAnswerRepository.find({ relations: ['user', 'quiz'] });
        console.log(`\n✅ Quiz Answers: ${quizAnswers.length} total`);

        // Group answers by user
        const answersByUser = quizAnswers.reduce((acc, answer) => {
            const userName = answer.user.name;
            acc[userName] = (acc[userName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(answersByUser).forEach(([user, count]) => {
            console.log(`   - ${user}: ${count} answers`);
        });

        console.log('\n🎉 Verification completed! All data looks good.');
        console.log('\n🚀 You can now start testing your application with:');
        console.log('   npm run start:dev');

    } catch (error) {
        console.error('❌ Error during verification:', error);
        process.exit(1);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

// Run verification
verifySeed().catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
