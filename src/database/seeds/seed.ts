import { DataSource } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Message } from '../../messages/entities/message.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { QuizQuestion } from '../../quizzes/entities/quiz-question.entity';
import { QuizAnswer } from '../../quizzes/entities/quiz-answer.entity';
import { UserRoleEnum } from '../../enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export class DatabaseSeeder {
    constructor(private dataSource: DataSource) {}

    async seed() {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await this.clearDatabase();

        // Seed data
        const users = await this.seedUsers();
        const courses = await this.seedCourses(users);
        const sessions = await this.seedSessions(courses, users);
        const messages = await this.seedMessages(sessions, users);
        const quizzes = await this.seedQuizzes(sessions, users);
        const quizAnswers = await this.seedQuizAnswers(quizzes, users);

        console.log('✅ Database seeding completed successfully!');
        console.log(`Created: ${users.length} users, ${courses.length} courses, ${sessions.length} sessions, ${messages.length} messages, ${quizzes.length} quizzes, ${quizAnswers.length} quiz answers`);
    }

    private async clearDatabase() {
        console.log('🧹 Clearing existing data...');

        // Disable foreign key checks temporarily
        await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

        const entities = [QuizAnswer, Message, QuizQuestion, Quiz, Session, Course, UserEntity];

        for (const entity of entities) {
            const repository = this.dataSource.getRepository(entity);
            await repository.clear();
        }

        // Re-enable foreign key checks
        await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    private async seedUsers(): Promise<UserEntity[]> {
        console.log('👥 Seeding users...');

        const userRepository = this.dataSource.getRepository(UserEntity);
        const salt = await bcrypt.genSalt();

        const usersData = [
            // Admin user for testing admin functionalities
            {
                name: 'System Administrator',
                email: 'admin@university.edu',
                password: await bcrypt.hash('admin123', salt),
                salt,
                role: UserRoleEnum.ADMIN,
            },
            // Instructors
            {
                name: 'Dr. John Smith',
                email: 'john.smith@university.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.INSTRUCTOR,
            },
            {
                name: 'Prof. Sarah Johnson',
                email: 'sarah.johnson@university.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.INSTRUCTOR,
            },
            {
                name: 'Dr. Michael Chen',
                email: 'michael.chen@university.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.INSTRUCTOR,
            },
            // Students
            {
                name: 'Alice Cooper',
                email: 'alice.cooper@student.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.STUDENT,
            },
            {
                name: 'Bob Wilson',
                email: 'bob.wilson@student.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.STUDENT,
            },
            {
                name: 'Charlie Brown',
                email: 'charlie.brown@student.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.STUDENT,
            },
            {
                name: 'Diana Prince',
                email: 'diana.prince@student.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.STUDENT,
            },
            {
                name: 'Eva Martinez',
                email: 'eva.martinez@student.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.STUDENT,
            },
            {
                name: 'Frank Miller',
                email: 'frank.miller@student.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.STUDENT,
            },
            {
                name: 'Grace Lee',
                email: 'grace.lee@student.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.STUDENT,
            },
            {
                name: 'Henry Davis',
                email: 'henry.davis@student.edu',
                password: await bcrypt.hash('password123', salt),
                salt,
                role: UserRoleEnum.STUDENT,
            }
        ];

        const users = userRepository.create(usersData);
        return await userRepository.save(users);
    }

    private async seedCourses(users: UserEntity[]): Promise<Course[]> {
        console.log('📚 Seeding courses...');

        const courseRepository = this.dataSource.getRepository(Course);
        const instructors = users.filter(user => user.role === UserRoleEnum.INSTRUCTOR);

        const coursesData = [
            {
                title: 'Introduction to Computer Science',
                description: 'Learn the fundamentals of programming and computer science concepts.',
                instructor: instructors[0], // Dr. John Smith
            },
            {
                title: 'Web Development Bootcamp',
                description: 'Full-stack web development with modern technologies.',
                instructor: instructors[0], // Dr. John Smith
            },
            {
                title: 'Data Structures and Algorithms',
                description: 'Master essential data structures and algorithmic thinking.',
                instructor: instructors[1], // Prof. Sarah Johnson
            },
            {
                title: 'Database Design and Management',
                description: 'Learn to design and manage relational databases.',
                instructor: instructors[1], // Prof. Sarah Johnson
            },
            {
                title: 'Machine Learning Fundamentals',
                description: 'Introduction to machine learning algorithms and applications.',
                instructor: instructors[2], // Dr. Michael Chen
            },
            {
                title: 'Advanced JavaScript',
                description: 'Deep dive into modern JavaScript features and frameworks.',
                instructor: instructors[2], // Dr. Michael Chen
            }
        ];

        const courses = courseRepository.create(coursesData);
        return await courseRepository.save(courses);
    }

    private async seedSessions(courses: Course[], users: UserEntity[]): Promise<Session[]> {
        console.log('🎓 Seeding sessions...');

        const sessionRepository = this.dataSource.getRepository(Session);
        const now = new Date();

        const sessionsData = [
            {
                title: 'Introduction to Programming - Week 1',
                startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
                isLive: true,
                course: courses[0],
                instructor: courses[0].instructor,
            },
            {
                title: 'HTML & CSS Fundamentals',
                startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
                isLive: true,
                course: courses[1],
                instructor: courses[1].instructor,
            },
            {
                title: 'JavaScript Basics',
                startTime: new Date(now.getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
                isLive: false,
                course: courses[1],
                instructor: courses[1].instructor,
            },
            {
                title: 'Arrays and Linked Lists',
                startTime: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
                isLive: true,
                course: courses[2],
                instructor: courses[2].instructor,
            },
            {
                title: 'SQL Fundamentals',
                startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
                isLive: false,
                course: courses[3],
                instructor: courses[3].instructor,
            },
            {
                title: 'Introduction to Neural Networks',
                startTime: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
                isLive: true,
                course: courses[4],
                instructor: courses[4].instructor,
            },
            {
                title: 'ES6+ Features and Modern JavaScript',
                startTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
                isLive: false,
                course: courses[5],
                instructor: courses[5].instructor,
            },
            {
                title: 'React Fundamentals',
                startTime: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
                isLive: true,
                course: courses[1],
                instructor: courses[1].instructor,
            }
        ];

        const sessions = sessionRepository.create(sessionsData);
        return await sessionRepository.save(sessions);
    }

    private async seedMessages(sessions: Session[], users: UserEntity[]): Promise<Message[]> {
        console.log('💬 Seeding messages...');

        const messageRepository = this.dataSource.getRepository(Message);
        const students = users.filter(user => user.role === UserRoleEnum.STUDENT);
        const instructors = users.filter(user => user.role === UserRoleEnum.INSTRUCTOR);

        const messagesData: any[] = [];
        const now = new Date();

        // Messages for Session 1 (Introduction to Programming)
        const session1Messages = [
            {
                content: 'Welcome everyone to our first programming session! 👋',
                sender: sessions[0].instructor,
                session: sessions[0],
                timestamp: new Date(now.getTime() - 90 * 60 * 1000), // 90 minutes ago
                isRead: true,
            },
            {
                content: 'Hello Professor! Excited to learn programming!',
                sender: students[0], // Alice
                session: sessions[0],
                timestamp: new Date(now.getTime() - 89 * 60 * 1000),
                isRead: true,
            },
            {
                content: 'Hi everyone! Looking forward to this course 🚀',
                sender: students[1], // Bob
                session: sessions[0],
                timestamp: new Date(now.getTime() - 88 * 60 * 1000),
                isRead: true,
            },
            {
                content: 'Today we\'ll cover variables, data types, and basic operations. Any questions before we start?',
                sender: sessions[0].instructor,
                session: sessions[0],
                timestamp: new Date(now.getTime() - 85 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'What programming language will we be using?',
                sender: students[2], // Charlie
                session: sessions[0],
                timestamp: new Date(now.getTime() - 84 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'We\'ll start with Python as it\'s beginner-friendly and widely used in the industry.',
                sender: sessions[0].instructor,
                session: sessions[0],
                timestamp: new Date(now.getTime() - 83 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'Perfect! I\'ve heard Python is great for beginners.',
                sender: students[3], // Diana
                session: sessions[0],
                timestamp: new Date(now.getTime() - 82 * 60 * 1000),
                isRead: false,
            }
        ];

        // Messages for Session 2 (HTML & CSS)
        const session2Messages = [
            {
                content: 'Good morning class! Ready to dive into web development? 🌐',
                sender: sessions[1].instructor,
                session: sessions[1],
                timestamp: new Date(now.getTime() - 50 * 60 * 1000), // 50 minutes ago
                isRead: true,
            },
            {
                content: 'Yes! Can\'t wait to build my first website!',
                sender: students[4], // Eva
                session: sessions[1],
                timestamp: new Date(now.getTime() - 49 * 60 * 1000),
                isRead: true,
            },
            {
                content: 'Will we be using any frameworks or just vanilla HTML/CSS?',
                sender: students[5], // Frank
                session: sessions[1],
                timestamp: new Date(now.getTime() - 48 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'We\'ll start with vanilla HTML and CSS to understand the fundamentals first.',
                sender: sessions[1].instructor,
                session: sessions[1],
                timestamp: new Date(now.getTime() - 47 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'That makes sense. Building a strong foundation is important.',
                sender: students[0], // Alice
                session: sessions[1],
                timestamp: new Date(now.getTime() - 46 * 60 * 1000),
                isRead: false,
            }
        ];

        // Messages for Session 4 (Arrays and Linked Lists)
        const session4Messages = [
            {
                content: 'Let\'s explore data structures today! We\'ll start with arrays. 📊',
                sender: sessions[3].instructor,
                session: sessions[3],
                timestamp: new Date(now.getTime() - 25 * 60 * 1000), // 25 minutes ago
                isRead: true,
            },
            {
                content: 'I\'ve been struggling with linked lists. Hope this helps!',
                sender: students[1], // Bob
                session: sessions[3],
                timestamp: new Date(now.getTime() - 24 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'Don\'t worry Bob, we\'ll go through it step by step with examples.',
                sender: sessions[3].instructor,
                session: sessions[3],
                timestamp: new Date(now.getTime() - 23 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'What\'s the main difference between arrays and linked lists?',
                sender: students[2], // Charlie
                session: sessions[3],
                timestamp: new Date(now.getTime() - 22 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'Great question! Arrays have fixed size and contiguous memory, while linked lists are dynamic.',
                sender: sessions[3].instructor,
                session: sessions[3],
                timestamp: new Date(now.getTime() - 21 * 60 * 1000),
                isRead: false,
            }
        ];

        // Messages for Session 6 (Neural Networks)
        const session6Messages = [
            {
                content: 'Welcome to Machine Learning! Today we\'ll explore neural networks. 🧠',
                sender: sessions[5].instructor,
                session: sessions[5],
                timestamp: new Date(now.getTime() - 40 * 60 * 1000), // 40 minutes ago
                isRead: true,
            },
            {
                content: 'This is so exciting! I\'ve always wanted to learn about AI.',
                sender: students[4], // Eva
                session: sessions[5],
                timestamp: new Date(now.getTime() - 39 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'What programming language will we use for ML?',
                sender: students[6], // Grace
                session: sessions[5],
                timestamp: new Date(now.getTime() - 38 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'We\'ll primarily use Python with libraries like TensorFlow and PyTorch.',
                sender: sessions[5].instructor,
                session: sessions[5],
                timestamp: new Date(now.getTime() - 37 * 60 * 1000),
                isRead: false,
            }
        ];

        // Messages for Session 8 (React Fundamentals)
        const session8Messages = [
            {
                content: 'Let\'s dive into React! Who has experience with JavaScript frameworks? ⚛️',
                sender: sessions[7].instructor,
                session: sessions[7],
                timestamp: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutes ago
                isRead: true,
            },
            {
                content: 'I\'ve used Vue.js before, but this is my first time with React.',
                sender: students[5], // Frank
                session: sessions[7],
                timestamp: new Date(now.getTime() - 9 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'Perfect! The concepts are similar. React uses components and state management.',
                sender: sessions[7].instructor,
                session: sessions[7],
                timestamp: new Date(now.getTime() - 8 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'Will we be building a real project?',
                sender: students[7], // Henry
                session: sessions[7],
                timestamp: new Date(now.getTime() - 7 * 60 * 1000),
                isRead: false,
            },
            {
                content: 'Absolutely! We\'ll build a todo app and then a chat application.',
                sender: sessions[7].instructor,
                session: sessions[7],
                timestamp: new Date(now.getTime() - 6 * 60 * 1000),
                isRead: false,
            }
        ];

        messagesData.push(...session1Messages, ...session2Messages, ...session4Messages, ...session6Messages, ...session8Messages);

        const messages = messageRepository.create(messagesData);
        return await messageRepository.save(messages);
    }

    private async seedQuizzes(sessions: Session[], users: UserEntity[]): Promise<Quiz[]> {
        console.log('📝 Seeding quizzes...');

        const quizRepository = this.dataSource.getRepository(Quiz);
        const quizQuestionRepository = this.dataSource.getRepository(QuizQuestion);

        // Create quiz for Session 1
        const quiz1 = quizRepository.create({
            title: 'Programming Basics Quiz',
            session: sessions[0],
        });
        const savedQuiz1 = await quizRepository.save(quiz1);

        const quiz1Questions = [
            {
                questionText: 'What is a variable in programming?',
                options: ['A fixed value', 'A container for storing data', 'A type of loop', 'A function'],
                correctAnswerIndex: 1,
                quiz: savedQuiz1,
            },
            {
                questionText: 'Which of these is a Python data type?',
                options: ['int', 'string', 'boolean', 'All of the above'],
                correctAnswerIndex: 3,
                quiz: savedQuiz1,
            }
        ];

        await quizQuestionRepository.save(quiz1Questions);

        // Create quiz for Session 2
        const quiz2 = quizRepository.create({
            title: 'HTML & CSS Basics',
            session: sessions[1],
        });
        const savedQuiz2 = await quizRepository.save(quiz2);

        const quiz2Questions = [
            {
                questionText: 'What does HTML stand for?',
                options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
                correctAnswerIndex: 0,
                quiz: savedQuiz2,
            },
            {
                questionText: 'Which CSS property is used to change text color?',
                options: ['font-color', 'text-color', 'color', 'foreground-color'],
                correctAnswerIndex: 2,
                quiz: savedQuiz2,
            }
        ];

        await quizQuestionRepository.save(quiz2Questions);

        // Create quiz for Session 4 (Data Structures)
        const quiz3 = quizRepository.create({
            title: 'Data Structures Quiz',
            session: sessions[3],
        });
        const savedQuiz3 = await quizRepository.save(quiz3);

        const quiz3Questions = [
            {
                questionText: 'What is the time complexity of accessing an element in an array by index?',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correctAnswerIndex: 0,
                quiz: savedQuiz3,
            },
            {
                questionText: 'Which data structure follows LIFO principle?',
                options: ['Queue', 'Stack', 'Array', 'Linked List'],
                correctAnswerIndex: 1,
                quiz: savedQuiz3,
            }
        ];

        await quizQuestionRepository.save(quiz3Questions);

        // Create quiz for Session 6 (Machine Learning)
        const quiz4 = quizRepository.create({
            title: 'Neural Networks Basics',
            session: sessions[5],
        });
        const savedQuiz4 = await quizRepository.save(quiz4);

        const quiz4Questions = [
            {
                questionText: 'What is a neuron in the context of neural networks?',
                options: ['A brain cell', 'A computational unit that processes inputs', 'A type of algorithm', 'A programming language'],
                correctAnswerIndex: 1,
                quiz: savedQuiz4,
            },
            {
                questionText: 'What is the purpose of an activation function?',
                options: ['To start the network', 'To introduce non-linearity', 'To stop training', 'To save the model'],
                correctAnswerIndex: 1,
                quiz: savedQuiz4,
            }
        ];

        await quizQuestionRepository.save(quiz4Questions);

        return [savedQuiz1, savedQuiz2, savedQuiz3, savedQuiz4];
    }

    private async seedQuizAnswers(quizzes: Quiz[], users: UserEntity[]): Promise<QuizAnswer[]> {
        console.log('📝 Seeding quiz answers...');

        const quizAnswerRepository = this.dataSource.getRepository(QuizAnswer);
        const students = users.filter(user => user.role === UserRoleEnum.STUDENT);

        const quizAnswersData: any[] = [];

        // Answers for Quiz 1 (Programming Basics)
        const quiz1 = quizzes[0];

        // Alice's answers (correct answers)
        quizAnswersData.push(
            {
                questionId: 1, // First question
                selectedOptionIndex: 1, // Correct answer
                quiz: quiz1,
                user: students[0], // Alice
            },
            {
                questionId: 2, // Second question
                selectedOptionIndex: 3, // Correct answer
                quiz: quiz1,
                user: students[0], // Alice
            }
        );

        // Bob's answers (mixed correct/incorrect)
        quizAnswersData.push(
            {
                questionId: 1,
                selectedOptionIndex: 0, // Incorrect answer
                quiz: quiz1,
                user: students[1], // Bob
            },
            {
                questionId: 2,
                selectedOptionIndex: 3, // Correct answer
                quiz: quiz1,
                user: students[1], // Bob
            }
        );

        // Answers for Quiz 2 (HTML & CSS)
        const quiz2 = quizzes[1];

        // Eva's answers
        quizAnswersData.push(
            {
                questionId: 3, // First HTML question
                selectedOptionIndex: 0, // Correct answer
                quiz: quiz2,
                user: students[4], // Eva
            },
            {
                questionId: 4, // CSS question
                selectedOptionIndex: 2, // Correct answer
                quiz: quiz2,
                user: students[4], // Eva
            }
        );

        // Frank's answers
        quizAnswersData.push(
            {
                questionId: 3,
                selectedOptionIndex: 1, // Incorrect answer
                quiz: quiz2,
                user: students[5], // Frank
            },
            {
                questionId: 4,
                selectedOptionIndex: 1, // Incorrect answer
                quiz: quiz2,
                user: students[5], // Frank
            }
        );

        // Answers for Quiz 3 (Data Structures)
        const quiz3 = quizzes[2];

        // Charlie's answers
        quizAnswersData.push(
            {
                questionId: 5, // Array access question
                selectedOptionIndex: 0, // Correct answer
                quiz: quiz3,
                user: students[2], // Charlie
            },
            {
                questionId: 6, // LIFO question
                selectedOptionIndex: 1, // Correct answer
                quiz: quiz3,
                user: students[2], // Charlie
            }
        );

        // Diana's answers
        quizAnswersData.push(
            {
                questionId: 5,
                selectedOptionIndex: 1, // Incorrect answer
                quiz: quiz3,
                user: students[3], // Diana
            },
            {
                questionId: 6,
                selectedOptionIndex: 0, // Incorrect answer
                quiz: quiz3,
                user: students[3], // Diana
            }
        );

        // Answers for Quiz 4 (Neural Networks)
        const quiz4 = quizzes[3];

        // Grace's answers
        quizAnswersData.push(
            {
                questionId: 7, // Neuron question
                selectedOptionIndex: 1, // Correct answer
                quiz: quiz4,
                user: students[6], // Grace
            },
            {
                questionId: 8, // Activation function question
                selectedOptionIndex: 1, // Correct answer
                quiz: quiz4,
                user: students[6], // Grace
            }
        );

        // Henry's answers
        quizAnswersData.push(
            {
                questionId: 7,
                selectedOptionIndex: 0, // Incorrect answer
                quiz: quiz4,
                user: students[7], // Henry
            },
            {
                questionId: 8,
                selectedOptionIndex: 0, // Incorrect answer
                quiz: quiz4,
                user: students[7], // Henry
            }
        );

        const quizAnswers = quizAnswerRepository.create(quizAnswersData);
        return await quizAnswerRepository.save(quizAnswers);
    }
}
