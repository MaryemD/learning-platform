# Learning Platform


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
