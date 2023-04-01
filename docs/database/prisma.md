# Setup

## Prerequisites
  - an existing Node.js project with a package.json
  - Node.js installed on your machine
  - a database server running and a database with at least one table

## Setup
  - Add the Prisma CLI as a development dependency - ```npm install prisma --save-dev```
  - Invoke the Prisma CLI - ```npx prisma```
  - Create Prisma schema file template - ```npx prisma init```. <br/>This command does two things:
    - creates a new directory called prisma that contains a file called schema.prisma, which contains the Prisma schema with your database connection variable and schema models
    - creates the .env file in the root directory of the project, which is used for defining environment variables (such as your database connection)

## Connection
  - set the url field of the datasource block in your Prisma schema to your database connection URL e.g.<br/>

    ```
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }
    ```
  - 

# TODOs
  - [ ] Check referential actions
  - [ ] Research using indexes on fields