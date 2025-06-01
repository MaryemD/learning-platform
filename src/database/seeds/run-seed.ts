import { DataSource } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Message } from '../../messages/entities/message.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { QuizQuestion } from '../../quizzes/entities/quiz-question.entity';
import { QuizAnswer } from '../../quizzes/entities/quiz-answer.entity';
import { DatabaseSeeder } from './seed';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runSeed() {
    console.log('🚀 Initializing database connection...');

    // Create DataSource with the same configuration as in app.module.ts
    const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'learning-platform-db',
        entities: [UserEntity, Course, Session, Message, Quiz, QuizQuestion, QuizAnswer],
        synchronize: true, // This will create tables if they don't exist
        logging: false, // Set to true if you want to see SQL queries
    });

    try {
        // Initialize the connection
        await dataSource.initialize();
        console.log('✅ Database connection established');

        // Create and run the seeder
        const seeder = new DatabaseSeeder(dataSource);
        await seeder.seed();

        console.log('🎉 Seeding completed successfully!');
        console.log('\n📋 Test Users Created:');
        console.log('👑 Admin: admin@university.edu (password: admin123)');
        console.log('👨‍🏫 Instructors:');
        console.log('   - john.smith@university.edu (password: password123)');
        console.log('   - sarah.johnson@university.edu (password: password123)');
        console.log('   - michael.chen@university.edu (password: password123)');
        console.log('👨‍🎓 Students:');
        console.log('   - alice.cooper@student.edu (password: password123)');
        console.log('   - bob.wilson@student.edu (password: password123)');
        console.log('   - charlie.brown@student.edu (password: password123)');
        console.log('   - diana.prince@student.edu (password: password123)');
        console.log('   - eva.martinez@student.edu (password: password123)');
        console.log('   - frank.miller@student.edu (password: password123)');
        console.log('   - grace.lee@student.edu (password: password123)');
        console.log('   - henry.davis@student.edu (password: password123)');
        console.log('\n🎯 Test Data Includes:');
        console.log('   - 6 courses across different subjects');
        console.log('   - 8 sessions (some live, some scheduled)');
        console.log('   - Real-time chat messages for testing WebSocket functionality');
        console.log('   - 4 quizzes with questions and student answers');
        console.log('   - Mixed correct/incorrect quiz answers for analytics testing');
        console.log('\n🔧 You can now test:');
        console.log('   - User authentication with different roles');
        console.log('   - Course and session management');
        console.log('   - Real-time messaging and WebSocket connections');
        console.log('   - Quiz creation and student responses');
        console.log('   - Analytics and reporting features');
        console.log('   - Permission-based access control');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        // Close the connection
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run the seeder
runSeed().catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
