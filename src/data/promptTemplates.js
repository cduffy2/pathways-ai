export const promptTemplates = [
  {
    id: 'segment-deep-dive',
    name: 'Segment Deep Dive',
    description: 'Deep dive into a specific population segment using the Pathways methodology',
    fields: [
      {
        id: 'segment_name',
        label: 'Segment Name',
        placeholder: 'e.g. Rural women, 18–35',
        type: 'text',
        required: true,
      },
      {
        id: 'country',
        label: 'Country',
        placeholder: 'e.g. Senegal, Nigeria, Ethiopia',
        type: 'text',
        required: true,
      },
    ],
    buildPrompt: (values) =>
      `Provide a detailed segment deep dive for the "${values.segment_name}" population segment in ${values.country} using the Pathways methodology. Include vulnerability profile, health outcomes, barriers to access, and recommended intervention approaches.`,
  },
];

export const availableModels = [
  {
    id: 'gpt-5-2',
    label: 'GPT-5.2 — latest (default)',
    description: 'Best overall performance for health data queries and synthesis.',
    isDefault: true,
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Fast and efficient for structured data retrieval.',
    isDefault: false,
  },
  {
    id: 'claude-sonnet',
    label: 'Claude Sonnet',
    description: 'Strong at nuanced analysis and long-form synthesis.',
    isDefault: false,
  },
];
