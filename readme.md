# 📝 Task Manager App

![Node.js](https://img.shields.io/badge/Node.js-v18-blue)
![Express](https://img.shields.io/badge/Express-4.x-yellow)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-blue)

A **full-featured task manager application** built with **Node.js, Express, and MongoDB Atlas**, with **authentication, role-based access control, email verification, and OAuth login**.  
Perfect for showcasing backend development skills and real-world project experience.

---

## 🎯 Live Demo
Check it out here: 🌐 [Live App on Render](radtask.onrender.com)  
GitHub Repository: [View Source Code](https://github.com/radgreat/my-app)

---

## 🎥 Demo Preview
Here’s a quick preview of the app in action:

![Demo GIF](link-to-your-demo-gif.gif)  
*(Example: User login, task creation, admin panel actions)*

---

## 🚀 Features

- 🔒 User authentication with email/password.
- 📧 Email verification and resend verification link.
- 🌐 Google & Facebook OAuth login.
- 🛡 JWT-based authentication.
- 👤 Role-based access control (User/Admin).
- 📝 CRUD operations for tasks.
- ⚙ Admin dashboard to manage users (promote/demote).
- ✅ Express-validator for robust input validation.
- 📬 Nodemailer for email notifications.

---

## 📸 Screenshots

| Login Screen | Dashboard | Admin Panel |
|--------------|-----------|-------------|
| ![Login](link-to-login-screenshot.png) | ![Dashboard](link-to-dashboard-screenshot.png) | ![Admin](link-to-admin-screenshot.png) |

---

## 📂 Folder Structure

task-manager-app/
├── config/
├── middlewares/
├── modules/
├── scripts/
├── views/
├── app.js
├── package.json
└── README.md

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT, OAuth (Google, Facebook)  
- **Validation:** express-validator  
- **Email Service:** Nodemailer  
- **Hosting:** Render  

---

## 🏃 How to Run Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/radgreat/my-app.git
   cd my-app


2. Install dependencies
    npm install


3. Create a .env file in root: 
    PORT=3000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    FACEBOOK_CLIENT_ID=your_facebook_client_id
    FACEBOOK_CLIENT_SECRET=your_facebook_client_secret


4.  Start the server:
    npm start


5. Open in browser:
    http://localhost:3000



🌱 Future Improvements

Add real-time updates with Socket.io.

Create a frontend with React or Vue for better UX.

Add unit/integration testing.

Dockerize the app for easy deployment.

📬 Contact

Created by Rad
GitHub: https://github.com/radgreat

Email: radgreat@gmail.com

LinkedIn: rad

📜 License

This project is licensed under the MIT License.    



