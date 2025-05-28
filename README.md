# NutriWise: Personalized Meal Plan Generator

NutriWise is a full-stack web application that generates personalized 7-day meal plans based on the user’s profile, health goals, and optionally uploaded medical reports. The system leverages local AI models, vector databases, and a clean web interface to deliver nutrition advice tailored to individual needs.

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** – REST API framework
- **LangChain + LM Studio** – Local LLM integration (phi-4 model)
- **ChromaDB** – Vector database for recipe embeddings
- **SQLite** – Lightweight relational database
- **Python** – Core language

### Frontend
- **React (TypeScript)** – UI framework
- **Material UI (MUI)** – UI components and layout
- **Firebase Auth** – Authentication (email/password + Google)

---

## 👤 User Flow

1. User logs in or registers (via Firebase)
2. Fills out profile details (age, height, weight, dietary needs, goals)
3. Optionally uploads a medical report (PDF, TXT, PNG)
4. Generates a customized 7-day meal plan
5. Views or exports the meal plan

---

## 🔐 Authentication

- Firebase Auth handles login/registration
- Frontend sends the `user_id` (UID) to backend endpoints
- Backend trusts the UID and does not validate JWT tokens (assumes frontend handles authentication)

---

## 📡 Backend API Endpoints

Base URL: `http://localhost:8001`

### 👥 User API
- `POST /api/users/create_user?user_id={uid}` – Create new user
- `GET /api/users/get_user?user_id={uid}` – Fetch user profile
- `PATCH /api/users/update_profile_data?...` – Update profile fields
- `PATCH /api/users/update_medical_conditions?...` – Add or update medical conditions

### 📂 Medical File API
- `POST /api/files/process_file?user_id={uid}` – Upload medical report (PDF/TXT/PNG)
- `GET /api/files/get_user_files?user_id={uid}` – Get summarized health report

> ⚠️ **Toxicity protection:** If the uploaded file is not medical in nature or contains offensive content, the LLM responds only with `"no medical history"`. Additionally, we use a **low temperature (0.1)** in the prompt to ensure consistent, non-hallucinated summaries.

### 🍽️ Meal Plan API
- `POST /api/meal_plans/create_meal_plan?user_id={uid}` – Generate a 7-day personalized meal plan using LLM
- `GET /api/meal_plans/get_user_meal_plan?user_id={uid}` – Fetch the latest meal plan for the user

---

## 🧠 AI & Prompt Design

- **Model used**: `phi-4`, served locally via LM Studio (`http://localhost:1234/v1`)
- **Prompt structure**: Includes weight, height, age, gender, BMI, fitness goal, activity level, dietary preferences, medical conditions, and optional health report
- **Output format**: Valid JSON with fields:
  - `name`
  - `description`
  - `plan` (list of 7 days, each with breakfast, lunch, dinner, snack, macros)

Example:
```json
{
  "name": "Weight Loss Vegan Plan",
  "description": "Low-calorie, vegan-friendly weekly plan",
  "plan": [
    {
      "meal_slot": "Monday",
      "breakfast": "Oatmeal with almond milk",
      "lunch": "Quinoa salad",
      "dinner": "Tofu stir fry",
      "snack": "Fruit smoothie",
      "macros": "Protein: 70g, Carbs: 200g, Fats: 50g, Calories: 1800"
    }
  ]
}
```

> We also implemented `strip_json_prefix` and `strip_json_suffix` utilities to sanitize LLM output and guarantee valid JSON for parsing.

---

## 🔁 RAG (Retrieval-Augmented Generation)

The backend supports optional RAG-based generation using embedded recipes stored in ChromaDB.

- **Recipe dataset**: CSV loaded and vectorized using a local embedding model
- **Retrieval**: Top-k relevant documents retrieved using LangChain's `RetrievalQA`

```python
qa_chain = get_qa_chain(llm, recipes_db)
response = qa_chain({"query": rag_query})
```

> ⚠️ **Limitations**: Due to technical constraints, we could not use the full dataset and instead relied on a subset of ~20,000 recipes.  
**The quality of the generated plans with RAG was lower than when using direct LLM prompting**, so the final version defaults to prompt-only generation.

---

## 🖼️ Frontend Structure (React + Firebase)

### Pages
- `/` – Welcome Page
- `/login`, `/signup` – User auth (email/password + Google)
- `/dashboard` – Shows the latest weekly plan
- `/generate` – Button to generate a new plan
- `/upload` – Upload health reports (PDF, TXT, PNG)

### Core Components
- `TopNavBar` – Navigation and Logout
- `ProfileDialog` – Modal to edit profile data
- `DashboardHome` – Display 7-day meal plan
- `GeneratePlanPage` – Trigger plan creation via POST
- `UploadDocumentsPage` – Upload file, see status

---

## 🗃️ Data Models (Shared Format)

### User
```json
{
  "id": "string",
  "weight": 75,
  "height": 180,
  "age": 25,
  "sex": "male",
  "fitness_goal": "gain muscle",
  "bmi": 23.15,
  "dietary_preferences": "vegetarian",
  "activity_level": "moderate",
  "medical_conditions": "none"
}
```

### MealPlan
```json
{
  "id": 1,
  "name": "Vegan Plan",
  "description": "Balanced vegan plan",
  "date_created": "2024-05-01",
  "user_id": "abc123"
}
```

### MealPlanItem
```json
{
  "id": 12,
  "meal_slot": "Tuesday",
  "breakfast": "Avocado toast",
  "lunch": "Lentil soup",
  "dinner": "Grilled tempeh",
  "snack": "Apple slices",
  "macros": "P:60g, C:220g, F:55g, Cal:1900",
  "meal_plan_id": 1
}
```

### HealthReport
```json
{
  "id": 7,
  "user_id": "abc123",
  "report_text": "The report indicates borderline cholesterol and mild anemia..."
}
```

---

## ⚙️ Local Setup Instructions

### Backend (FastAPI + LLM)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

> ⚠️ Start LM Studio at `http://localhost:1234/v1` with the phi-4 model loaded.

### Frontend (React + Firebase)
```bash
cd frontend
npm install
npm run dev
```

---


## 👨‍💻 Authors

- **R**azvan Bocra
- **M**ario Colhon
- **A**lex Crisan


---

**NutriWise – Eat smart. Live better. Powered by local AI.**

---
