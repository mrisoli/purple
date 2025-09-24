'use client';

import {
  BookOpen,
  Code,
  DollarSign,
  Dumbbell,
  Heart,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'health' | 'learning' | 'career' | 'finance' | 'personal';
  examples: string[];
}

interface GoalTemplatesProps {
  onSelectTemplate: (template: GoalTemplate) => void;
  onSkip: () => void;
}

const templates: GoalTemplate[] = [
  {
    id: 'fitness',
    name: 'Fitness & Health',
    description: 'Build healthy habits and achieve your fitness goals',
    icon: Dumbbell,
    category: 'health',
    examples: [
      'Exercise 4 times per week',
      'Run a 5K marathon',
      'Lose 10 pounds in 3 months',
      'Learn a new sport',
      'Complete a fitness challenge',
    ],
  },
  {
    id: 'learning',
    name: 'Learning & Education',
    description: 'Master new skills and expand your knowledge',
    icon: BookOpen,
    category: 'learning',
    examples: [
      'Read 12 books this year',
      'Learn a new language',
      'Complete an online course',
      'Get a professional certification',
      'Practice a musical instrument daily',
    ],
  },
  {
    id: 'coding',
    name: 'Programming & Development',
    description: 'Level up your technical skills and build projects',
    icon: Code,
    category: 'career',
    examples: [
      'Build a full-stack web application',
      'Contribute to open source projects',
      'Learn a new programming language',
      'Complete coding challenges daily',
      'Launch a side project',
    ],
  },
  {
    id: 'finance',
    name: 'Financial Goals',
    description: 'Improve your financial health and build wealth',
    icon: DollarSign,
    category: 'finance',
    examples: [
      'Save $1000 in 6 months',
      'Start investing in index funds',
      'Create a monthly budget',
      'Pay off credit card debt',
      'Build an emergency fund',
    ],
  },
  {
    id: 'personal',
    name: 'Personal Development',
    description: 'Work on yourself and build better habits',
    icon: Heart,
    category: 'personal',
    examples: [
      'Meditate 10 minutes daily',
      'Journal every morning',
      'Practice gratitude',
      'Improve communication skills',
      'Declutter and organize home',
    ],
  },
  {
    id: 'custom',
    name: 'Custom Goal',
    description: 'Create your own unique accountability project',
    icon: Target,
    category: 'personal',
    examples: [
      'Set your own specific objective',
      'Define measurable milestones',
      'Create a timeline that works for you',
      'Track progress your way',
    ],
  },
];

export function GoalTemplates({
  onSelectTemplate,
  onSkip,
}: GoalTemplatesProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="font-bold text-2xl">Choose Your Goal Category</h3>
        <p className="text-muted-foreground">
          Select a template to get started quickly, or create a custom goal
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              className="hover:-translate-y-1 cursor-pointer transition-all hover:shadow-lg"
              key={template.id}
              onClick={() => onSelectTemplate(template)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium text-sm">Examples:</p>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    {template.examples.slice(0, 3).map((example, index) => (
                      <li className="flex items-center gap-1" key={index}>
                        <span className="h-1 w-1 rounded-full bg-current" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button onClick={onSkip} variant="outline">
          Skip Templates - Create Custom Project
        </Button>
      </div>
    </div>
  );
}
