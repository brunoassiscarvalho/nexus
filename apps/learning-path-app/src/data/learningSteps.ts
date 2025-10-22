import { LearningStep } from "../types/learning";

export const learningSteps: LearningStep[] = [
  {
    id: 1,
    title: "Introduction to Learning",
    description: "Start your learning journey",
    content:
      "Welcome to your learning adventure! In this first step, you'll discover the fundamentals and build a strong foundation for your journey ahead. Get ready to explore new concepts and develop essential skills.",
    imageUrl:
      "https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFybmluZyUyMGVkdWNhdGlvbiUyMGJvb2t8ZW58MXx8fHwxNzU5MzM1MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 10,
    prerequisites: [],
    tier: 1,
    position: 0,
    category: "foundation",
  },
  {
    id: 2,
    title: "The Alphabet",
    description: "Master the basic letters",
    content:
      "Learn the building blocks of language! This step focuses on recognizing and understanding each letter. Practice makes perfect, so take your time to familiarize yourself with each character.",
    imageUrl:
      "https://images.unsplash.com/photo-1657302155425-611b7aba5b33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGFscGhhYmV0JTIwbGV0dGVyc3xlbnwxfHx8fDE3NTkzMzUzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 15,
    prerequisites: [1],
    tier: 2,
    position: 0,
    category: "reading",
  },
  {
    id: 3,
    title: "Basic Conversations",
    description: "Learn to communicate",
    content:
      "Start talking! In this step, you'll learn common phrases and how to engage in simple conversations. Practice greeting others and introducing yourself with confidence.",
    imageUrl:
      "https://images.unsplash.com/photo-1615363366457-55b0a8672fef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZXJzYXRpb24lMjBwZW9wbGUlMjB0YWxraW5nfGVufDF8fHx8MTc1OTI1MzkyOHww&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 20,
    prerequisites: [1],
    tier: 2,
    position: 1,
    category: "speaking",
  },
  {
    id: 4,
    title: "Test",
    description: "Understand sentence structure",
    content:
      "Build proper sentences! Understanding grammar rules will help you construct meaningful and correct sentences. Learn about subjects, verbs, and how they work together.",
    imageUrl:
      "https://images.unsplash.com/photo-1749414417901-0964ca418ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFtbWFyJTIwd3JpdGluZ3xlbnwxfHx8fDE3NTkzMzUzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 25,
    prerequisites: [1],
    tier: 2,
    position: 2,
    category: "writing",
  },
  {
    id: 13,
    title: "Audio Recognition",
    description: "Identify sounds",
    content:
      "Train your ear to recognize different sounds and phonemes. This foundational listening skill will help you understand spoken language better.",
    imageUrl:
      "https://images.unsplash.com/photo-1607270636108-52e65b5878b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0ZW5pbmclMjBtdXNpYyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU5MzI2MTcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 15,
    prerequisites: [1],
    tier: 2,
    position: 3,
    category: "listening",
  },
  {
    id: 5,
    title: "Vocabulary Building",
    description: "Expand your word bank",
    content:
      "Words are power! Increase your vocabulary by learning new words and their meanings. The more words you know, the better you can express yourself.",
    imageUrl:
      "https://images.unsplash.com/photo-1598983941654-125cc1854744?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2NhYnVsYXJ5JTIwd29yZHN8ZW58MXx8fHwxNzU5MzM1MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 20,
    prerequisites: [2],
    tier: 3,
    position: 0,
    category: "reading",
  },
  {
    id: 7,
    title: "Reading Comprehension",
    description: "Understand written text",
    content:
      "Read and understand! Develop your reading skills by practicing with various texts. Learn to identify key information and understand context.",
    imageUrl:
      "https://images.unsplash.com/photo-1580699228119-7be487b3137f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFkaW5nJTIwYm9vayUyMHN0dWR5fGVufDF8fHx8MTc1OTMzNTM1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 25,
    prerequisites: [5, 20, 21],
    tier: 4,
    position: 0,
    category: "reading",
  },
  {
    id: 6,
    title: "Pronunciation Practice",
    description: "Speak clearly and confidently",
    content:
      "Sound like a native! Work on your pronunciation and accent. Listen carefully and practice speaking out loud to improve your fluency and confidence.",
    imageUrl:
      "https://images.unsplash.com/photo-1740479048945-46fe33480214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9udW5jaWF0aW9uJTIwc3BlYWtpbmd8ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 30,
    prerequisites: [3],
    tier: 3,
    position: 1,
    category: "speaking",
  },
  {
    id: 12,
    title: "Fluent Speaking",
    description: "Speak with confidence",
    content:
      "Achieve fluency! Put together everything you've learned to speak naturally and confidently. Practice complex conversations and express nuanced ideas with ease.",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjBzcGVha2luZyUyMGNvbmZpZGVuY2V8ZW58MXx8fHwxNzU5MzM1MzUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 40,
    prerequisites: [6],
    tier: 4,
    position: 1,
    category: "speaking",
  },
  {
    id: 14,
    title: "Sentence Structure",
    description: "Build better sentences",
    content:
      "Master the art of constructing well-formed sentences. Learn how to combine words effectively to convey your thoughts clearly.",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwcGVuJTIwcGFwZXJ8ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 20,
    prerequisites: [4],
    tier: 3,
    position: 2,
    category: "writing",
  },
  {
    id: 11,
    title: "Advanced Writing",
    description: "Master written expression",
    content:
      "Express yourself through writing! Combine your grammar, vocabulary, and cultural knowledge to create compelling written content. Practice writing essays, stories, and formal documents.",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwcGVuJTIwcGFwZXJ8ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 40,
    prerequisites: [14],
    tier: 4,
    position: 2,
    category: "writing",
  },
  {
    id: 8,
    title: "Listening Skills",
    description: "Train your ear",
    content:
      "Listen up! Improve your listening comprehension by practicing with audio materials. Learn to understand spoken language in various contexts and speeds.",
    imageUrl:
      "https://images.unsplash.com/photo-1607270636108-52e65b5878b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0ZW5pbmclMjBtdXNpYyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU5MzI2MTcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 30,
    prerequisites: [13],
    tier: 3,
    position: 3,
    category: "listening",
  },
  {
    id: 9,
    title: "Cultural Context",
    description: "Explore traditions and customs",
    content:
      "Understand the culture! Language and culture are deeply connected. Learn about traditions, customs, and cultural nuances to communicate more effectively.",
    imageUrl:
      "https://images.unsplash.com/photo-1628282684916-f4a312e5e3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJlJTIwdHJhdmVsJTIwd29ybGR8ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 35,
    prerequisites: [8],
    tier: 4,
    position: 3,
    category: "listening",
  },
  {
    id: 15,
    title: "Accent Recognition",
    description: "Understand different dialects",
    content:
      "Master the art of understanding various accents and dialects! This skill will help you communicate with speakers from different regions and backgrounds.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0ZW5pbmclMjBjb252ZXJzYXRpb258ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 35,
    prerequisites: [8],
    tier: 4,
    position: 4,
    category: "listening",
  },
  {
    id: 10,
    title: "Mastery Challenge",
    description: "Complete your journey",
    content:
      "You've made it! This final challenge will test everything you've learned. Show off your skills and earn your achievement. Congratulations on completing your learning journey!",
    imageUrl:
      "https://images.unsplash.com/photo-1642104744809-14b986179927?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMHRyb3BoeSUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzU5MzA1NDIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 50,
    prerequisites: [7, 9, 15, 16, 17, 19],
    tier: 6,
    position: 0,
    category: "foundation",
  },
  {
    id: 16,
    title: "New Child Skill",
    description: "Add a description for this skill",
    content:
      "Add detailed content about what the learner will achieve in this step.",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwcGVuJTIwcGFwZXJ8ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 10,
    prerequisites: [11],
    tier: 5,
    position: 0,
    category: "writing",
  },
  {
    id: 17,
    title: "New Child Skill",
    description: "Add a description for this skill",
    content:
      "Add detailed content about what the learner will achieve in this step.",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwcGVuJTIwcGFwZXJ8ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 10,
    prerequisites: [14],
    tier: 4,
    position: 0,
    category: "writing",
  },
  {
    id: 18,
    title: "New Child Skill",
    description: "Add a description for this skill",
    content:
      "Add detailed content about what the learner will achieve in this step.",
    imageUrl:
      "https://images.unsplash.com/photo-1740479048945-46fe33480214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9udW5jaWF0aW9uJTIwc3BlYWtpbmd8ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 10,
    prerequisites: [6],
    tier: 4,
    position: 0,
    category: "speaking",
  },
  {
    id: 19,
    title: "New Child Skill",
    description: "Add a description for this skill",
    content:
      "Add detailed content about what the learner will achieve in this step.",
    imageUrl:
      "https://images.unsplash.com/photo-1740479048945-46fe33480214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9udW5jaWF0aW9uJTIwc3BlYWtpbmd8ZW58MXx8fHwxNzU5MzM1MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 10,
    prerequisites: [18, 12],
    tier: 5,
    position: 0,
    category: "speaking",
  },
  {
    id: 20,
    title: "New Child Skill",
    description: "Add a description for this skill",
    content:
      "Add detailed content about what the learner will achieve in this step.",
    imageUrl:
      "https://images.unsplash.com/photo-1657302155425-611b7aba5b33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGFscGhhYmV0JTIwbGV0dGVyc3xlbnwxfHx8fDE3NTkzMzUzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 10,
    prerequisites: [2],
    tier: 3,
    position: 0,
    category: "reading",
  },
  {
    id: 21,
    title: "New Child Skill",
    description: "Add a description for this skill",
    content:
      "Add detailed content about what the learner will achieve in this step.",
    imageUrl:
      "https://images.unsplash.com/photo-1657302155425-611b7aba5b33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGFscGhhYmV0JTIwbGV0dGVyc3xlbnwxfHx8fDE3NTkzMzUzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    skillPoints: 10,
    prerequisites: [2],
    tier: 3,
    position: 0,
    category: "reading",
  },
];

export const categoryColors = {
  foundation: {
    primary: "#F59E0B", // amber
    secondary: "#FEF3C7",
    border: "#F59E0B",
    glow: "#F59E0B",
    text: "#78350F",
  },
  reading: {
    primary: "#3B82F6", // blue
    secondary: "#DBEAFE",
    border: "#3B82F6",
    glow: "#3B82F6",
    text: "#1E3A8A",
  },
  speaking: {
    primary: "#8B5CF6", // violet
    secondary: "#EDE9FE",
    border: "#8B5CF6",
    glow: "#8B5CF6",
    text: "#5B21B6",
  },
  writing: {
    primary: "#10B981", // emerald
    secondary: "#D1FAE5",
    border: "#10B981",
    glow: "#10B981",
    text: "#065F46",
  },
  listening: {
    primary: "#EC4899", // pink
    secondary: "#FCE7F3",
    border: "#EC4899",
    glow: "#EC4899",
    text: "#9F1239",
  },
};
