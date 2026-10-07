

import { useState, useEffect, useRef } from "react";
import "./App.css";


import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");

  const [journalTitle, setJournalTitle] = useState("");
const [journalText, setJournalText] = useState("");
const [journalEntries, setJournalEntries] = useState([]);

const [reminderTitle, setReminderTitle] = useState("");
const [reminderTime, setReminderTime] = useState("");
const [reminders, setReminders] = useState([]);

  const [moodHistory, setMoodHistory] = useState([]);
  const [moodStats, setMoodStats] = useState([]);

  const [weeklyReport, setWeeklyReport] = useState(null);
const [weeklyReportLoading, setWeeklyReportLoading] = useState(false);
const [weeklyReportError, setWeeklyReportError] = useState("");

  const [chatMessage, setChatMessage] = useState("");
const [chatHistory, setChatHistory] = useState([]);
const [chatLoading, setChatLoading] = useState(false);

const [activeSection, setActiveSection] = useState("dashboard");
const [gameCards, setGameCards] = useState([]);
const [flippedCards, setFlippedCards] = useState([]);
const [matchedCards, setMatchedCards] = useState([]);
const [gameMoves, setGameMoves] = useState(0);
const [gameStarted, setGameStarted] = useState(false);
const [numberPuzzle, setNumberPuzzle] = useState([]);
const [numberMoves, setNumberMoves] = useState(0);
const [numberGameStarted, setNumberGameStarted] = useState(false);

const [game2048, setGame2048] = useState([]);
const [score2048, setScore2048] = useState(0);
const [game2048Started, setGame2048Started] = useState(false);

const [focusTarget, setFocusTarget] = useState({
  top: 50,
  left: 50
});
const [focusScore, setFocusScore] = useState(0);
const [focusTime, setFocusTime] = useState(20);
const [focusGameStarted, setFocusGameStarted] = useState(false);

const audioContextRef = useRef(null);
const oscillatorRef = useRef(null);
const gainNodeRef = useRef(null);

const [musicPlaying, setMusicPlaying] = useState(false);
const [musicType, setMusicType] = useState("");


const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
  const savedPreference = localStorage.getItem("notificationsEnabled");

  return savedPreference !== null
    ? savedPreference === "true"
    : true;
});

const [darkMode, setDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem("darkMode");
  return savedTheme === "true";
});

const musicLibrary = {
  happy: [
    {
      title: "Happy Music",
      file: "/music/happy-1.mp3"
    },
    {
      title: "Positive Vibes",
      file: "/music/happy-2.mp3"
    },
    {
      title: "Feel Good",
      file: "/music/happy-3.mp3"
    }
  ],

  calm: [
    {
      title: "Peaceful Piano",
      file: "/music/calm-1.mp3"
    },
    {
      title: "Calm Meditation",
      file: "/music/calm-2.mp3"
    },
    {
      title: "Serenity",
      file: "/music/calm-3.mp3"
    }
  ],

  anxiety: [
    {
      title: "Deep Relaxation",
      file: "/music/anxiety-1.mp3"
    },
    {
      title: "Stress Relief",
      file: "/music/anxiety-2.mp3"
    },
    {
      title: "Peaceful Mind",
      file: "/music/anxiety-3.mp3"
    }
  ]
};

const audioRef = useRef(null);
const [currentSong, setCurrentSong] = useState(null);

const startRelaxingSound = (type, songIndex = 0) => {

  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  const song = musicLibrary[type]?.[songIndex];

  if (!song) return;

  const audio = new Audio(song.file);

  audio.loop = false;

  audio.onended = () => {
    setMusicPlaying(false);
    setMusicType("");
    setCurrentSong(null);
  };

  audio.play().catch((error) => {
    console.error("Music playback error:", error);
  });

  audioRef.current = audio;

  setMusicType(type);
  setMusicPlaying(true);
  setCurrentSong(song);
};

const stopRelaxingSound = () => {

  if (audioRef.current) {



    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  }

  setMusicPlaying(false);
  setMusicType("");
  setCurrentSong(null);
};


const [scrambledWord, setScrambledWord] = useState("");
const [scrambleAnswer, setScrambleAnswer] = useState("");
const [scrambleScore, setScrambleScore] = useState(0);
const [scrambleGameStarted, setScrambleGameStarted] = useState(false);

const [scrambleMessage, setScrambleMessage] = useState("");

const [breathingStarted, setBreathingStarted] = useState(false);
const [breathingPhase, setBreathingPhase] = useState("Ready");
const [breathingCount, setBreathingCount] = useState(0);

const [isListening, setIsListening] = useState(false);
const [voiceEnabled, setVoiceEnabled] = useState(true);
const [voiceStatus, setVoiceStatus] = useState("Ready to talk");

const [isSpeaking, setIsSpeaking] = useState(false);
const [voiceText, setVoiceText] = useState("");
const [voiceReply, setVoiceReply] = useState("");
const [isMuted, setIsMuted] = useState(false);




  const moods = [
    { emoji: "😄", name: "Happy" },
    { emoji: "🙂", name: "Good" },
    { emoji: "😐", name: "Normal" },
    { emoji: "😔", name: "Sad" },
    { emoji: "😰", name: "Anxious" }
  ];

  const allMoodStats = moods.map((moodItem) => {
  const existingMood = moodStats.find(
    (stat) => stat.mood === moodItem.name
  );

  return {
    mood: moodItem.name,
    emoji: moodItem.emoji,
    count: existingMood ? existingMood.count : 0
  };
});

  const moodColors = {
  Happy: "#FFD700",
  Good: "#4CAF50",
  Normal: "#2196F3",
  Sad: "#9C27B0",
  Anxious: "#F44336"
};

const startBreathing = () => {
  setBreathingStarted(true);
  setBreathingPhase("Breathe In");
  setBreathingCount(4);
};

useEffect(() => {
  if (!breathingStarted) return;

  const timer = setInterval(() => {
    setBreathingCount((prev) => {
      if (prev > 1) {
        return prev - 1;
      }

      setBreathingPhase((phase) => {
        if (phase === "Breathe In") return "Hold";
        if (phase === "Hold") return "Breathe Out";
        return "Breathe In";
      });

      return 4;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [breathingStarted]);

const calculateStreak = () => {
  if (!moodHistory || moodHistory.length === 0) {
    return 0;
  }

  const uniqueDates = [
    ...new Set(
      moodHistory.map((item) => {
        const date = new Date(item.created_at);
        return date.toISOString().split("T")[0];
      })
    )
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const moodDate = new Date(uniqueDates[i]);
    moodDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(currentDate);
    expectedDate.setDate(currentDate.getDate() - streak);

    if (moodDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

  const startNumberPuzzle = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, ""]
    .sort(() => Math.random() - 0.5);

  setNumberPuzzle(numbers);
  setNumberMoves(0);
  setNumberGameStarted(true);
};

const moveNumberTile = (index) => {
  const emptyIndex = numberPuzzle.indexOf("");

  const row = Math.floor(index / 3);
  const col = index % 3;

  const emptyRow = Math.floor(emptyIndex / 3);
  const emptyCol = emptyIndex % 3;

  const isAdjacent =
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1);

  if (!isAdjacent) return;

  const newPuzzle = [...numberPuzzle];

  [newPuzzle[index], newPuzzle[emptyIndex]] =
    [newPuzzle[emptyIndex], newPuzzle[index]];

  setNumberPuzzle(newPuzzle);
  setNumberMoves((moves) => moves + 1);
};
  

const startScrambleGame = () => {
  const words = [
    "HAPPY",
    "CALM",
    "SMILE",
    "PEACE",
    "RELAX",
    "FOCUS",
    "HOPE",
    "JOY"
  ];

  const randomWord =
    words[Math.floor(Math.random() * words.length)];

  let scrambled = randomWord
  .split("")
  .sort(() => Math.random() - 0.5)
  .join("");

while (scrambled === randomWord) {
  scrambled = randomWord
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

  setScrambledWord(scrambled);
  setScrambleAnswer("");
  
  setScrambleGameStarted(true);
};

const checkScrambleAnswer = () => {
  const correctWords = [
    "HAPPY",
    "CALM",
    "SMILE",
    "PEACE",
    "RELAX",
    "FOCUS",
    "HOPE",
    "JOY"
  ];

  const answer = scrambleAnswer.trim().toUpperCase();

  if (correctWords.includes(answer)) {
    setScrambleScore((score) => score + 1);
    setScrambleMessage("🎉 Correct! Great job!");
    setTimeout(() => {
      startScrambleGame();
      setScrambleMessage("");
    }, 800);
  } else {
    setScrambleMessage("❌ Not quite! Try again.");
  }
};

const start2048Game = () => {
  const newBoard = Array(16).fill(0);

  newBoard[Math.floor(Math.random() * 16)] = 2;

  let secondIndex = Math.floor(Math.random() * 16);

  while (newBoard[secondIndex] !== 0) {
    secondIndex = Math.floor(Math.random() * 16);
  }

  newBoard[secondIndex] = 2;

  setGame2048(newBoard);
  setScore2048(0);
  setGame2048Started(true);
};

const move2048 = (direction) => {
  let board = [...game2048];
  let moved = false;
  let gainedScore = 0;

  const moveRow = (row) => {
    let numbers = row.filter((num) => num !== 0);

    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === numbers[i + 1]) {
        numbers[i] *= 2;
        gainedScore += numbers[i];
        numbers[i + 1] = 0;
        i++;
      }
    }

    numbers = numbers.filter((num) => num !== 0);

    while (numbers.length < 4) {
      numbers.push(0);
    }

    return numbers;
  };

  if (direction === "left") {
    for (let row = 0; row < 4; row++) {
      const oldRow = board.slice(row * 4, row * 4 + 4);
      const newRow = moveRow(oldRow);

      if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) {
        moved = true;
      }

      board.splice(row * 4, 4, ...newRow);
    }
  }

  if (direction === "right") {
    for (let row = 0; row < 4; row++) {
      const oldRow = board.slice(row * 4, row * 4 + 4);
      const reversed = [...oldRow].reverse();
      const newRow = moveRow(reversed).reverse();

      if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) {
        moved = true;
      }

      board.splice(row * 4, 4, ...newRow);
    }
  }

  if (direction === "up" || direction === "down") {
    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        column.push(board[row * 4 + col]);
      }

      const oldColumn = [...column];

      if (direction === "down") {
        column.reverse();
      }

      column = moveRow(column);

      if (direction === "down") {
        column.reverse();
      }

      if (JSON.stringify(oldColumn) !== JSON.stringify(column)) {
        moved = true;
      }

      for (let row = 0; row < 4; row++) {
        board[row * 4 + col] = column[row];
      }
    }
  }

  if (!moved) return;

  const emptyCells = board
    .map((value, index) => (value === 0 ? index : null))
    .filter((index) => index !== null);

  if (emptyCells.length > 0) {
    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[randomIndex] = 2;
  }

  setGame2048(board);
  setScore2048((score) => score + gainedScore);
};

const startFocusGame = () => {
  setFocusScore(0);
  setFocusTime(20);

  setFocusTarget({
    top: Math.floor(Math.random() * 70) + 15,
    left: Math.floor(Math.random() * 70) + 15
  });

  setFocusGameStarted(true);
};

const hitFocusTarget = () => {
  setFocusScore((score) => score + 1);

  setFocusTarget({
    top: Math.floor(Math.random() * 70) + 15,
    left: Math.floor(Math.random() * 70) + 15
  });
};

useEffect(() => {
  if (!focusGameStarted || focusTime <= 0) return;

  const timer = setInterval(() => {
    setFocusTime((time) => time - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [focusGameStarted, focusTime]);

const saveJournalEntry = async () => {
  if (!journalText.trim()) {
    alert("Please write something in your journal. ✍️");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        title: journalTitle.trim() || "My Journal Entry",
        text: journalText.trim()
      })
    });

    const result = await response.json();

    if (result.message) {
      setJournalTitle("");
      setJournalText("");
      getJournalEntries();
      alert("Journal entry saved successfully! 💜");
    } else {
      alert(result.error || "Failed to save journal entry.");
    }
  } catch (error) {
    console.error("Journal save error:", error);
    alert("Backend connection failed ❌");
  }
};

const deleteJournalEntry = async (journalId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this journal entry?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/journal/${journalId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (result.message) {
      getJournalEntries();
    } else {
      alert(result.error || "Failed to delete journal entry.");
    }
  } catch (error) {
    console.error("Journal delete error:", error);
    alert("Backend connection failed ❌");
  }
};

const getReminders = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/reminders/${user.id}`
    );

    const result = await response.json();

    setReminders(result.reminders || []);
  } catch (error) {
    console.error("Error loading reminders:", error);
  }
};

useEffect(() => {
  if (!loggedIn || !user || reminders.length === 0) {
    return;
  }

  const notifiedReminders = new Set();

  const checkReminders = () => {
    const now = new Date();

    const currentTime =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    const today = now.toISOString().split("T")[0];

    reminders.forEach((reminder) => {
      const notificationKey =
        `${reminder.id}-${today}-${reminder.reminder_time}`;

      if (
        reminder.reminder_time === currentTime &&
        !notifiedReminders.has(notificationKey)
      ) {
        

        if (
  notificationsEnabled &&
  "Notification" in window &&
  Notification.permission === "granted"
) {
          new Notification("MindCare Reminder 🔔", {
            body: reminder.title,
            icon: "/favicon.ico"
          });
        }

        notifiedReminders.add(notificationKey);
      }
    });
  };

  checkReminders();

  const interval = setInterval(checkReminders, 30000);

  return () => clearInterval(interval);
}, [reminders, loggedIn, user]);


const saveReminder = async () => {
  if (!reminderTitle.trim() || !reminderTime) {
    alert("Please enter reminder title and time. 🔔");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/reminder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: user.id,
          title: reminderTitle.trim(),
          reminder_time: reminderTime
        })
      }
    );

    
    const result = await response.json();

    if (result.message) {
      setReminderTitle("");
      setReminderTime("");
      getReminders();

      alert("Reminder saved successfully! 🔔");
    } else {
      alert(result.error || "Failed to save reminder.");
    }
  } catch (error) {
    console.error("Reminder save error:", error);
    alert("Backend connection failed ❌");
  }
};

const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications.");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    alert("Notifications enabled! 🔔");

    // Check reminders immediately
    checkReminderNotifications();
  } else {
    alert("Notification permission was not granted.");
  }
};

const checkReminderNotifications = () => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const now = new Date();

  reminders.forEach((reminder) => {
    const reminderDate = new Date(reminder.reminder_time);

    if (
      Math.abs(now.getTime() - reminderDate.getTime()) < 60000
    ) {
      new Notification("🧠 MindCare Reminder", {
        body: reminder.title,
        icon: "/vite.svg"
      });
    }
  });
};

useEffect(() => {
  const interval = setInterval(() => {
    checkReminderNotifications();
  }, 30000);

  return () => clearInterval(interval);
}, [reminders]);

const deleteReminder = async (reminderId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this reminder?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/reminder/${reminderId}`,
      {
        method: "DELETE"
      }
    );

    const result = await response.json();

    if (result.message) {
      getReminders();
    } else {
      alert(result.error || "Failed to delete reminder.");
    }
  } catch (error) {
    console.error("Reminder delete error:", error);
    alert("Backend connection failed ❌");
  }
};

  // SAVE MOOD
  const saveMood = async () => {
    if (!selectedMood) {
      setMessage("Please select your mood 😊");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/mood",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: user.id,
            mood: selectedMood,
            note: note
          })
        }
      );

      const result = await response.json();

      if (result.message) {
        setMessage("Mood saved successfully! 🎉");
        setSelectedMood("");
        setNote("");

        // Automatically refresh history
        getMoodHistory();
      } else {
        setMessage(result.error || "Failed to save mood");
      }

    } catch (error) {
      console.error(error);
      setMessage("Backend connection failed ❌");
    }
  };


  // GET MOOD HISTORY
//   const getMoodHistory = async () => {
//   alert("Button clicked!");

//   try {
//     const response = await fetch(
//       `http://127.0.0.1:8000/moods/${user.id}`
//     );

//     const result = await response.json();

//     console.log(result);

//     setMoodHistory(result.moods || []);

//   } catch (error) {
//     console.error("Error loading mood history:", error);
//     alert("Error loading mood history");
//   }
// };

const getMoodHistory = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/moods/${user.id}`
    );

    const result = await response.json();


    setMoodHistory(result.moods || []);

  } catch (error) {
    console.error("Error loading mood history:", error);
  }
};

const startMemoryGame = () => {
  const emojis = ["🌸", "🌈", "⭐", "🌻", "🦋", "🍀"];

  const cards = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
    }));

  setGameCards(cards);
  setFlippedCards([]);
  setMatchedCards([]);
  setGameMoves(0);
  setGameStarted(true);
};

const handleCardClick = (index) => {
  if (
    flippedCards.length === 2 ||
    flippedCards.includes(index) ||
    matchedCards.includes(index)
  ) {
    return;
  }

  const newFlipped = [...flippedCards, index];
  setFlippedCards(newFlipped);

  if (newFlipped.length === 2) {
    setGameMoves((moves) => moves + 1);

    const firstCard = gameCards[newFlipped[0]];
    const secondCard = gameCards[newFlipped[1]];

    if (firstCard.emoji === secondCard.emoji) {
      setMatchedCards((matched) => [
        ...matched,
        newFlipped[0],
        newFlipped[1],
      ]);

      setFlippedCards([]);
    } else {
      setTimeout(() => {
        setFlippedCards([]);
      }, 800);
    }
  }
};

const getJournalEntries = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/journals/${user.id}`
    );

    const result = await response.json();

    setJournalEntries(result.entries || []);
  } catch (error) {
    console.error("Error loading journal entries:", error);
  }
};

const getMoodStats = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/mood-stats/${user.id}`
    );

    const result = await response.json();

    setMoodStats(result.stats || []);

  } catch (error) {
    console.error("Error loading mood stats:", error);
  }
};

const getWeeklyReport = async () => {
  setWeeklyReportLoading(true);
  setWeeklyReportError("");

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/weekly-report/${user.id}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Failed to load weekly report");
    }

    setWeeklyReport(result);
  } catch (error) {
    console.error("Weekly report error:", error);
    setWeeklyReportError("Unable to load weekly report.");
  } finally {
    setWeeklyReportLoading(false);
  }
};

const deleteMood = async (moodId) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/mood/${moodId}`,
      {
        method: "DELETE"
      }
    );

    const result = await response.json();

    if (result.message) {
      getMoodHistory();
      getMoodStats();
    } else {
      alert(result.error || "Failed to delete mood");
    }

  } catch (error) {
    console.error("Delete Error:", error);
    alert("Backend connection failed ❌");
  }
};

const getDashboardStats = () => {
  if (!moodHistory || moodHistory.length === 0) {
    return {
      totalCheckins: 0,
      streak: 0
    };
  }

  const totalCheckins = moodHistory.length;

  const uniqueDates = [
    ...new Set(
      moodHistory.map((item) =>
        item.created_at.split(" ")[0]
      )
    )
  ];

  const dates = uniqueDates
    .map((date) => new Date(date))
    .sort((a, b) => b - a);

  let streak = 0;

  if (dates.length > 0) {
    streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
      const difference =
        (dates[i] - dates[i + 1]) /
        (1000 * 60 * 60 * 24);

      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  return {
    totalCheckins,
    streak
  };
};

const getChatHistory = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/chat-history/${user.id}`
    );

    const result = await response.json();

    setChatHistory(result.messages || []);

  } catch (error) {
    console.error("Error loading chat history:", error);
  }
};

const speakMessage = (text) => {
  if (!voiceEnabled) return;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }
};

const speakText = (text) => {

  if (!text || isMuted) {
    return;
  }

  window.speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.rate = 1.15;
  speech.pitch = 1;
  speech.volume = 1;

  speech.lang = "en-IN";

  setIsSpeaking(true);

  setVoiceStatus("AI is speaking...");

  speech.onend = () => {

    setIsSpeaking(false);

    setVoiceStatus("Ready to talk");

  };

  speech.onerror = () => {

    setIsSpeaking(false);

    setVoiceStatus("Ready to talk");

  };

  window.speechSynthesis.speak(speech);

};

const stopVoice = () => {
  window.speechSynthesis.cancel();

  setIsSpeaking(false);
  setIsListening(false);

  setVoiceStatus("Stopped");
};

const toggleMute = () => {
  setIsMuted(!isMuted);

  if (!isMuted) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setVoiceStatus("Muted");
  } else {
    setVoiceStatus("Ready to talk");
  }
};

const startListening = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  // Agar AI bol raha hai to pehle stop karo
  window.speechSynthesis.cancel();

  const recognition = new SpeechRecognition();

  recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "en-IN";

  recognition.onstart = () => {

    setIsListening(true);
    setIsSpeaking(false);

    setVoiceStatus("Listening...");

    setVoiceText("");
    setVoiceReply("");

  };

  recognition.onresult = async (event) => {
  const result = event.results[event.results.length - 1];

  const spokenText = result[0].transcript;

  setVoiceText(spokenText);

  // AI ko sirf final speech milne par bhejo
  if (result.isFinal) {
    setIsListening(false);
    setVoiceStatus("AI is thinking...");

    await sendMessage(spokenText);
  }
};

  recognition.onerror = (event) => {

    console.error(
      "Voice error:",
      event.error
    );

    setIsListening(false);

    setVoiceStatus("Ready to talk");

  };

  recognition.onend = () => {

    setIsListening(false);

  };

  recognition.start();

};

const sendMessage = async (voiceText = null) => {
  const userText = voiceText || chatMessage.trim();

  if (!userText) return;

  // User message show karo
  setChatHistory((prev) => [
    ...prev,
    {
      sender: "user",
      text: userText
    }
  ]);

  setChatMessage("");

  // 🚨 Emergency / Crisis Detection
  const emergencyKeywords = [
    "kill myself",
    "suicide",
    "suicidal",
    "want to die",
    "end my life",
    "hurt myself",
    "harm myself",
    "self harm",
    "self-harm",
    "i don't want to live",
    "i dont want to live"
  ];

  const lowerText = userText.toLowerCase();

  const isEmergency = emergencyKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  if (isEmergency) {
    const emergencyMessage =
      "I'm really sorry you're going through this. 💙 " +
      "You don't have to face this alone. " +
      "If you are in immediate danger or may hurt yourself, " +
      "please contact your local emergency service or a trusted person " +
      "right now. Please stay with someone you trust and move away " +
      "from anything you could use to hurt yourself.";

    setChatHistory((prev) => [
      ...prev,
      {
        sender: "bot",
        text: emergencyMessage
      }
    ]);

    setVoiceReply(emergencyMessage);
    speakText(emergencyMessage);

    return;
  }

  setChatLoading(true);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: user.id,
          message: userText
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "AI response failed"
      );
    }

    const aiReply =
      data.response || "I'm here to listen. 💙";

    // AI response chat me show karo
    setChatHistory((prev) => [
      ...prev,
      {
        sender: "bot",
        text: aiReply
      }
    ]);

    // Voice reply
    setVoiceReply(aiReply);
    speakText(aiReply);

  } catch (error) {
    console.error("Chat Error:", error);

    setChatHistory((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          "I'm having trouble responding right now. Please try again. 💙"
      }
    ]);
  } finally {
    setChatLoading(false);
  }
};

  
 

useEffect(() => {
  if (loggedIn && user) {
    getMoodHistory();
    getMoodStats();
    getChatHistory();
    getJournalEntries();
    getWeeklyReport();
      getReminders();
  }
}, [loggedIn, user]);


  // LOGOUT
  const logout = () => {
    setLoggedIn(false);
    setUser(null);
    setEmail("");
    setPassword("");
    setMessage("");
    setMoodHistory([]);
  };


  // DASHBOARD
 // DASHBOARD
if (loggedIn && user) {
  return (
   
      <div className={`app-layout ${darkMode ? "dark-mode" : ""}`}>

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>🧠 MindCare</h2>
          <p>Mental Wellness</p>
        </div>

      <nav className="sidebar-menu">

  <button
    className={`nav-item ${
      activeSection === "dashboard" ? "active" : ""
    }`}
    onClick={() => setActiveSection("dashboard")}
  >
    🏠 <span>Dashboard</span>
  </button>

  <button
    className={`nav-item ${
      activeSection === "mood" ? "active" : ""
    }`}
    onClick={() => setActiveSection("mood")}
  >
    😊 <span>Mood Tracker</span>
  </button>

<button
  className={`nav-item ${
    activeSection === "voice" ? "active" : ""
  }`}
  onClick={() => setActiveSection("voice")}
>
  🎙️ <span>Voice Assistant</span>
</button>

<button
  className={`nav-item ${
    activeSection === "chat" ? "active" : ""
  }`}
  onClick={() => setActiveSection("chat")}
>
  💬 <span>AI Chat</span>
</button>

  <button
    className={`nav-item ${
      activeSection === "analytics" ? "active" : ""
    }`}
    onClick={() => setActiveSection("analytics")}
  >
    📊 <span>Analytics</span>
  </button>

<button
  className={`nav-item ${
    activeSection === "wellness" ? "active" : ""
  }`}
  onClick={() => setActiveSection("wellness")}
>
  🌿 <span>Wellness Corner</span>
</button>


<button
  className={`nav-item ${
    activeSection === "profile" ? "active" : ""
  }`}
  onClick={() => setActiveSection("profile")}
>
  👤 <span>Profile</span>
</button>

<button
  className={`nav-item ${
    activeSection === "journal" ? "active" : ""
  }`}
  onClick={() => setActiveSection("journal")}
>
  📔 <span>Journal</span>
</button>

<button
  className={`nav-item ${
    activeSection === "reminders" ? "active" : ""
  }`}
  onClick={() => setActiveSection("reminders")}
>
  🔔 <span>Reminders</span>
</button>

<button
  className={`nav-item ${
    activeSection === "settings" ? "active" : ""
  }`}
  onClick={() => setActiveSection("settings")}
>
  ⚙️ <span>Settings</span>
</button>
</nav>
        <button className="sidebar-logout" onClick={logout}>
          🚪 Logout
        </button>

        

      </aside>
     

      {/* MAIN CONTENT */}
      <main className="main-content">

  {/* ================= DASHBOARD ================= */}

  {activeSection === "dashboard" && (
    <>
      <div className="welcome-header">
        <div>
          <p className="welcome-small">YOUR WELLNESS SPACE</p>

          <h1>Hello, {user.name} 👋</h1>

          <p>
            Take a moment to check in with yourself today.
          </p>
        </div>

        <div className="date-card">
          🌿 <span>Take care of yourself</span>
        </div>
      </div>

      <div className="dashboard-home">
        <h2>Welcome to MindCare 💜</h2>

        <p>
          Track your mood, talk with your AI wellness assistant,
          and understand your emotional journey.
        </p>

       

        <div className="quick-navigation">

  <button
    className="quick-action mood-action"
    onClick={() => setActiveSection("mood")}
  >
    <span className="quick-action-icon">😊</span>
    <span>
      <strong>Track Mood</strong>
      <small>How are you feeling?</small>
    </span>
    <b>→</b>
  </button>

  <button
    className="quick-action ai-action"
    onClick={() => setActiveSection("chat")}
  >
    <span className="quick-action-icon">🤖</span>
    <span>
      <strong>Talk to AI</strong>
      <small>Share what's on your mind</small>
    </span>
    <b>→</b>
  </button>

  <button
    className="quick-action analytics-action"
    onClick={() => setActiveSection("analytics")}
  >
    <span className="quick-action-icon">📊</span>
    <span>
      <strong>View Analytics</strong>
      <small>Understand your mood</small>
    </span>
    <b>→</b>
  </button>

</div>
        {/* DASHBOARD SUMMARY CARDS */}

<div className="summary-grid">

<div className="summary-card">
  <div className="summary-icon">
    {moodHistory.length > 0
      ? moods.find((m) => m.name === moodHistory[0].mood)?.emoji
      : "😊"}
  </div>

  <div>
    <p>Today's Mood</p>

    <h3>
      {moodHistory.length > 0
        ? moodHistory[0].mood
        : "Not Selected"}
    </h3>
  </div>
</div>
  
  <div className="summary-card">
    <div className="summary-icon">📊</div>

    <div>
      <p>Total Check-ins</p>

      {/* <h3>{wellnessStreak} Days</h3> */}
      <h3>{getDashboardStats().totalCheckins}Check-ins</h3>
      
    </div>
  </div>


  <div className="summary-card">
    <div className="summary-icon">🔥</div>

    <div>
      <p>Wellness Streak</p>

      
      <h3>{getDashboardStats().streak} Days</h3>
    </div>
  </div>

</div>


{/* WELLNESS TIP */}

<div className="wellness-tip-card">
  <div className="wellness-tip-icon">🌿</div>

  <div>
    <p className="tip-label">TODAY'S WELLNESS TIP</p>
    <h3>Take a few deep breaths and give yourself a moment to relax. 💜</h3>
  </div>
</div>

<div className="recommendation-buttons">
  <button onClick={() => setActiveSection("mood")}>
    😊 Track Mood
  </button>

  <button onClick={() => setActiveSection("chat")}>
    🤖 Talk to AI
  </button>


  <button onClick={() => setActiveSection("music")}>
    🎵 Listen to Music
  </button>

  <button onClick={() => setActiveSection("wellness")}>
    🌿 Wellness Activities
  </button>
</div>

<div className="ai-recommendation-card">
  <div className="ai-recommendation-icon">🤖</div>

  <div className="ai-recommendation-content">
    <p className="tip-label">PERSONALIZED WELLNESS</p>

    <h3>
      {moodHistory.length > 0
        ? moodHistory[0].mood === "Happy"
          ? "Keep spreading your positive energy! 🌟"
          : moodHistory[0].mood === "Good"
          ? "Take a moment to enjoy your peaceful mood. 💜"
          : moodHistory[0].mood === "Normal"
          ? "A little self-care can make your day better. 🌿"
          : moodHistory[0].mood === "Sad"
          ? "Be gentle with yourself today. You are not alone. 💙"
          : "Take a slow breath and give yourself some calm time. 🌸"
        : "Check in with your mood to receive a wellness suggestion. 🌱"}
    </h3>

    <p>
      {moodHistory.length > 0
        ? "Try a breathing exercise, listen to mood-based music, or write in your journal."
        : "Start by tracking your mood and discover personalized wellness activities."}
    </p>

    <button onClick={() => setActiveSection("wellness")}>
      Explore Wellness Activities →
    </button>
  </div>
</div>
{/* RECENT ACTIVITY */}

<div className="recent-activity-card">

  <div className="recent-activity-header">
    <div>
      <p className="tip-label">RECENT ACTIVITY</p>
      <h2>Your Recent Mood Check-ins</h2>
    </div>

    <button onClick={() => setActiveSection("mood")}>
      View All →
    </button>
  </div>

  <div className="recent-activity-list">

    {moodHistory.length === 0 ? (
      <div className="empty-activity">
        <span>🌿</span>
        <p>No mood check-ins yet.</p>
        <small>Start by tracking your mood today.</small>
      </div>
    ) : (
      moodHistory.slice(0, 5).map((item, index) => {

        const moodData = moods.find(
          (m) => m.name === item.mood
        );

        return (
          <div className="activity-item" key={item.id || index}>

            <div className="activity-mood-icon">
              {moodData?.emoji || "😊"}
            </div>

            <div className="activity-details">
              <strong>{item.mood}</strong>
              <small>
                {item.note || "Mood check-in completed"}
              </small>
            </div>

            <div className="activity-date">
              {item.created_at
                ? item.created_at.split(" ")[0]
                : ""}
            </div>

          </div>
        );
      })
    )}

  </div>

</div>

      </div>
    </>
  )}


{activeSection === "journal" && (
  <div className="journal-page">

    <div className="page-header">
      <p className="page-label">YOUR PRIVATE SPACE</p>
      <h1>📔 Personal Journal</h1>
      <p>Write down your thoughts, feelings and daily experiences.</p>
    </div>

    <div className="journal-layout">

      {/* Write Journal */}
      <div className="journal-editor-card">

        <div className="journal-card-header">
          <div>
            <p className="card-label">WRITE YOUR THOUGHTS</p>
            <h2>How are you feeling today?</h2>
          </div>
          <span className="journal-big-icon">✍️</span>
        </div>

        <input
          type="text"
          className="journal-title-input"
          placeholder="Give your journal entry a title..."
          value={journalTitle}
          onChange={(e) => setJournalTitle(e.target.value)}
        />

        <textarea
          className="journal-textarea"
          placeholder="Write whatever is on your mind..."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
        />

        <button
          className="journal-save-btn"
          onClick={saveJournalEntry}
        >
          💾 Save Journal Entry
        </button>

      </div>

      {/* Journal History */}
      <div className="journal-history-card">

        <div className="journal-card-header">
          <div>
            <p className="card-label">YOUR ENTRIES</p>
            <h2>📜 Journal History</h2>
          </div>
        </div>

        {journalEntries.length === 0 ? (
          <div className="journal-empty">
            <span>🌱</span>
            <h3>No journal entries yet</h3>
            <p>
              Start writing your first entry and keep track of your thoughts.
            </p>
          </div>
        ) : (
          <div className="journal-entry-list">

            {journalEntries.map((entry) => (
              <div className="journal-entry" key={entry.id}>

                
                <div className="journal-entry-top">
  <div>
    <h3>{entry.title}</h3>
    <small>{entry.created_at}</small>
  </div>

  <button
    className="journal-delete-btn"
    onClick={() => deleteJournalEntry(entry.id)}
  >
    🗑️ Delete
  </button>
</div>

                <p>{entry.text}</p>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  </div>
)}

{activeSection === "reminders" && (
  <div className="page-section">
    <div className="page-header">
      <p className="page-label">STAY ON TRACK</p>
      <h1>🔔 Reminders</h1>
      <p>Set simple reminders for your wellness activities.</p>
    </div>

    <div className="reminder-layout">

      <div className="reminder-editor-card">
        <div className="reminder-card-header">
          <div>
            <p className="card-label">CREATE REMINDER</p>
            <h2>Set a new reminder</h2>
          </div>

          <span className="reminder-big-icon">🔔</span>
        </div>


<input
  type="text"
  placeholder="e.g. Take a short break"
  value={reminderTitle}
  onChange={(e) => setReminderTitle(e.target.value)}
  style={{
    width: "100%",
    padding: "14px 16px",
    marginBottom: "14px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontSize: "14px",
    background: "#fff",
    color: "#333",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 9999
  }}
/>

<select
  value={reminderTime}
  onChange={(e) => setReminderTime(e.target.value)}
  style={{
    width: "100%",
    padding: "14px 16px",
    marginBottom: "14px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontSize: "14px",
    background: "#fff",
    color: reminderTime ? "#333" : "#888",
    boxSizing: "border-box",
    cursor: "pointer"
  }}
>
  <option value="">Select reminder time</option>
  <option value="08:00">08:00 AM</option>
  <option value="09:00">09:00 AM</option>
  <option value="10:00">10:00 AM</option>
  <option value="11:00">11:00 AM</option>
  <option value="12:00">12:00 PM</option>
  <option value="13:00">01:00 PM</option>
  <option value="14:00">02:00 PM</option>
  <option value="15:00">03:00 PM</option>
  <option value="16:00">04:00 PM</option>
  <option value="17:00">05:00 PM</option>
  <option value="18:00">06:00 PM</option>
  <option value="19:00">07:00 PM</option>
  <option value="20:00">08:00 PM</option>
  <option value="21:00">09:00 PM</option>
  <option value="22:00">10:00 PM</option>
</select>

        <button
          className="reminder-save-btn"
          onClick={saveReminder}
        >
          🔔 Save Reminder
        </button>

        <button
  className="reminder-notification-btn"
  onClick={requestNotificationPermission}
>
  🔔 Enable Notifications
</button>
      </div>

      <div className="reminder-history-card">
        <div className="reminder-card-header">
          <div>
            <p className="card-label">YOUR REMINDERS</p>
            <h2>📋 Reminder List</h2>
          </div>
        </div>

        {reminders.length === 0 ? (
          <div className="reminder-empty">
            <span>🌱</span>
            <h3>No reminders yet</h3>
            <p>Create your first wellness reminder.</p>
          </div>
        ) : (
          <div className="reminder-list">
            {reminders.map((reminder) => (
              <div className="reminder-item" key={reminder.id}>

                <div className="reminder-item-info">
                  <span className="reminder-item-icon">🔔</span>

                  <div>
                    <h3>{reminder.title}</h3>
                    <small>
                      ⏰ {reminder.reminder_time}
                    </small>
                  </div>
                </div>

                <button
                  className="reminder-delete-btn"
                  onClick={() =>
                    deleteReminder(reminder.id)
                  }
                >
                  🗑️ Delete
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  </div>
)}


{activeSection === "profile" && (
  <div className="page-section">

    <div className="page-header">
      <p className="page-label">MY PROFILE</p>
      <h1>👤 My Profile</h1>
      <p>Manage your personal information.</p>
    </div>

    <div className="profile-card">

      <div className="profile-avatar">
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>

      <h2>{user?.name || "User"}</h2>

      <div className="profile-info">

        <div className="profile-info-item">
          <span>👤</span>
          <div>
            <small>Full Name</small>
            <strong>{user?.name || "Not available"}</strong>
          </div>
        </div>

        <div className="profile-info-item">
          <span>📧</span>
          <div>
            <small>Email</small>
            <strong>{user?.email || "Not available"}</strong>
          </div>
        </div>

      </div>

    </div>

  </div>
)}

{activeSection === "settings" && (
  <div className="page-section">
    <div className="page-header">
      <p className="page-label">PREFERENCES</p>
      <h1>⚙️ Settings</h1>
      <p>Manage your MindCare preferences.</p>
    </div>

    <div className="settings-card">
      <div className="settings-card-header">
        <div>
          <p className="card-label">GENERAL</p>
          <h2>App Preferences</h2>
        </div>
        <span className="settings-icon">⚙️</span>
      </div>

      <div className="settings-item">
        <div>
          <h3>🔔 Notifications</h3>
          <p>Receive wellness reminders and notifications.</p>
        </div>

        <button
  className={`settings-action-btn ${
    notificationsEnabled ? "enabled" : "disabled"
  }`}
  
  onClick={() => {
  const newValue = !notificationsEnabled;

  setNotificationsEnabled(newValue);
  localStorage.setItem(
    "notificationsEnabled",
    String(newValue)
  );
}}
>
  {notificationsEnabled ? "ON 🔔" : "OFF 🔕"}
</button>
      </div>

      <div className="settings-item">
  <div>
    <h3>🌙 Dark Mode</h3>
    <p>Switch between light and dark appearance.</p>
  </div>

  <button
    className={`settings-action-btn ${
      darkMode ? "enabled" : "disabled"
    }`}
    onClick={() => {
      const newValue = !darkMode;

      setDarkMode(newValue);
      localStorage.setItem(
        "darkMode",
        String(newValue)
      );
    }}
  >
    {darkMode ? "ON 🌙" : "OFF ☀️"}
  </button>
</div>

      <div className="settings-item">
        <div>
          <h3>🤖 AI Assistant</h3>
          <p>Use the local AI assistant for wellness conversations.</p>
        </div>

        <span className="settings-status">Enabled</span>
      </div>

      <div className="settings-item">
        <div>
          <h3>🔒 Privacy</h3>
          <p>Your mood and journal data are stored locally.</p>
        </div>

        <span className="settings-status">Protected</span>
      </div>
    </div>
  </div>
)}

{activeSection === "mood" && (
  <div className="page-section">

    <div className="page-header">
      <p className="page-label">DAILY CHECK-IN</p>
      <h1>How are you feeling today? 😊</h1>
      <p>
        Take a moment to understand your emotions and track your mood.
      </p>
    </div>

    <div className="mood-page-card">

      <h2>Choose Your Mood</h2>

      <div className="mood-selector">
        {moods.map((item) => (
          <button
            key={item.name}
            className={`modern-mood-btn ${
              selectedMood === item.name ? "selected" : ""
            }`}
            onClick={() => setSelectedMood(item.name)}
          >
            <span className="mood-emoji">
              {item.emoji}
            </span>

            <span className="mood-name">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      <div className="selected-mood-display">
        {selectedMood ? (
          <>
            <span>
              {moods.find((m) => m.name === selectedMood)?.emoji}
            </span>

            <p>
              You are feeling <strong>{selectedMood}</strong> today.
            </p>
          </>
        ) : (
          <p>Select a mood to continue 😊</p>
        )}
      </div>

      <textarea
        className="mood-note"
        placeholder="Write something about how you feel today..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        className="modern-save-btn"
        onClick={saveMood}
      >
        💜 Save Today's Mood
      </button>

      {message && (
        <p className="message">
          {message}
        </p>
      )}

    </div>

  </div>
)}

{activeSection === "chat" && (

  <div className="chat-page">

    <div className="chat-page-header">

      <div className="chat-title">

        <div className="bot-avatar">
          🤖
        </div>

        <div>
          <p className="page-label">YOUR SAFE SPACE</p>

          <h1>MindCare AI Assistant</h1>

          <span className="chat-status">
            ● Online and ready to listen
          </span>
        </div>

      </div>

    </div>


    <div className="professional-chat-container">

      <div className="chat-messages">

        {chatHistory.length === 0 && (

          <div className="ai-welcome-card">

            <div className="welcome-avatar">
              🤖
            </div>

            <h2>Hello {user.name}! 👋</h2>

            <p>
              I'm your AI wellness companion.
              I'm here to listen, support you, and help
              you understand your feelings.
            </p>

            <div className="quick-prompts">

              <button
                onClick={() => setChatMessage("I feel sad today")}
              >
                😔 I feel sad
              </button>

              <button
                onClick={() => setChatMessage("I feel stressed")}
              >
                😰 I feel stressed
              </button>

              <button
                onClick={() => setChatMessage("I feel happy")}
              >
                😊 I feel happy
              </button>

            </div>

          </div>

        )}


        {chatHistory.map((item, index) => (

          <div
            key={index}
            className={
              item.sender === "user"
                ? "chat-message user-chat"
                : "chat-message bot-chat"
            }
          >

            <div className="message-avatar">
              {item.sender === "user" ? "👤" : "🤖"}
            </div>

            <div className="message-content">

              <span className="message-name">
                {item.sender === "user"
                  ? "You"
                  : "MindCare AI"}
              </span>

              <p>{item.text}</p>

            </div>

          </div>

        ))}


        {chatLoading && (

          <div className="chat-message bot-chat">

            <div className="message-avatar">
              🤖
            </div>

            <div className="message-content thinking">

              <span className="message-name">
                MindCare AI
              </span>

              <div className="ai-thinking">

                <span>AI is thinking</span>

                <span className="thinking-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </span>

              </div>

            </div>

          </div>

        )}

      </div>


      <div className="professional-chat-input">

        <input
          type="text"
          placeholder="Share what's on your mind..."
          value={chatMessage}
          onChange={(e) =>
            setChatMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          className={`voice-btn ${isListening ? "listening" : ""}`}
          onClick={startListening}
          type="button"
          title="Speak your message"
        >
          {isListening ? "🔴 Listening..." : "🎤"}
        </button>

        <button onClick={() => sendMessage()}>
          Send ➤
        </button>

      </div>

    </div>

  </div>

)}
{/* ================= VOICE ASSISTANT ================= */}

{activeSection === "voice" && (

  <div className="voice-assistant-page">

    {/* HEADER */}

    <div className="voice-header">

      <div>

        <p className="voice-label">
          VOICE CONVERSATION
        </p>

        <h1>
          🎙️ MindCare Voice Assistant
        </h1>

        <p>
          Talk naturally with your AI wellness companion
        </p>

      </div>

      <div className="voice-online">
        🟢 Online
      </div>

    </div>


    {/* MAIN VOICE CARD */}

    <div className="voice-main-card">


      {/* AI ORB AREA */}

      <div className="voice-orb-section">


        {/* AI ORB */}

        <div
          className={`ai-orb-container 
          ${isSpeaking ? "speaking" : ""}
          ${isListening ? "listening" : ""}`}
        >

          <div className="ai-orb">

           <div className="orb-face">

  <span className="orb-eye left-eye">
    ◡
  </span>

  <span className="orb-eye right-eye">
    ◡
  </span>

  <span
  className={`orb-mouth ${
    isSpeaking ? "mouth-speaking" : ""
  }`}
></span>

</div>

          </div>

        </div>


        {/* WAVE */}

        <div
          className={`voice-wave 
          ${isSpeaking ? "wave-active" : ""}`}
        >

          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>


        {/* STATUS */}

        <div className="voice-status">

          <span
            className={
              isSpeaking || isListening
                ? "status-dot active"
                : "status-dot"
            }
          ></span>

          {voiceStatus}

        </div>

      </div>


      {/* CONVERSATION */}

      <div className="voice-conversation">


        {voiceText && (

          <div className="voice-user-message">

            <strong>👤 You</strong>

            <p>{voiceText}</p>

          </div>

        )}


        {voiceReply && (

          <div className="voice-ai-message">

            <strong>🤖 MindCare AI</strong>

            <p>{voiceReply}</p>

          </div>

        )}

      </div>

    </div>


    {/* CONTROLS */}

    <div className="voice-controls">


      <button
        className="stop-btn"
        onClick={stopVoice}
      >
        ⏹ Stop
      </button>


      {/* MAIN MIC */}

      <div className="mic-section">

        <button
          className={`main-mic-btn 
          ${isListening ? "mic-listening" : ""}
          ${isSpeaking ? "mic-speaking" : ""}`}
          onClick={startListening}
        >
          🎙️
        </button>

        <h3>
          {isListening
            ? "Listening..."
            : isSpeaking
            ? "AI is Speaking..."
            : "Tap to Speak"}
        </h3>

        <p>
          Speak naturally with MindCare
        </p>

      </div>


      <button
        className="mute-btn"
        onClick={toggleMute}
      >
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>

    </div>


    {/* HOW IT WORKS */}

    <div className="voice-steps">


      <div className="voice-step">

        <div className="step-icon">
          🎙️
        </div>

        <div>

          <h3>You Speak</h3>

          <p>
            Tell MindCare how you're feeling
          </p>

        </div>

      </div>


      <div className="step-arrow">
        →
      </div>


      <div className="voice-step">

        <div className="step-icon">
          🤖
        </div>

        <div>

          <h3>AI Listens</h3>

          <p>
            MindCare understands your message
          </p>

        </div>

      </div>


      <div className="step-arrow">
        →
      </div>


      <div className="voice-step">

        <div className="step-icon">
          🔊
        </div>

        <div>

          <h3>AI Responds</h3>

          <p>
            Hear the response naturally
          </p>

        </div>

      </div>

    </div>

  </div>

)}
  

  {/* ================= AI ASSISTANT ================= */}
{/* ================= AI ASSISTANT ================= */}



  {/* ================= ANALYTICS ================= */}

  {/* ================= ANALYTICS ================= */}

    {activeSection === "analytics" && (
  <div className="page-section analytics-page">

    {/* PAGE HEADER */}

    <div className="analytics-page-header">

      <div>

        <p className="page-label">
          YOUR EMOTIONAL JOURNEY
        </p>

        <h1>📊 Mood Analytics</h1>

        <p>
          Understand your emotions and track your wellness journey.
        </p>

      </div>

    </div>


    {/* SUMMARY CARDS */}

    <div className="analytics-summary">
      <div className="weekly-report-card">
  <div className="weekly-report-header">
    <div>
      <p className="card-label">LAST 7 DAYS</p>
      <h2>📊 Weekly Mood Report</h2>
    </div>

    <span className="weekly-report-icon">🌿</span>
  </div>

  {weeklyReportLoading ? (
    <p className="weekly-report-message">
      Loading your weekly report...
    </p>
  ) : weeklyReportError ? (
    <p className="weekly-report-message error">
      {weeklyReportError}
    </p>
  ) : weeklyReport ? (
    <>
      <div className="weekly-report-stats">
        <div>
          <span>📝</span>
          <strong>{weeklyReport.total_checkins}</strong>
          <small>Total Check-ins</small>
        </div>

        <div>
          <span>💜</span>
          <strong>{weeklyReport.most_common_mood}</strong>
          <small>Most Common Mood</small>
        </div>
      </div>

      <div className="weekly-mood-list">
        {Object.entries(weeklyReport.mood_counts).map(
          ([mood, count]) => (
            <div className="weekly-mood-row" key={mood}>
              <span>{mood}</span>
              <div className="weekly-mood-bar">
                <div
                  style={{
                    width: `${
                      weeklyReport.total_checkins > 0
                        ? (count / weeklyReport.total_checkins) * 100
                        : 0
                    }%`
                  }}
                ></div>
              </div>
              <strong>{count}</strong>
            </div>
          )
        )}
      </div>
    </>
  ) : (
    <p className="weekly-report-message">
      No weekly mood data available yet.
    </p>
  )}
</div>

      <div className="analytics-summary-card">

        <div className="analytics-icon">
          📅
        </div>

        <div>

          <p>Total Check-ins</p>

          <h2>{moodHistory.length}</h2>

        </div>

      </div>


      <div className="analytics-summary-card">

        <div className="analytics-icon">
          😊
        </div>

        <div>

          <p>Most Common Mood</p>
<h2>
  {moodStats.length > 0
    ? `${[...allMoodStats]
        .sort((a, b) => b.count - a.count)[0]?.emoji} ${
        [...allMoodStats]
          .sort((a, b) => b.count - a.count)[0]?.mood
      }`
    : "No Data"}
</h2>
          

        </div>

      </div>


      <div className="analytics-summary-card">

        <div className="analytics-icon">
          🌱
        </div>

        <div>

          <p>Wellness Journey</p>

          <h2>{getDashboardStats().streak} Days</h2>

        </div>

      </div>

    </div>


    {/* MOOD STATISTICS */}

    <div className="analytics-main-grid">

      <section className="analytics-panel">

        <div className="analytics-panel-header">

          <div>

            <p className="card-label">
              MOOD OVERVIEW
            </p>

            <h2>Your Mood Statistics</h2>

          </div>

        </div>


        <div className="analytics-mood-list">

          {allMoodStats.map((item) => (

            <div
              className="analytics-mood-item"
              key={item.mood}
            >

              <div className="analytics-mood-info">

                <span className="analytics-mood-emoji">
                  {item.emoji}
                </span>

                <div>

                  <h3>{item.mood}</h3>

                  <p>
                    {item.count === 1
                      ? "1 check-in"
                      : `${item.count} check-ins`}
                  </p>

                </div>

              </div>


              <div className="analytics-count">

                {item.count}

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* PIE CHART */}

      <section className="analytics-panel chart-panel">

        <div className="analytics-panel-header">

          <div>

            <p className="card-label">
              VISUAL INSIGHTS
            </p>

            <h2>Mood Distribution</h2>

          </div>

        </div>


        {moodStats.length > 0 ? (

          <div className="analytics-chart">

            <ResponsiveContainer width="100%" height={350}>

              <PieChart>

                <Pie
                  data={allMoodStats.filter(
                    (item) => item.count > 0
                  )}
                  dataKey="count"
                  nameKey="mood"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >

                  {allMoodStats
                    .filter((item) => item.count > 0)
                    .map((item, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={moodColors[item.mood]}
                      />

                    ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        ) : (

          <div className="no-analytics-data">

            <span>📊</span>

            <h3>No mood data yet</h3>

            <p>
              Start tracking your mood to see your analytics.
            </p>

          </div>

        )}

      </section>

    </div>


    {/* RECENT HISTORY */}

    <section className="analytics-history">

      <div className="analytics-panel-header">

        <div>

          <p className="card-label">
            RECENT ACTIVITY
          </p>

          <h2>📜 Recent Mood History</h2>

        </div>

      </div>


      <div className="modern-history-list">

        {moodHistory.length === 0 ? (

          <div className="no-analytics-data">

            <span>🌱</span>

            <h3>Your journey starts here</h3>

            <p>
              Track your first mood and begin understanding yourself better.
            </p>

          </div>

        ) : (

          moodHistory.slice(0, 10).map((item) => (

            <div
              className="modern-history-item"
              key={item.id}
            >
              


              <div className="history-mood">

                <span className="history-emoji">

                  {moods.find(
                    (m) => m.name === item.mood
                  )?.emoji || "😊"}

                </span>


                <div>

                  <h3>{item.mood}</h3>

                  {item.note && (
                    <p>{item.note}</p>
                  )}

                </div>

              </div>


             
              <small>
  {new Date(item.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</small>
 <button
    className="delete-mood-btn"
    onClick={() => deleteMood(item.id)}
  >
    🗑️ Delete
  </button>

            </div>

          ))

        )}

      </div>

    </section>

  </div>

)}

{activeSection === "wellness" && (
  <div className="wellness-container">
    <h1>🌿 Wellness Corner</h1>
    <p>Take a moment to relax, refresh and feel better.</p>

    <div className="wellness-cards">

<div className="wellness-card">
  <h2>🧩 Mind Games</h2>
  <p>Play simple games to relax and improve focus.</p>

  <button onClick={startMemoryGame}>
    🧠 Memory Match
  </button>

  <button onClick={startNumberPuzzle}>
    🔢 Number Puzzle
  </button>

  <button onClick={startScrambleGame}>
    🔤 Word Scramble
  </button>

  <button onClick={start2048Game}>
    🔢 2048
  </button>

  <button onClick={startFocusGame}>
  🎯 Focus Tap
</button>
</div>


      <div className="wellness-card">
        <h2>🎵 Mood Music</h2>
        <p>Listen to music based on how you feel.</p>
        
        <button onClick={() => setActiveSection("music")}>
  Explore Music
</button>
      </div>

      <div className="wellness-card">
        <h2>🌬️ Breathing Exercise</h2>
        <p>Take a short breathing break and relax.</p>
       
        <button onClick={startBreathing}>
  Start Breathing
</button>
{breathingStarted && (
  <div className="breathing-display">
    <div className="breathing-circle">
      <span>{breathingPhase}</span>
      <strong>{breathingCount}</strong>
    </div>

    <button onClick={() => setBreathingStarted(false)}>
      ⏹️ Stop Breathing
    </button>
  </div>
)}

      </div>

    </div>


  </div>
  
)}

  {activeSection === "wellness" && gameStarted && (
  <div className="memory-game">

    <div className="game-header">
      <div>
        <h2>🧩 Memory Match</h2>
        <p>Find all matching pairs and relax your mind.</p>
      </div>

      <div className="game-score">
        Moves: <strong>{gameMoves}</strong>
      </div>
    </div>

    <div className="memory-grid">
      {gameCards.map((card, index) => {
        const isFlipped =
          flippedCards.includes(index) ||
          matchedCards.includes(index);

        return (
          <button
            key={card.id}
            className={`memory-card ${isFlipped ? "flipped" : ""}`}
            onClick={() => handleCardClick(index)}
          >
            {isFlipped ? card.emoji : "?"}
          </button>
        );
      })}
    </div>

    

    {matchedCards.length === gameCards.length && (
      <div className="game-complete">
        🎉 Great job!
        <p>You completed the game in {gameMoves} moves.</p>

        <button onClick={startMemoryGame}>
          🔄 Play Again
        </button>
      </div>
    )}

  </div>
)}

{activeSection === "wellness" && game2048Started && (

  <div
    className="game2048"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        move2048("up");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        move2048("down");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        move2048("left");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        move2048("right");
      }
    }}
  >

  

    <div className="game-header">
      <div>
        <h2>🔢 2048</h2>
        <p>Combine the numbers and reach 2048!</p>
      </div>

      <div className="game-score">
        Score: <strong>{score2048}</strong>
      </div>
    </div>

    <div className="game2048-grid">
      {game2048.map((tile, index) => (
        <button
          key={index}
          className={`game2048-tile ${tile === 0 ? "empty" : ""}`}
        >
          {tile !== 0 ? tile : ""}
        </button>
      ))}
    </div>

    <div className="game2048-controls">
      <button onClick={() => move2048("up")}>⬆️</button>

      <div>
        <button onClick={() => move2048("left")}>⬅️</button>
        <button onClick={() => move2048("down")}>⬇️</button>
        <button onClick={() => move2048("right")}>➡️</button>
      </div>
    </div>

    <button
      className="start-number-game"
      onClick={start2048Game}
    >
      🔄 New Game
    </button>
  </div>
)}

  {activeSection === "wellness" && numberGameStarted && (
  <div className="number-puzzle">
    <div className="game-header">
      <div>
        <h2>🔢 Number Puzzle</h2>
        <p>Arrange the numbers from 1 to 8 in order.</p>
      </div>

      <div className="game-score">
        Moves: <strong>{numberMoves}</strong>
      </div>
    </div>

    <div className="number-grid">
      {numberPuzzle.map((number, index) => (
        <button
          key={index}
          className={`number-tile ${number === "" ? "empty" : ""}`}
          onClick={() => moveNumberTile(index)}
        >
          {number}
        </button>
      ))}
    </div>

    <button
      className="start-number-game"
      onClick={startNumberPuzzle}
    >
      🔄 New Puzzle
    </button>
  </div>
)}

{activeSection === "wellness" && scrambleGameStarted && (
  <div className="word-scramble">
    <div className="game-header">
      <div>
        <h2>🔤 Word Scramble</h2>
        <p>Unscramble the letters and find the correct word.</p>
      </div>

      <div className="game-score">
        Score: <strong>{scrambleScore}</strong>
      </div>
    </div>

    <div className="scrambled-word">
      {scrambledWord}
    </div>
{scrambleMessage && (
  <div className="scramble-message">
    {scrambleMessage}
  </div>
)}
    <input
      type="text"
      value={scrambleAnswer}
      onChange={(e) => setScrambleAnswer(e.target.value)}
      placeholder="Type your answer"
    />

    <div className="scramble-buttons">
      <button onClick={checkScrambleAnswer}>
        ✅ Check Answer
      </button>

      <button onClick={startScrambleGame}>
        🔄 New Word
      </button>
    </div>
  </div>
)}

{activeSection === "wellness" && focusGameStarted && (
  <div className="focus-game">
    <div className="game-header">
      <div>
        <h2>🎯 Focus Tap</h2>
        <p>Tap the target as quickly as you can!</p>
      </div>

      <div className="game-score">
        Score: <strong>{focusScore}</strong>
      </div>
    </div>

    <div className="focus-info">
      ⏱️ Time: <strong>{focusTime}s</strong>
    </div>

    {focusTime > 0 ? (
      <div className="focus-area">
        <button
          className="focus-target"
          style={{
            top: `${focusTarget.top}%`,
            left: `${focusTarget.left}%`
          }}
          onClick={hitFocusTarget}
        >
          🎯
        </button>
      </div>
    ) : (
      <div className="focus-complete">
        🎉 Time's Up!
        <p>Your score: {focusScore}</p>

        <button onClick={startFocusGame}>
          🔄 Play Again
        </button>
      </div>
    )}

    <button
      className="start-number-game"
      onClick={startFocusGame}
    >
      ▶️ Start New Game
    </button>
  </div>
)}

{activeSection === "music" && (
  <div className="wellness-container">
    <div className="page-header">
      <p className="page-label">MUSIC FOR YOUR MIND</p>
      <h1>🎵 Mood Music</h1>
      <p>Choose music according to how you feel.</p>
    </div>

    {Object.entries(musicLibrary).map(([type, songs]) => (
      <div className="music-section" key={type}>
        <h2>
          {type === "happy" && "😄 Happy & Uplifting"}
          {type === "calm" && "😌 Calm & Soothing"}
          {type === "anxiety" && "😰 Anxiety Relief"}
        </h2>

        <div className="music-grid">
          {songs.map((song, index) => (
            <div className="music-card" key={song.file}>
              <div className="music-icon">
                🎵
              </div>

              <div className="music-info">
                <h3>{song.title}</h3>
                <p>
                  {type === "happy"
                    ? "Feel-good music for a positive mood."
                    : type === "calm"
                    ? "Peaceful music for relaxation."
                    : "Relaxing music to help you slow down."}
                </p>
              </div>

              <button
                className="music-play-btn"
                onClick={() => startRelaxingSound(type, index)}
              >
                {currentSong?.file === song.file && musicPlaying
                  ? "⏸️ Playing"
                  : "▶️ Play"}
              </button>
            </div>
          ))}
        </div>
      </div>
    ))}

    <button
      className="music-stop-btn"
      onClick={stopRelaxingSound}
    >
      ⏹️ Stop Music
    </button>
  </div>
)}

</main>
      

    </div>
  );
}
  // LOGIN / REGISTER PAGE

  // LOGIN / REGISTER PAGE
const handleAuth = async (e) => {
  e.preventDefault();

   if (!isLogin && password.length < 8) {
    setMessage("Password must be at least 8 characters long");
    return;
  }


  const url = isLogin
    ? "http://127.0.0.1:8000/login"
    : "http://127.0.0.1:8000/register";

  const data = isLogin
    ? {
        email,
        password
      }
    : {
        name,
        email,
        password
      };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.message) {
      if (isLogin && result.user) {
        setUser(result.user);
        setLoggedIn(true);
        setMessage("");
      } else {
        setMessage(result.message);
      }

      if (!isLogin) {
        setName("");
        setEmail("");
        setPassword("");
      }
    } else {
      setMessage(result.error || "Something went wrong");
    }
  } catch (error) {
    console.error(error);
    setMessage("Backend connection failed ❌");
  }
};

return (
  <div className="auth-page">

    <div className="auth-brand-section">

      <div className="brand-logo">
        🧠
      </div>

      <h1>MindCare</h1>

      <p className="brand-subtitle">
        Mental Wellness
      </p>

      <div className="brand-message">
        <h2>Your safe space<br />for mental wellness 💜</h2>

        <p>
          Take a moment for yourself.
          Track your mood, talk with AI,
          and take care of your mind.
        </p>
      </div>

    </div>


    <div className="auth-card">

      <div className="auth-card-header">

        <div className="auth-icon">
          🤖
        </div>

        <h2>
          {isLogin
            ? "Welcome Back 👋"
            : "Create Account ✨"}
        </h2>

        <p>
          {isLogin
            ? "Continue your wellness journey."
            : "Start your MindCare journey today."}
        </p>

      </div>


      <form onSubmit={handleAuth}>

        {!isLogin && (
          <div className="auth-input-group">

            <label>Full Name</label>

            <div className="auth-input-wrapper">
              <span>👤</span>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>

          </div>
        )}


        <div className="auth-input-group">

          <label>Email Address</label>

          <div className="auth-input-wrapper">
            <span>📧</span>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

        </div>


        <div className="auth-input-group">

          <label>Password</label>

          <div className="auth-input-wrapper">
            <span>🔒</span>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

        </div>


        <button
          type="submit"
          className="auth-submit-btn"
        >
          {isLogin
            ? "Login to MindCare →"
            : "Create My Account →"}
        </button>

      </form>


      {message && (
        <p className="message">
          {message}
        </p>
      )}


      <div className="auth-divider">
        <span>or</span>
      </div>


      <p className="switch-text">

        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}

        <span
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin
            ? " Create Account"
            : " Login"}
        </span>

      </p>

    </div>

  </div>
);
}
export default App;