import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Challenge from "./models/Challenge.js";

dotenv.config();

const challenges = [
  {
    title: "Two-Hour Phone Blackout",
    description: "For two consecutive hours, keep your phone physically out of reach while completing normal responsibilities.",
    category: "digital-control",
    difficulty: "medium",
    durationMinutes: 120,
    rules: ["No social media", "No short-form video", "No unnecessary checking", "Emergency calls are allowed"]
  },
  {
    title: "90-Minute Deep Work Lock",
    description: "Choose one cognitively demanding task and work on it for 90 minutes without entertainment or casual browsing.",
    category: "attention",
    difficulty: "medium",
    durationMinutes: 90,
    rules: ["One task only", "Phone away", "No entertainment tabs", "Write down distractions instead of following them"]
  },
  {
    title: "Delay Every Nonessential Impulse",
    description: "Whenever you want an unnecessary snack, scroll, check, or entertainment break, delay the decision for 20 minutes.",
    category: "delayed-gratification",
    difficulty: "medium",
    durationMinutes: 480,
    rules: ["Use a 20-minute delay", "Decide deliberately after the delay", "Do not replace one distraction with another"]
  },
  {
    title: "Entertainment After Priority",
    description: "Complete your most important planned task before consuming recreational digital content.",
    category: "discipline",
    difficulty: "medium",
    durationMinutes: 180,
    rules: ["Define the priority first", "No recreational scrolling before completion", "Do not change the priority just to make it easier"]
  },
  {
    title: "Four-Hour Low-Stimulation Block",
    description: "For four hours, remove short-form content, gaming, entertainment streaming, and unnecessary browsing.",
    category: "digital-control",
    difficulty: "hard",
    durationMinutes: 240,
    rules: ["No short-form content", "No gaming", "No entertainment streaming", "Use devices only for necessary work"]
  },
  {
    title: "Two-Hour Deep Work + Recovery",
    description: "Complete two hours of focused work, then take a deliberate 20-minute recovery period without social media.",
    category: "attention",
    difficulty: "hard",
    durationMinutes: 140,
    rules: ["Two focused hours", "Phone inaccessible", "Recovery cannot become scrolling", "Return to planned work after recovery"]
  },
  {
    title: "Impulse Interruption Protocol",
    description: "For the next six hours, every nonessential impulse must be noticed, named, delayed, and consciously accepted or rejected.",
    category: "delayed-gratification",
    difficulty: "hard",
    durationMinutes: 360,
    rules: ["Notice the impulse", "Name it", "Wait 15 minutes", "Make a deliberate decision"]
  },
  {
    title: "Full Evening Digital Discipline",
    description: "After your chosen start time, avoid social media, short-form content and entertainment until bedtime.",
    category: "discipline",
    difficulty: "hard",
    durationMinutes: 300,
    rules: ["Choose start time", "No recreational scrolling", "Use the time for planned activities", "Record what you did instead"]
  },
  {
    title: "Discomfort Without Escape",
    description: "Choose one uncomfortable but safe task you have been postponing and work on it continuously for 60 minutes without switching to entertainment.",
    category: "discomfort",
    difficulty: "medium",
    durationMinutes: 60,
    rules: ["Pick a safe task", "No entertainment escape", "Stay with the task", "Stop if the activity becomes physically unsafe"]
  },
  {
    title: "Five-Hour Stimulation Fast",
    description: "For five hours, avoid short-form content, gaming, entertainment streaming and unnecessary browsing.",
    category: "digital-control",
    difficulty: "hard",
    durationMinutes: 300,
    rules: ["No short-form content", "No gaming", "No entertainment streaming", "Necessary work is allowed"]
  }
];

await connectDB();

for (const item of challenges) {
  await Challenge.updateOne({ title: item.title }, { $set: item }, { upsert: true });
}

console.log(`Seeded ${challenges.length} PFC challenges.`);
process.exit(0);
