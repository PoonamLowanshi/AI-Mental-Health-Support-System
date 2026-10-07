from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash
import db
import requests
password_hash = PasswordHash.recommended()


app = FastAPI(
    title="AI Mental Health Support System API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    db.create_tables()


# ---------------- USER MODELS ----------------


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    password: str




class UserLogin(BaseModel):
    email: str
    password: str


class MoodCreate(BaseModel):
    user_id: int
    mood: str
    note: str = ""

class JournalCreate(BaseModel):
    user_id: int
    title: str = ""
    text: str  

class ReminderCreate(BaseModel):
    user_id: int
    title: str
    reminder_time: str      

class ChatMessage(BaseModel):
    user_id: int
    message: str


def get_ai_response(message: str):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "qwen2.5:1.5b",
                "prompt": f"""
/no_think

You are MindCare, a supportive mental wellness AI companion.

Rules:
- Be warm and empathetic.
- Give short, simple and conversational replies.
- Do not diagnose.
- Do not claim to be a doctor or therapist.
- Encourage healthy coping and self-care.
- If the user mentions immediate self-harm or danger, encourage them to contact emergency services or a trusted person immediately.

User:
{message}
""",
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 120
                }
            },
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        return data.get(
            "response",
            "I'm here to listen. 💙"
        )

    except Exception as error:
        print("Ollama Error:", error)

        return (
            "I'm having trouble connecting to my local AI right now. "
            "Please try again in a moment. 💙"
        )
# ---------------- HOME API ----------------

@app.get("/")
def home():
    return {
        "message": "AI Mental Health Support System Backend is Running!"
    }


# ---------------- REGISTER API ----------------

@app.post("/register")
def register_user(user: UserRegister):
    connection = db.get_connection()
    cursor = connection.cursor()

    try:
        # Password validation
        if len(user.password) < 8:
            return {
                "error": "Password must be at least 8 characters long"
            }

        # Hash password before storing
        hashed_password = password_hash.hash(user.password)

        cursor.execute(
            """
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
            """,
            (user.name, user.email, hashed_password)
        )

        connection.commit()

        return {
            "message": "User registered successfully!"
        }

    except Exception as error:
        # Duplicate email handling
        if "UNIQUE constraint failed" in str(error):
            return {
                "error": "Email is already registered"
            }

        return {
            "error": "Registration failed. Please try again."
        }

    finally:
        connection.close()

# ---------------- LOGIN API ----------------
@app.post("/login")
def login_user(user: UserLogin):
    connection = db.get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT * FROM users
        WHERE email = ?
        """,
        (user.email,)
    )

    existing_user = cursor.fetchone()

    if not existing_user:
        connection.close()
        return {
            "error": "Invalid email or password"
        }

    stored_password = existing_user["password"]
    password_valid = False

    try:
        # New Argon2 hashed password
        if stored_password.startswith("$argon2"):
            password_valid = password_hash.verify(
                user.password,
                stored_password
            )

        # Old plain-text password
        else:
            password_valid = user.password == stored_password

            # Successful old login → upgrade to secure hash
            if password_valid:
                new_hash = password_hash.hash(user.password)

                cursor.execute(
                    """
                    UPDATE users
                    SET password = ?
                    WHERE id = ?
                    """,
                    (new_hash, existing_user["id"])
                )

                connection.commit()

    except Exception:
        password_valid = False

    connection.close()

    if password_valid:
        return {
            "message": "Login successful!",
            "user": {
                "id": existing_user["id"],
                "name": existing_user["name"],
                "email": existing_user["email"]
            }
        }

    return {
        "error": "Invalid email or password"
    }
# ---------------- SAVE MOOD API ----------------

@app.post("/mood")
def save_mood(data: MoodCreate):

    connection = db.get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO moods (user_id, mood, note)
            VALUES (?, ?, ?)
            """,
            (data.user_id, data.mood, data.note)
        )

        connection.commit()

        return {
            "message": "Mood saved successfully!"
        }

    except Exception as error:
        return {
            "error": str(error)
        }

    finally:
        connection.close()


# ---------------- MOOD HISTORY API ----------------

@app.get("/moods/{user_id}")
def get_mood_history(user_id: int):

    connection = db.get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, mood, note, created_at
        FROM moods
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    moods = cursor.fetchall()
    connection.close()

    return {
        "moods": [
            {
                "id": mood["id"],
                "mood": mood["mood"],
                "note": mood["note"],
                "created_at": mood["created_at"]
            }
            for mood in moods
        ]
    }


# ---------------- DELETE MOOD API ----------------

@app.delete("/mood/{mood_id}")
def delete_mood(mood_id: int):

    connection = db.get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            DELETE FROM moods
            WHERE id = ?
            """,
            (mood_id,)
        )

        connection.commit()

        if cursor.rowcount == 0:
            return {
                "error": "Mood entry not found"
            }

        return {
            "message": "Mood deleted successfully!"
        }

    except Exception as error:

        return {
            "error": str(error)
        }

    finally:

        connection.close()

       
    ...
# ---------------- MOOD ANALYTICS API ----------------

@app.get("/mood-stats/{user_id}")
def get_mood_stats(user_id: int):

    connection = db.get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT mood, COUNT(*) as count
        FROM moods
        WHERE user_id = ?
        GROUP BY mood
        """,
        (user_id,)
    )

    results = cursor.fetchall()

    connection.close()

    return {
        "stats": [
            {
                "mood": row["mood"],
                "count": row["count"]
            }
            for row in results
        ]
    }


@app.get("/weekly-report/{user_id}")
def get_weekly_report(user_id: int):
    connection = db.get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT mood, COUNT(*) as count
        FROM moods
        WHERE user_id = ?
        AND datetime(created_at) >= datetime('now', '-7 days')
        GROUP BY mood
        """,
        (user_id,)
    )

    results = cursor.fetchall()
    connection.close()

    total_checkins = sum(row["count"] for row in results)

    mood_counts = {
        "Happy": 0,
        "Good": 0,
        "Normal": 0,
        "Sad": 0,
        "Anxious": 0
    }

    for row in results:
        mood_counts[row["mood"]] = row["count"]

    most_common_mood = "No Data"

    if total_checkins > 0:
        most_common_mood = max(
            mood_counts,
            key=mood_counts.get
        )

    return {
        "total_checkins": total_checkins,
        "mood_counts": mood_counts,
        "most_common_mood": most_common_mood
    }

@app.post("/journal")
def save_journal(data: JournalCreate):
    
    connection = db.get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO journal_entries (user_id, title, text)
            VALUES (?, ?, ?)
            """,
            (data.user_id, data.title, data.text)
        )

        connection.commit()

        return {"message": "Journal entry saved successfully!"}

    except Exception as error:
        return {"error": str(error)}

    finally:
        connection.close()

        
@app.post("/reminder")
def save_reminder(data: ReminderCreate):
    connection = db.get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO reminders (user_id, title, reminder_time)
            VALUES (?, ?, ?)
            """,
            (
                data.user_id,
                data.title,
                data.reminder_time
            )
        )

        connection.commit()

        return {"message": "Reminder saved successfully!"}

    except Exception as error:
        return {"error": str(error)}

    finally:
        connection.close()


@app.get("/reminders/{user_id}")
def get_reminders(user_id: int):
    connection = db.get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, title, reminder_time, created_at
        FROM reminders
        WHERE user_id = ?
        ORDER BY reminder_time ASC
        """,
        (user_id,)
    )

    reminders = cursor.fetchall()
    connection.close()

    return {
        "reminders": [
            {
                "id": reminder["id"],
                "title": reminder["title"],
                "reminder_time": reminder["reminder_time"],
                "created_at": reminder["created_at"]
            }
            for reminder in reminders
        ]
    }

@app.delete("/reminder/{reminder_id}")
def delete_reminder(reminder_id: int):
    connection = db.get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "DELETE FROM reminders WHERE id = ?",
            (reminder_id,)
        )

        connection.commit()

        return {"message": "Reminder deleted successfully!"}

    except Exception as error:
        return {"error": str(error)}

    finally:
        connection.close()        

@app.get("/journals/{user_id}")
def get_journals(user_id: int):
    connection = db.get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, title, text, created_at
        FROM journal_entries
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    entries = cursor.fetchall()
    connection.close()

    return {
        "entries": [
            {
                "id": entry["id"],
                "title": entry["title"],
                "text": entry["text"],
                "created_at": entry["created_at"]
            }
            for entry in entries
        ]
    }

@app.delete("/journal/{journal_id}")
def delete_journal(journal_id: int):
    connection = db.get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "DELETE FROM journal_entries WHERE id = ?",
            (journal_id,)
        )

        connection.commit()

        return {"message": "Journal entry deleted successfully!"}

    except Exception as error:
        return {"error": str(error)}

    finally:
        connection.close()
# ---------------- CHAT API ----------------

# ---------------- CHAT API ----------------

@app.post("/chat")
def chat(data: ChatMessage):

    connection = db.get_connection()
    cursor = connection.cursor()

    # Save user message
    cursor.execute(
        """
        INSERT INTO chat_messages (user_id, sender, message)
        VALUES (?, ?, ?)
        """,
        (data.user_id, "user", data.message)
    )

    # Get improved chatbot response
    response = get_ai_response(data.message)

    # Save bot response
    cursor.execute(
        """
        INSERT INTO chat_messages (user_id, sender, message)
        VALUES (?, ?, ?)
        """,
        (data.user_id, "bot", response)
    )

    connection.commit()
    connection.close()

    return {
        "response": response
    }
# ---------------- CHAT HISTORY API ----------------

@app.get("/chat-history/{user_id}")
def get_chat_history(user_id: int):

    connection = db.get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, sender, message, created_at
        FROM chat_messages
        WHERE user_id = ?
        ORDER BY created_at ASC
        """,
        (user_id,)
    )

    messages = cursor.fetchall()

    connection.close()

    return {
        "messages": [
            {
                "id": message["id"],
                "sender": message["sender"],
                "text": message["message"],
                "created_at": message["created_at"]
            }
            for message in messages
        ]
    }