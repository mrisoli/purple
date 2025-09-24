'use client';

import { api } from '@purple/backend/convex/_generated/api';
import type { Id } from '@purple/backend/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { 
  Activity, 
  Calendar, 
  CheckCircle, 
  Target, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectAnalyticsProps {
  projectId: Id<'projects'>;
}

export function ProjectAnalytics({ projectId }: ProjectAnalyticsProps) {
  const analytics = useQuery(api.analytics.getProjectAnalytics, { projectId });

  if (!analytics) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      icon: Activity,
      label: 'Total Actions',
      value: analytics.totalActions,
      description: 'All activities logged',
    },
    {
      icon: CheckCircle,
      label: 'Milestones',
      value: analytics.milestoneReached,
      description: 'Goals achieved',
    },
    {
      icon: Target,
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      description: 'Milestone percentage',
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: analytics.currentStreak,
      description: `${analytics.currentStreak} ${analytics.currentStreak === 1 ? 'day' : 'days'}`,
    },
  ];

  const additionalStats = [
    {
      icon: TrendingUp,
      label: 'Daily Average',
      value: analytics.avgActionsPerDay,
      description: 'Actions per day',
    },
    {
      icon: Calendar,
      label: 'Recent Activity',
      value: analytics.recentActions,
      description: 'Last 7 days',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, description }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {additionalStats.map(({ icon: Icon, label, value, description }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Insights</CardTitle>
          <CardDescription>
            Analysis of your project activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Progress Updates</p>
              <p className="text-lg font-semibold">{analytics.progressUpdates}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Challenges</p>
              <p className="text-lg font-semibold">{analytics.challengesFaced}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Help Requests</p>
              <p className="text-lg font-semibold">{analytics.helpRequests}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Days Active</p>
              <p className="text-lg font-semibold">{analytics.daysSinceCreation}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}