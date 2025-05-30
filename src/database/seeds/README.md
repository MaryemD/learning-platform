# Database Seeding

This directory contains comprehensive database seeding functionality to populate your learning platform with realistic test data.

## Quick Start

To seed your database with test data, run:

```bash
npm run seed
```

## What Gets Created

### 👥 Users (12 total)
- **1 Admin**: System Administrator with full access
- **3 Instructors**: Course creators and session managers  
- **8 Students**: Course participants with varied engagement levels

### 📚 Courses (6 total)
- Introduction to Computer Science
- Web Development Bootcamp  
- Data Structures and Algorithms
- Database Design and Management
- Machine Learning Fundamentals
- Advanced JavaScript

### 🎓 Sessions (8 total)
- Mix of live and scheduled sessions
- Realistic timing (some in progress, some upcoming)
- Distributed across different courses

### 💬 Messages (25+ total)
- Real-time chat conversations in live sessions
- Mix of instructor and student messages
- Realistic timestamps for testing WebSocket functionality
- Some messages marked as read/unread for testing

### 📝 Quizzes (4 total)
- Programming Basics Quiz
- HTML & CSS Basics Quiz  
- Data Structures Quiz
- Neural Networks Basics Quiz

### ✅ Quiz Answers (16 total)
- Student responses to quiz questions
- Mix of correct and incorrect answers
- Realistic data for analytics testing

## Test Credentials

### Admin Access
- **Email**: admin@university.edu
- **Password**: admin123
- **Role**: ADMIN

### Instructors
- **Dr. John Smith**: john.smith@university.edu (password123)
- **Prof. Sarah Johnson**: sarah.johnson@university.edu (password123)  
- **Dr. Michael Chen**: michael.chen@university.edu (password123)

### Students
- **Alice Cooper**: alice.cooper@student.edu (password123)
- **Bob Wilson**: bob.wilson@student.edu (password123)
- **Charlie Brown**: charlie.brown@student.edu (password123)
- **Diana Prince**: diana.prince@student.edu (password123)
- **Eva Martinez**: eva.martinez@student.edu (password123)
- **Frank Miller**: frank.miller@student.edu (password123)
- **Grace Lee**: grace.lee@student.edu (password123)
- **Henry Davis**: henry.davis@student.edu (password123)

## Testing Scenarios

### 🔐 Authentication & Authorization
- Test login with different user roles
- Verify role-based access control
- Test admin privileges vs instructor vs student permissions

### 💬 Real-time Messaging
- Join live sessions and test WebSocket connections
- Send messages and verify real-time delivery
- Test message read/unread status
- Test message history and pagination

### 📊 Quiz Functionality  
- Create new quizzes as an instructor
- Take quizzes as students
- View quiz results and analytics
- Test quiz answer validation

### 📈 Analytics & Reporting
- View session participation metrics
- Analyze quiz performance data
- Test real-time analytics updates
- Generate reports on student engagement

### 🎯 Course Management
- Create and manage courses as instructor
- Enroll in courses as student
- Schedule and manage sessions
- Test course access permissions

## Files Structure

```
src/database/seeds/
├── seed.ts           # Main seeding class with all data creation logic
├── run-seed.ts       # Script to execute seeding (called by npm run seed)
└── README.md         # This documentation file
```

## Customization

To modify the seed data:

1. **Edit `seed.ts`** to change user data, courses, sessions, etc.
2. **Run seeding again** with `npm run seed`
3. **Data is cleared** before each seeding run to ensure consistency

## Database Requirements

- MySQL database running
- Correct environment variables in `.env` file:
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=root
  DB_PASSWORD=your_password
  DB_NAME=learning-platform-db
  ```

## Troubleshooting

### Connection Issues
- Verify MySQL is running
- Check `.env` file configuration
- Ensure database exists

### Permission Errors
- Verify database user has CREATE, INSERT, UPDATE, DELETE permissions
- Check if tables need to be created manually

### Data Conflicts
- The seeder clears existing data before inserting new data
- If you want to preserve existing data, modify the `clearDatabase()` method

## Development Notes

- The seeder uses TypeORM repositories for data creation
- All passwords are properly hashed using bcrypt
- Timestamps are relative to current time for realistic testing
- Foreign key relationships are properly maintained
- Data is created in the correct order to satisfy dependencies
