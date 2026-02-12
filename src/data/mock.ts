import { Prompt } from "@/types";

// Static IDs to prevent hydration mismatch
const ID_1 = "59b22341-3d4d-4e9a-b0c2-1234567890ab";
const ID_1_V1 = "0c64ffeb-1234-5678-90ab-cdef12345678";
const ID_1_V2 = "a1b2c3d4-e5f6-7890-1234-567890abcdef";

export const initialPrompts: Prompt[] = [
  {
    id: ID_1,
    title: "Code Review Assistant",
    description: "Prompt for reviewing code and suggesting improvements",
    tags: ["coding", "debugging"],
    versions: [
      {
        id: ID_1_V1,
        content:
          "Review this code and provide suggestions for improvement. Focus on performance, readability, and best practices.",
        createdAt: new Date("2024-01-15"),
        versionNumber: 1,
      },
      {
        id: ID_1_V2,
        content:
          "Act as a senior developer. Review this code thoroughly and provide detailed feedback on: 1) Performance optimizations 2) Code readability 3) Best practices 4) Potential bugs 5) Security concerns",
        createdAt: new Date("2024-02-20"),
        versionNumber: 2,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
    title: "Creative Story Writer",
    description: "Generate creative stories based on prompts",
    tags: ["creative", "writing"],
    versions: [
      {
        id: "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
        content:
          "Write a creative story about the following topic. Be imaginative and engaging.",
        createdAt: new Date("2024-01-20"),
        versionNumber: 1,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "d4e5f6a7-b8c9-0123-4567-890abcdef123",
    title: "API Documentation Generator",
    description: "Generate comprehensive API documentation",
    tags: ["api", "coding", "frontend"],
    versions: [
      {
        id: "e5f6a7b8-c9d0-1234-5678-90abcdef1234",
        content:
          "Generate detailed API documentation for the following endpoints. Include request/response examples, parameters, and error codes.",
        createdAt: new Date("2024-02-01"),
        versionNumber: 1,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "f6a7b8c9-d0e1-2345-6789-0abcdef12345",
    title: "Data Analysis Helper",
    description: "Analyze datasets and provide insights",
    tags: ["analysis", "summary"],
    versions: [
      {
        id: "a7b8c9d0-e1f2-3456-7890-abcdef123456",
        content:
          "Analyze this data and provide key insights, trends, and actionable recommendations.",
        createdAt: new Date("2024-02-10"),
        versionNumber: 1,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "g7h8i9j0-k1l2-3456-7890-abcdef789012",
    title: "Technical Translator",
    description: "Translate technical documentation accurately",
    tags: ["translation", "coding"],
    versions: [
      {
        id: "h8i9j0k1-l2m3-4567-8901-bcdefg123456",
        content:
          "Translate the following technical document from English to Spanish. Maintain the technical context and professional tone.",
        createdAt: new Date("2024-02-15"),
        versionNumber: 1,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "i9j0k1l2-m3n4-5678-9012-cdefgh234567",
    title: "SQL Query Assistant",
    description: "Optimize and debug SQL queries",
    tags: ["coding", "debugging", "database"],
    versions: [
      {
        id: "j0k1l2m3-n4o5-6789-0123-defghi345678",
        content:
          "I need to optimize this SQL query for better performance. It currently takes too long to execute on large datasets. Here is the query and the table schema.",
        createdAt: new Date("2024-02-18"),
        versionNumber: 1,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-02-18"),
    updatedAt: new Date("2024-02-18"),
  },
  {
    id: "k1l2m3n4-o5p6-7890-1234-efghij456789",
    title: "Productivity Coach",
    description: "Help with time management and organization",
    tags: ["education", "summary"],
    versions: [
      {
        id: "l2m3n4o5-p6q7-8901-2345-fghijk567890",
        content:
          "Act as a productivity coach. Help me structure my day and prioritize these tasks using the Eisenhower Matrix.",
        createdAt: new Date("2024-02-20"),
        versionNumber: 1,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "m3n4o5p6-q7r8-9012-3456-ghijkl678901",
    title: "Poetry Generator",
    description: "Compose beautiful poems on any theme",
    tags: ["creative", "writing"],
    versions: [
      {
        id: "n4o5p6q7-r8s9-0123-4567-hijklm789012",
        content:
          "Write a sonnet about the beauty of absolute zero and the stillness of the void. Use scientific metaphors.",
        createdAt: new Date("2024-02-22"),
        versionNumber: 1,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-02-22"),
    updatedAt: new Date("2024-02-22"),
  },
  {
    id: "o5p6q7r8-s9t0-1234-5678-ijklmn890123",
    title: "System Architect",
    description: "Design robust and scalable architectures",
    tags: ["coding", "api"],
    versions: [
      {
        id: "p6q7r8s9-t0u1-2345-6789-jklmno901234",
        content:
          "Propose a microservices architecture for a real-time collaborative code editor. Focus on scalability and low latency.",
        createdAt: new Date("2024-02-25"),
        versionNumber: 1,
      },
    ],
    currentVersionId: "",
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
  },
];

// Set currentVersionId for initial prompts
initialPrompts.forEach((prompt) => {
  if (!prompt.currentVersionId && prompt.versions.length > 0) {
    prompt.currentVersionId = prompt.versions[prompt.versions.length - 1].id;
  }
});
