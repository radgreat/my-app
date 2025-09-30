# 📝 Task Manager App

![Node.js](https://img.shields.io/badge/Node.js-v18-blue)
![Express](https://img.shields.io/badge/Express-4.x-yellow)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-blue)

A **full-featured task manager application** built with **Node.js, Express, and MongoDB Atlas**, with **authentication, role-based access control, email verification, and OAuth login**.  
Perfect for showcasing backend development skills and real-world project experience.

---

## 🎯 Live Demo
Check it out here: 🌐 [Live App on Render](https://radtask.onrender.com)  
GitHub Repository: [View Source Code](https://github.com/radgreat/my-app)

---

## 🎥 Demo Preview
Here’s a quick preview of the app in action:

![Demo GIF](link-to-your-demo-gif.gif)  
*(Example: User login, task creation, admin panel actions)*

---

## 🚀 Features

✅ User registration & login (email + password)  
✅ Google & Facebook OAuth login  
✅ JWT-based email confirmation & forgot password flows  
✅ Session-based authentication with flash messaging  
✅ Admin panel to manage users (promote/demote/delete)  
✅ Full CRUD for tasks (create, edit, delete, paginate)  
✅ Theme toggle (light/dark mode)  
✅ Rate limiting (prevent brute-force)  
✅ Role-based route protection (middleware)  
✅ Pagination for long task lists  
✅ Clean folder structure and modular design  

---

## 📸 Screenshots

| Login Screen | Dashboard | Admin Panel |
|--------------|-----------|-------------|
| ![Login](link-to-login-screenshot.png) | ![Dashboard](link-to-dashboard-screenshot.png) | ![Admin](link-to-admin-screenshot.png) |

---

## 📁 Folder Structure
```bash
myapp/
├── modules/
│   ├── login/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── tasks/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── admin/
│       └── ...
├── middleware/
├── public/
│   ├── css/
│   └── js/
├── scripts/
│   └── seedAdmin.js
├── views/
├── .env.example
├── package.json
└── app.js
```

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **Templating:** EJS, EJS-Mate, Express Layouts  
- **Auth:** Passport.js, JWT, bcrypt, Sessions  
- **Email:** Nodemailer  
- **OAuth:** Google, Facebook  
- **Validation:** express-validator  
- **Flash Messages:** connect-flash  
- **Rate Limiting:** express-rate-limit  
- **Frontend:** Vanilla JS + basic styling (dark mode support)

---

## 🏃 How to Run Locally

**Clone the repo:**
```bash
git clone https://github.com/radgreat/my-app.git
cd my-app
```

**Install dependencies:**
```bash
npm install
```
Seed an admin user (optional)
npm run seed:admin

**Create a `.env` file in root:**
```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

**Start the server:**
```bash
npm start
```

**Open in browser:**
```
http://localhost:3000
```

## Learning Goals

- This app was built to learn and showcase:

- Secure authentication flows

- Role-based access control

- OAuth integrations

- Full stack CRUD functionality

- Frontend/backend session control

- Middleware usage and modular architecture

- Email flows using nodemailer

- Security best practices (rate limiting, session expiry, etc.)


---

## 🌱 Future Improvements

- Add real-time updates with Socket.io.
- Create a frontend with React or Vue for better UX.
- Add unit/integration testing.
- Dockerize the app for easy deployment.

---

## 📬 Contact

Created by **rad(Muldong)**  
GitHub: [https://github.com/radgreat](https://github.com/radgreat)  
Email: radgreat@gmail.com  
LinkedIn: [LinkedIn](https://www.linkedin.com/in/rad-dgreat-92725029a/)

---

## 📜 License

This project is licensed under the MIT License.

