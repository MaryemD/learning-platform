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
        const questionRepository = this.dataSource.getRepository(QuizQuestion);

        const quizzesData = [
            {
                title: 'JavaScript Fundamentals Quiz',
                session: sessions.find(s => s.course.title === 'Advanced JavaScript'),
                questions: [
                    {
                        questionText: 'What is the output of: console.log(typeof null)?',
                        options: ['null', 'undefined', 'object', 'number'],
                        correctAnswerIndex: 2
                    },
                    {
                        questionText: 'Which method is used to add elements to the end of an array?',
                        options: ['push()', 'pop()', 'shift()', 'unshift()'],
                        correctAnswerIndex: 0
                    },
                    {
                        questionText: 'What is closure in JavaScript?',
                        options: [
                            'A way to close the browser window',
                            'A function that has access to variables in its outer scope',
                            'A method to close database connections',
                            'A way to end a loop'
                        ],
                        correctAnswerIndex: 1
                    }
                ]
            },
            {
                title: 'Data Structures Quiz',
                session: sessions.find(s => s.course.title === 'Data Structures and Algorithms'),
                questions: [
                    {
                        questionText: 'What is the time complexity of binary search?',
                        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                        correctAnswerIndex: 2
                    },
                    {
                        questionText: 'Which data structure uses LIFO principle?',
                        options: ['Queue', 'Stack', 'Tree', 'Graph'],
                        correctAnswerIndex: 1
                    },
                    {
                        questionText: 'What is the space complexity of a binary tree?',
                        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                        correctAnswerIndex: 1
                    }
                ]
            },
            {
                title: 'Database Concepts Quiz',
                session: sessions.find(s => s.course.title === 'Database Design and Management'),
                questions: [
                    {
                        questionText: 'What is normalization in databases?',
                        options: [
                            'Converting data to normal form',
                            'A process of organizing data to reduce redundancy',
                            'Making all data uppercase',
                            'Removing all data from database'
                        ],
                        correctAnswerIndex: 1
                    },
                    {
                        questionText: 'Which SQL command is used to modify existing data?',
                        options: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
                        correctAnswerIndex: 2
                    },
                    {
                        questionText: 'What is a foreign key?',
                        options: [
                            'A key from another country',
                            'A field that uniquely identifies each record',
                            'A field that links two tables',
                            'The main key of a table'
                        ],
                        correctAnswerIndex: 2
                    }
                ]
            }
        ];

        const quizzes: Quiz[] = [];

        for (const quizData of quizzesData) {
            const quiz = quizRepository.create({
                title: quizData.title,
                session: quizData.session
            });
            
            const savedQuiz = await quizRepository.save(quiz);

            const questions = quizData.questions.map(q => 
                questionRepository.create({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswerIndex: q.correctAnswerIndex,
                    quiz: savedQuiz
                })
            );

            await questionRepository.save(questions);
            savedQuiz.questions = questions;
            quizzes.push(savedQuiz);
        }

        return quizzes;
    }

    private async seedQuizAnswers(quizzes: Quiz[], users: UserEntity[]): Promise<QuizAnswer[]> {
        console.log('✍️ Seeding quiz answers...');

        const answerRepository = this.dataSource.getRepository(QuizAnswer);
        const students = users.filter(user => user.role === UserRoleEnum.STUDENT);
        const answers: QuizAnswer[] = [];

        for (const quiz of quizzes) {
            // Have some students answer each quiz
            for (const student of students.slice(0, 5)) { // First 5 students
                for (const question of quiz.questions) {
                    // Simulate some correct and incorrect answers
                    const isCorrect = Math.random() > 0.3; // 70% chance of correct answer
                    const selectedOptionIndex = isCorrect ? 
                        question.correctAnswerIndex : 
                        Math.floor(Math.random() * question.options.length);

                    const answer = answerRepository.create({
                        quiz,
                        user: student,
                        questionId: question.id,
                        selectedOptionIndex
                    });

                    answers.push(answer);
                }
            }
        }

        return await answerRepository.save(answers);
    }
}
