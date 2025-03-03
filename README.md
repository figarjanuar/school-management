# Project Setup Guide

## Prerequisites

- Node.js (Recommended: latest LTS version)
- npm or yarn
- MySQL (Ensure it is installed and running)

## Database Setup

1. **Create the database**
   ```sql
   CREATE DATABASE school_management;
   ```

2. **Create necessary tables** (If using TypeORM sync, this step may not be required):
   ```sql
   CREATE TABLE teacher (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL
   );

   CREATE TABLE student (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       is_suspended BOOLEAN DEFAULT FALSE
   );

   CREATE TABLE teacher_student (
       id INT AUTO_INCREMENT PRIMARY KEY,
       teacher_id INT,
       student_id INT,
       FOREIGN KEY (teacher_id) REFERENCES teacher(id) ON DELETE CASCADE,
       FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
   );
   ```

## Project Installation

1. **Install dependencies**
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```

## Configuration

Since there is no `.env` file, configure the database connection in the respective module file inside the NestJS application.

Example (inside `app.module.ts`):
```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'your_username',
  password: 'your_password',
  database: 'school_management',
  autoLoadEntities: true,
  synchronize: true,
});
```

## Running the Application

Start the NestJS application:
```sh
npm run start:dev
```
or
```sh
yarn start:dev
```

The API should now be running at `http://localhost:3000`.

## Running Tests

To execute unit tests:
```sh
npm run test
```
or
```sh
yarn test
```

## API Documentation

Swagger documentation is available at:
```
http://localhost:3000/api
```
Ensure the server is running before accessing it.

## Additional Notes
- Ensure MySQL is running before starting the application.
- The `synchronize: true` option in TypeORM will auto-create tables based on entity definitions.

