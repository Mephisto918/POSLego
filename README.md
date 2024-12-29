# LEGO POS System

This is a Point-of-Sale (POS) system for LEGO toys, including bricks and sets, built with **Vue.js**, **Node.js**, **Express**, and **PostgreSQL**. It supports basic CRUD operations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [PostgreSQL Database Setup](#postgresql-database-setup)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## Prerequisites

Before running this application, you need to have the following installed:

- **Node.js** (version 14 or above)
- **PostgreSQL** (version 13 or above)

## PostgreSQL Database Setup

1. **Ensure PostgreSQL is installed and running** on your machine. You can download it from the [official PostgreSQL website](https://www.postgresql.org/download/).**
   
2. **Create the `POSLEGO` database** before importing the backup.**
   - You can create the database by running the following command in the PostgreSQL shell:
   ```bash
   CREATE DATABASE POSLEGO;
   ```
   
3. **Import the database backup**:
   - If psql commands are globally available on your machine, navigate to the migration folder (or wherever your backup SQL file is stored) and run:
   ```cmd
   psql -U postgres -h localhost -p 5432 -d POSLEGO -f "<path_of_backup.sql>"
   ```
      - Replace `<path_of_backup.sql>` with the actual path to your backup SQL file.
         - Ex.`db-setup/backup.sql`
   - If `psql` is not recognized, navigate to the PostgreSQL bin directory:
   ```cmd
   C:\Program Files\PostgreSQL\17\bin
   ```
   - Then, open the command prompt and execute the `psql` command from there.
        - Ex. `C:\Program Files\PostgreSQL\17\bin\psql -U postgres -h localhost -p 5432 -d POSLEGO -f "<path_of_backup.sql>"`
   

## Installation

1. Clone the repository to your local machine:
git clone [https://github.com/Mephisto918/POSLego.git]
   ```cmd
   cd POSLego
   ```
2. Install dependencies for the project by running:
   ```cmd
   npm run i-dep
   ```
This will install dependencies for both the Backend and Frontend folders.

## Running the Application

Once the dependencies are installed, you can run the project:

1. Start the Backend and Frontend by running:
   ```cmd 
   npm run start
   ```
3. Open your browser and go to:
   ```cmd
   http://localhost:5173
   ```
You should now be able to use the POS system!









