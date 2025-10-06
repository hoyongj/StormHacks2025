# 🗺️ Pathfinder Travel Advisor

**Pathfinder** is a collaborative travel planning platform built for **StormHacks 2025**, designed to turn your trip ideas into structured day plans with AI-guided suggestions, visual routes, and integrated map previews.

Travelers describe the vibe of their day, receive curated stop recommendations powered by **Google Maps** and **Gemini**, and visualize their route instantly — all in one intuitive interface.

---

## 🌐 Live Demo (Frontend Only)

You can explore the **Pathfinder Travel Advisor** web interface without setting up any backend services or API keys:

👉 **[Try the demo here](http://hoyongj.github.io/StormHacks2025)**

## 🚀 Demo Preview

### 🏠 Planner Dashboard
Browse all your saved itineraries and create new ones.

![Planner Dashboard](src/1B85E571-3581-4DB7-B3B6-4711D7806731.png)

### 🗂️ Plan Library
Easily access, organize, and manage your day plans by folder.

![Plan Library](src/ABCAD2AB-7E52-47F5-BDBB-32F099A596DA.png)

### 🧭 Active Plan View
Each plan displays a Google Maps route connecting curated stops.
- View and reorder stops dynamically
- See detailed descriptions and estimated travel times

![Active Plan](src/F9737645-BD80-40E2-A0D9-FA076F2ABC6C.png)
![Today's Stops](src/9EA51966-BE47-4FD8-B504-D32FA592FB5C.png)

### 💬 AI Travel Coach
A built-in assistant helps modify your itinerary in natural language:
- Add, remove, rename, or move stops
- Request new destinations or BC-specific route ideas

![Travel Coach](src/6E0E1E27-4194-43B1-A483-D86889764DDA.png)

### 🧩 Stop Editor
Quickly view or add new stops, check details, and save changes.

![Upcoming Stops](src/8B86C042-0FFE-4BE5-A3D1-02AD661DBAE8.png)

---

## ✨ Features

- 🌐 **Interactive Map** — See your route live with Google Maps integration  
- 🧠 **AI Assistant** — Powered by Gemini for itinerary editing and suggestions  
- 📅 **Dynamic Stops** — Add, rename, reorder, or delete travel stops easily  
- 🧭 **Motivation Tags** — Personalize trips by mood (Food, Nature, Nightlife, etc.)  
- 🗃️ **Plan Library** — Manage multiple itineraries with folder organization  
- 🐳 **Dockerized Stack** — Simple setup using Docker Compose  
- ⚙️ **Mock Mode** — Fully interactive UI even without API keys  

---

## 🧱 Tech Stack

**Frontend**
- React + Vite  
- Google Maps Embed  

**Backend**
- Python (FastAPI)  
- Google Gemini API  
- Google Maps Directions API  

**Infrastructure**
- Docker Compose (React + Nginx + FastAPI)  
- Environment-based API configuration  

---

## ⚙️ Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/pathfinder.git
cd pathfinder
````

### 2️⃣ Configure Environment Variables

Copy and edit `.env`:

```bash
cp .env.example .env
```

Then add your real credentials:

```bash
GEMINI_API_KEY=your_gemini_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

> 💡 If you don't set keys, Pathfinder runs in **mock mode**, showing static routes and demo data.

### 3️⃣ Run with Docker

```bash
docker-compose up --build
```

Visit [http://localhost:5173](http://localhost:5173) once the build completes.

---

## 🧭 Usage Guide

1. **Create a New Plan**

   * Enter start and end locations
   * Select trip motivations (Food, Nature, Shopping, etc.)

2. **Customize Stops**

   * Add or remove points of interest
   * Drag to reorder stops on your itinerary

3. **Ask the AI Travel Coach**

   * Example prompts:

     * “Add a stop for Brackendale Eagle Provincial Park after the current one.”
     * “Rename stop 2 to Granville Island Market.”
     * “Move stop 4 to position 2.”

4. **View & Save Your Plan**

   * See your updated route instantly
   * Save for later access in the **Plan Library**

---

## 📸 Demo Flow Summary

| Step | Screenshot                                                       | Description                                   |
| ---- | ---------------------------------------------------------------- | --------------------------------------------- |
| 1    | ![Create Plan](src/5FAE7D98-874A-4724-9A68-D96AB1172B21.png)  | Start a new plan with location and motivation |
| 2    | ![Stops List](src/8B86C042-0FFE-4BE5-A3D1-02AD661DBAE8.png)   | View and manage stops                         |
| 3    | ![Map Overview](src/F9737645-BD80-40E2-A0D9-FA076F2ABC6C.png) | Route visualization on Google Maps            |
| 4    | ![AI Assistant](src/6E0E1E27-4194-43B1-A483-D86889764DDA.png) | AI assistant suggesting modifications         |
| 5    | ![Plan Library](src/ABCAD2AB-7E52-47F5-BDBB-32F099A596DA.png) | Access and manage saved plans                 |

---

## 🧑‍💻 Authors

Developed for **StormHacks 2025**
by **Team Pathfinder**
🌐 [GitHub Repo](https://github.com/hoyongj/StormHacks2025)

---

## 📄 License

This project is released under the **MIT License**.