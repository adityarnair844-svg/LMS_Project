🧠 Project Setup Guide (For Team Members)

This guide will help you set up the Employee Leave Management System project on your laptop — even if you have never used GitHub, VS Code, or MySQL Workbench before.

Follow the steps in order, don’t skip any.

🧩 1. Install Required Software
1️⃣ Install MySQL & MySQL Workbench

Go to: https://dev.mysql.com/downloads/

Download MySQL Installer for Windows.

During installation, select:

MySQL Server

MySQL Workbench

Set a root password (remember it — you’ll need it later).

Complete the installation.

👉 After installation, open MySQL Workbench from the Start menu.

2️⃣ Install Node.js

Go to https://nodejs.org/

Download and install the LTS version.

To verify installation, open Command Prompt and type:

node -v
npm -v


You should see version numbers.

3️⃣ Install Visual Studio Code

Go to https://code.visualstudio.com/

Download and install VS Code.

Once installed, open it.

🧩 2. Create a GitHub Account

Go to https://github.com

Create a free account using your email.

Once logged in, send your GitHub username to Aditya (the repository owner).

⚠️ Since the repository is private, Aditya must add you as a collaborator.

You’ll receive an email invitation → click “Accept Invitation.”

🧩 3. Clone the Project from GitHub

After accepting the invite:

Go to the project repository page.

Click the green “Code” button.

Copy the HTTPS link (something like https://github.com/Aditya/employee-leave-management.git).

Open VS Code.

Open a new terminal (Ctrl + ~).

Type:

git clone <paste-the-link-here>


Example:

git clone https://github.com/Aditya/employee-leave-management.git


After cloning, open the folder:

cd employee-leave-management

🧩 4. Install Project Dependencies

There are two main folders:

client → frontend (React)

api → backend (Node.js + MySQL)

You must install packages in both.

4️⃣.1 Backend setup

In VS Code terminal:

cd api
npm install


This installs packages like:

express

mysql

bcrypt

cors

and others.

4️⃣.2 Frontend setup

After backend install finishes:

cd ../client
npm install


This installs:

react-icons

react-calendar

axios

and all other required packages.

🧩 5. Setup MySQL Database
5️⃣.1 Open MySQL Workbench

Launch MySQL Workbench.

Click your local instance (the one created during installation).

Enter your root password when prompted.

5️⃣.2 Create a Schema

In the left sidebar, right-click Schemas → Create Schema.

Name it exactly as written in the project’s db.js file inside the api folder.

Open api/db.js in VS Code.

You’ll see something like:

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "employee_leave_system"
});


Note the schema name (for example: employee_leave_system).

Enter that name in MySQL Workbench → click Apply → Apply → Finish.

5️⃣.3 Import the .sql file

In Workbench, go to:
Server → Data Import

Choose Import from Self-Contained File

Browse and select:
database/employee_leave_system_dump.sql

Under Default Target Schema, select the schema you created.

Click Start Import.

✅ You should now see all tables and data under your schema in the left sidebar.

🧩 6. Update Database Credentials

In api/db.js, make sure this matches your local setup:

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // your MySQL username
  password: "yourpassword", // your MySQL password
  database: "employee_leave_system" // your schema name
});

🧩 7. Run the Project
7️⃣.1 Run the Backend

In VS Code terminal:

cd api
npm start


or if configured differently:

node index.js


You should see:

Server running on port 8800
Connected to MySQL

7️⃣.2 Run the Frontend

Open a new terminal in VS Code:

cd client
npm run dev


Wait a few seconds — it will show a URL like:

Local: http://localhost:5173/


Click the link or open it in your browser.

✅ The project should now run successfully.

🧩 8. Common Problems & Fixes
Problem	Solution

MySQL connection error:	Check password and schema name in db.js

“Port already in use”: Close other terminals using same port

Frontend not opening: Make sure backend is running first

npm install fails:	Run npm cache clean --force then retry

bcrypt or node-gyp errors:	Run npm install --force inside api folder

MySQL import error:	Ensure you selected the correct schema during import

🧩 9. (Optional) Updating from GitHub

If Aditya updates the project later:

git pull


in your project folder to get the latest version.

✅ Summary of Order

Install MySQL + Workbench

Install Node.js

Install VS Code

Create GitHub account & get access

Clone the repo

Install dependencies (backend → frontend)

Create schema in Workbench

Import .sql file

Update db.js

Run backend (npm start)

Run frontend (npm run dev)

Done 🎉
