# Learning Platform

## Features

### Analytics

The platform includes a real-time analytics system using Server-Sent Events (SSE) that provides:

- **Real-time Session Events**: Track student activity with timestamps and session identifiers
- **Optional Session-specific Alerts**: Instructors can subscribe to specific alert types
- **Periodic Alert Processing**: Automatic monitoring of session metrics and conditions

#### Real-Time Session Events

The system tracks these key session events:

- **Student Joined**: When a student joins a learning session
- **Quiz Participation**: When a student participates in a quiz
- **New Question**: When a question is asked in a session
- **Question Result**: When a question is answered (success or failure)

#### Optional Periodic Alerts

Instructors can subscribe to these session-specific alerts and configure thresholds:

- **Question Failure Rate**: Alerts when questions have high failure rates
- **Student Inactivity**: Notifies when students are inactive for extended periods
- **Low Participation**: Alerts when overall session participation drops

#### Using Analytics

- **Subscribe to session events**: `GET /analytics/events?sessionId=YOUR_SESSION_ID`
- **Subscribe to session alerts**: `GET /analytics/alerts/stream?sessionId=YOUR_SESSION_ID`
- **Subscribe to an alert type**: `POST /analytics/alerts/subscribe` with payload:
  ```json
  {
    "sessionId": "session-id",
    "instructorId": "instructor-id",
    "alertType": "question_failure_rate",
    "threshold": 70
  }
  ```
- **Set alert threshold**: `POST /analytics/alerts/threshold` with payload:
  ```json
  {
    "sessionId": "session-id",
    "alertType": "question_failure_rate",
    "threshold": 70
  }
  ```
- **Unsubscribe from an alert**: `DELETE /analytics/alerts/unsubscribe/{sessionId}/{instructorId}/{alertType}`

#### Integration Points

The analytics system integrates with other modules through these key methods:

- **Session Lifecycle**: `initSession()` and `cleanupSession()`
- **Event Publishing**:
  - `notifyStudentJoined()`
  - `notifyQuizParticipation()`
  - `notifyNewQuestion()`
  - `trackQuestionResult()`
- **Alert Publishing**:
  - `emitOptionalAlert()`

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://www.mysql.com/) (or MariaDB)
- [npm](https://www.npmjs.com/)

### Install Project Dependencies

run the following commands in your terminal:
npm install
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt passport-jwt @nestjs/passport passport bcrypt
npm install @nestjs/graphql graphql @nestjs/apollo apollo-server-express
npm install class-validator class-transformer
npm install @nestjs/websockets @nestjs/platform-socket.io
npm install mysql
npm install @nestjs/config
npm install @nestjs/config dotenv

### Environment Setup

Create a .env file in the root of the project with the following content:

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=learning-platform-db

Replace your_password with your actual MySQL password.

### Database Setup

1. Make sure your MySQL server is running.
2. Create a local database with the name learning-platform-db, as specified in the .env file content.
