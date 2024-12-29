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

1. Ensure PostgreSQL is installed and running on your machine.
2. If `psql` commands are global, run the following command from the migration folder to set up the database:
   psql -U postgres -h localhost -p 5432 -d <database_target> -f "<path_of_backup.sql>"
3. If `psql` is not recognized, navigate to the PostgreSQL bin directory:
   cd C:\Program Files\PostgreSQL\17\bin

Then, open the command prompt and execute the `psql` command from there.

## Installation

1. Clone the repository to your local machine:
git clone <repo_url>
   cd <your_project_folder>
2. Install dependencies for the project by running:
   npm run i-dep
This will install dependencies for both the Backend and Frontend folders.

## Running the Application

Once the dependencies are installed, you can run the project:

1. Start the Backend and Frontend by running:
   npm run start
2. Open your browser and go to:
   http://localhost:5173
You should now be able to use the POS system!









