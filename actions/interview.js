"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz with Gemini:", error.message);
    
    // Fallback questions so mock interview never crashes even if API key is invalid
    return [
      {
        question: `In modern ${user.industry || "software"} development, what is the primary benefit of continuous integration (CI)?`,
        options: [
          "Eliminating the need for manual code review completely",
          "Detecting integration errors early through automated testing and builds",
          "Replacing version control systems like Git",
          "Automatically deploying untested code to production"
        ],
        correctAnswer: "Detecting integration errors early through automated testing and builds",
        explanation: "Continuous Integration automatically builds and runs tests on code changes, identifying defects as soon as they are introduced."
      },
      {
        question: "What is the primary difference between synchronous and asynchronous operations?",
        options: [
          "Synchronous operations block execution until complete; asynchronous operations allow other tasks to proceed",
          "Asynchronous operations always execute faster than synchronous operations",
          "Synchronous operations only run on server-side environments",
          "Asynchronous operations cannot handle errors"
        ],
        correctAnswer: "Synchronous operations block execution until complete; asynchronous operations allow other tasks to proceed",
        explanation: "Synchronous tasks block subsequent code execution until finished, whereas asynchronous tasks allow execution to continue in parallel."
      },
      {
        question: "Which of the following best describes the principle of least privilege in security architecture?",
        options: [
          "Users should have full root access during development",
          "Accounts and systems should only have the minimum access rights necessary to perform their functions",
          "Security policies should only apply to junior employees",
          "Encryption keys should be shared across all microservices"
        ],
        correctAnswer: "Accounts and systems should only have the minimum access rights necessary to perform their functions",
        explanation: "The principle of least privilege limits access permissions to only the essential resources required for a specific role."
      },
      {
        question: "What does the ACID acronym stand for in database management systems?",
        options: [
          "Accuracy, Consistency, Integrity, Durability",
          "Atomicity, Consistency, Isolation, Durability",
          "Availability, Concurrency, Indexing, Data",
          "Authentication, Cryptography, Identity, Directory"
        ],
        correctAnswer: "Atomicity, Consistency, Isolation, Durability",
        explanation: "ACID represents Atomicity, Consistency, Isolation, and Durability - the four key properties that guarantee reliable database transactions."
      },
      {
        question: "What is the purpose of database indexing?",
        options: [
          "To speed up data retrieval queries at the cost of additional write overhead and storage",
          "To encrypt sensitive table columns",
          "To prevent duplicate records from ever being inserted",
          "To automatically compress image and video assets"
        ],
        correctAnswer: "To speed up data retrieval queries at the cost of additional write overhead and storage",
        explanation: "Indexes create optimized search structures (like B-trees) that significantly accelerate read operations."
      },
      {
        question: "In RESTful API design, which HTTP method is typically used to update an existing resource idempotently?",
        options: [
          "POST",
          "PUT",
          "DELETE",
          "CONNECT"
        ],
        correctAnswer: "PUT",
        explanation: "PUT is designed to replace or update a resource such that identical requests produce the same outcome (idempotence)."
      },
      {
        question: "What is a deadlock in concurrent programming?",
        options: [
          "When a process consumes 100% CPU capacity",
          "A situation where two or more processes are unable to proceed because each is waiting for the other to release a resource",
          "When memory is exhausted and the operating system crashes",
          "A network timeout caused by slow internet connection"
        ],
        correctAnswer: "A situation where two or more processes are unable to proceed because each is waiting for the other to release a resource",
        explanation: "Deadlock occurs when processes hold resources while waiting for other locked resources held by another process in a circular chain."
      },
      {
        question: "Which data structure follows the First-In, First-Out (FIFO) principle?",
        options: [
          "Stack",
          "Queue",
          "Binary Search Tree",
          "Hash Table"
        ],
        correctAnswer: "Queue",
        explanation: "A Queue processes elements in the exact order they arrive: First-In, First-Out."
      },
      {
        question: "What is the primary advantage of microservices architecture over a monolithic architecture?",
        options: [
          "Easier database schema migrations across the entire application",
          "Independent deployment, scaling, and technology choices per service",
          "Lower initial infrastructure costs and zero network latency",
          "Complete elimination of distributed tracing and logging requirements"
        ],
        correctAnswer: "Independent deployment, scaling, and technology choices per service",
        explanation: "Microservices allow decoupled teams to deploy, scale, and maintain separate services independently."
      },
      {
        question: "What is the purpose of rate limiting in web applications?",
        options: [
          "To reduce the visual render time of CSS animations",
          "To control the amount of incoming requests to protect servers from overload and abusive attacks",
          "To ensure client devices download updates simultaneously",
          "To automatically purge old database records"
        ],
        correctAnswer: "To control the amount of incoming requests to protect servers from overload and abusive attacks",
        explanation: "Rate limiting prevents resource starvation, denial-of-service (DoS) attacks, and unauthorized API abuse."
      }
    ];
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
