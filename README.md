# Learning Platform

## Analytics Features

### Real-Time Event Streaming

- **SSE Endpoint**: `GET /analytics/events?sessionId={sessionId}`
- **Tracked Events**:
  - `student_joined`: Student enters session
  - `quiz_participation`: Student attempts quiz
  - `new_question`: New question asked
  - `question_result`: Question answered (success/failure)

### Alert System (Periodic Checks)

- **SSE Endpoint**: `GET /analytics/alerts/stream?sessionId={sessionId}`
- **Alert Types** (require configuration):
  | Type | Description | Example Threshold |
  |------|-------------|-------------------|
  | `question_failure_rate` | Triggers when question failures exceed configured % | 60% |
  | `student_inactivity` | Triggers when students are inactive beyond configured minutes | 30 min |
  | `low_participation` | Triggers when participation falls below configured % | 40% |

- **Key Characteristics**:
  - ✋ **No default thresholds** - Must be configured to receive alerts
  - ⏱️ **Periodic checks** - Conditions verified every 15 minutes
  - ⚙️ **Fully configurable** - Each alert type requires explicit setup

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
