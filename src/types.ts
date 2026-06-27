export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  classLevel: string;      // "Class 2" to "Class 10"
  subjectCategory: string; // "English", "Mathematics", "Science", "Hindi", "Logical Reasoning", "General Knowledge", "Cyber"
  imageUrl?: string;
}

export type QuizCategory = 'olympiad' | 'school' | 'custom' | 'iq';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  subcategory: string; // e.g. "Mathematics Olympiad", "English Grammar"
  difficulty: 'easy' | 'medium' | 'hard';
  classLevel: string; // e.g. "Class 5"
  timeLimit: number; // in seconds, 0 for untimed
  questions: Question[];
  creator?: string;
  isAiGenerated?: boolean;
}

export interface QuizResult {
  id: string;
  userId: string;
  studentName: string;
  quizId: string;
  quizTitle: string;
  classLevel: string;
  subject: string;
  category: string; // Olympiad or School Subject
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number; // in seconds
  completedAt: string;
  medal: 'gold' | 'silver' | 'bronze' | 'participation';
  feedback: string;
  certificateId?: string;
  xpEarned: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  classLevel: string; // Default level selection
  xp: number;
  streak: number; // Daily quiz streak
  loginStreak: number; // Daily login streak
  weeklyStreak: number;
  monthlyStreak: number;
  level: number;
  lastActiveDate?: string;
  lastQuizDate?: string;
  referralCode: string;
  referredCount: number;
  referredUsers: string[]; // List of names/emails
  medals: {
    gold: number;
    silver: number;
    bronze: number;
    participation: number;
  };
  certificates: string[]; // List of certificate IDs
  achievements: string[]; // List of unlocked badges
}

export interface ChallengeAttempt {
  studentName: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
}

export interface FriendChallenge {
  id: string;
  quizId: string;
  quizTitle: string;
  classLevel: string;
  subject: string;
  creatorUid: string;
  creatorName: string;
  creatorScore: number;
  creatorTotal: number;
  creatorTimeSpent: number;
  attempts: ChallengeAttempt[];
}

export interface DailyQuestion {
  id: string; // "qotd-iq", "qotd-maths", "qotd-science", "qotd-english", "qotd-hindi"
  category: 'iq' | 'maths' | 'science' | 'english' | 'hindi';
  title: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  classLevel: string;
}


export interface Certificate {
  id: string;
  studentName: string;
  classLevel: string;
  subject: string;
  category: string; // "Mathematics Olympiad", "General Science", etc.
  score: number;
  totalQuestions: number;
  medal: 'gold' | 'silver' | 'bronze' | 'participation';
  date: string;
  uniqueId: string;
  qrVerification: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl: string;
  seoKeywords: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
  status: 'unread' | 'read';
}

