# Drag-and-Drop To-Do App
This is a To-Do Application that allows users to create, manage, and drag and drop their tasks or notes between different lists (e.g. pending, in-progress, completed). The app is built with React and uses Vite for fast development and hot-reloading.

Features
 Create new tasks and notes

 Drag and drop tasks between different status columns

 Mark tasks as completed

 Responsive design for mobile and desktop

 Smooth user interface with animations

 User authentication with login and signup

 Local storage session handling

🛠 Technologies Used
React

Vite


 Getting Started
Follow these steps to run the project locally.

1. Clone the repository

git clone
cd 
2. Install dependencies
Make sure you have Node.js and npm installed.

Run:

``` bash
npm install
3. Start the development server
Since this project uses Vite, you need to run:

``` bash
npm run dev
You will see a local development server running at:
http://localhost:5173/

This will hot-reload any changes you make to the project files.

** Required NPM Packages
Make sure these core packages are installed (already handled if you run npm install):


npm install react react-dom react-router-dom axios react-beautiful-dnd
If you need to manually install any:


You must have Vite installed globally or use the npm run dev script directly.

All authentication tokens and user sessions are handled using localStorage.

Backend API endpoints should be updated in axios requests if you deploy to production.
replace all fetched api in the frontend with your local ip address

