# Exercise Catalog 🏋️

A full-stack web application for browsing, favoriting, and tracking exercises. Users can log workouts, view exercise details, and fetch related YouTube videos using the YouTube Data API.

<img width="1438" alt="image" src="https://github.com/user-attachments/assets/d9d55579-b145-46ff-9f6b-2630679d28f6" />


## 🌐 Live Site
**Frontend:** [exercise-catalog.vercel.app](https://exercise-catalog.vercel.app)  
**Backend:** [exercise-catalog.onrender.com](https://exercise-catalog.onrender.com)

---

## ⚙️ Technologies Used

### Frontend
- **React** with **Vite** for fast development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for page navigation
- **React Icons** and **Headless UI** for interactive components
- **Recharts** for data visualization
- **Axios** for API requests

### Backend
- **Flask** (Python) REST API
- **Flask-CORS** for handling cross-origin requests
- **Flask-Login** for user authentication
- **Flask-SQLAlchemy** as ORM with SQLite
- **YouTube Data API** for related exercise videos
- **dotenv** for managing API keys and environment configs

### Database
- **SQLite** for development and prototyping
- Designed to support migration to PostgreSQL or other SQL backends

---

## 💡 Features

- 🔍 Browse 1000+ exercises across various muscle groups
- ❤️ Favorite exercises and view them in a dedicated page
- 📈 Track workouts and visualize weekly history
- 📺 Auto-fetch YouTube videos based on exercise name
- 🎨 Clean UI with mobile responsiveness and animations

---

## 🚀 Future Improvements

- Add persistent user accounts via Supabase or Firebase Auth
- Improve search ranking with semantic matching
- Workout plan builder
- AI-based recommendations

---

## 🛠️ Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
flask run
```

Ensure you have a `.env` file in the backend folder with:
```
YOUTUBE_API_KEY=your_key_here
```

---

## 👨‍💻 Created by Austin Tran
[https://austintran.me](https://austintran.me)
