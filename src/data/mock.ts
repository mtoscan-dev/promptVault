import { Prompt } from '@/types';

// Static IDs to prevent hydration mismatch
const ID_1 = '59b22341-3d4d-4e9a-b0c2-1234567890ab';
const ID_1_V1 = '0c64ffeb-1234-5678-90ab-cdef12345678';
const ID_1_V2 = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

export const initialPrompts: Prompt[] = [
  {
    id: ID_1,
    title: 'Code Review Assistant',
    description: 'Prompt for reviewing code and suggesting improvements',
    tags: ['coding', 'debugging'],
    versions: [
      {
        id: ID_1_V1,
        content: 'Review this code and provide suggestions for improvement. Focus on performance, readability, and best practices.',
        createdAt: new Date('2024-01-15'),
        versionNumber: 1,
      },
      {
        id: ID_1_V2,
        content: 'Act as a senior developer. Review this code thoroughly and provide detailed feedback on: 1) Performance optimizations 2) Code readability 3) Best practices 4) Potential bugs 5) Security concerns',
        createdAt: new Date('2024-02-20'),
        versionNumber: 2,
      },
    ],
    currentVersionId: '',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    title: 'Creative Story Writer',
    description: 'Generate creative stories based on prompts',
    tags: ['creative', 'writing'],
    versions: [
      {
        id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
        content: 'Write a creative story about the following topic. Be imaginative and engaging.',
        createdAt: new Date('2024-01-20'),
        versionNumber: 1,
      },
    ],
    currentVersionId: '',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
    title: 'API Documentation Generator',
    description: 'Generate comprehensive API documentation',
    tags: ['api', 'coding', 'frontend'],
    versions: [
      {
        id: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234',
        content: 'Generate detailed API documentation for the following endpoints. Include request/response examples, parameters, and error codes.',
        createdAt: new Date('2024-02-01'),
        versionNumber: 1,
      },
    ],
    currentVersionId: '',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'f6a7b8c9-d0e1-2345-6789-0abcdef12345',
    title: 'Data Analysis Helper',
    description: 'Analyze datasets and provide insights',
    tags: ['analysis', 'summary'],
    versions: [
      {
        id: 'a7b8c9d0-e1f2-3456-7890-abcdef123456',
        content: 'Analyze this data and provide key insights, trends, and actionable recommendations.',
        createdAt: new Date('2024-02-10'),
        versionNumber: 1,
      },
    ],
    currentVersionId: '',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
];

// Set currentVersionId for initial prompts
initialPrompts.forEach(prompt => {
  if (!prompt.currentVersionId && prompt.versions.length > 0) {
    prompt.currentVersionId = prompt.versions[prompt.versions.length - 1].id;
  }
});
