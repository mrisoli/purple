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
  Zap,
} from 'lucide-react';
import { ProgressRing } from '@/components/progress-ring';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Constants for analytics thresholds and display
const HIGH_COMPLETION_THRESHOLD = 75;
const MEDIUM_COMPLETION_THRESHOLD = 50;
const LOADING_SKELETON_COUNT = 4;

function getCompletionColor(completionRate: number): string {
  if (completionRate >= HIGH_COMPLETION_THRESHOLD) {
    return 'hsl(142, 76%, 36%)';
  }
  if (completionRate >= MEDIUM_COMPLETION_THRESHOLD) {
    return 'hsl(48, 96%, 53%)';
  }
  return 'hsl(220, 14%, 96%)';
}

type ProjectAnalyticsProps = {
  projectId: Id<'projects'>;
};

export function ProjectAnalytics({ projectId }: ProjectAnalyticsProps) {
  const analytics = useQuery(api.analytics.getProjectAnalytics, { projectId });

  if (!analytics) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: LOADING_SKELETON_COUNT }, (_, i) => ({
          id: `project-skeleton-${i}`,
        })).map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-1 h-8 w-12" />
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, description }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{value}</div>
              <p className="text-muted-foreground text-xs">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {additionalStats.map(({ icon: Icon, label, value, description }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{value}</div>
              <p className="text-muted-foreground text-xs">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Progress</CardTitle>
            <CardDescription>
              Visual representation of your milestone completion
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <ProgressRing
              color={getCompletionColor(analytics.completionRate)}
              label="Completed"
              progress={analytics.completionRate}
              size={140}
              strokeWidth={12}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity Breakdown</CardTitle>
            <CardDescription>
              Distribution of your project activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Progress Updates</span>
                </div>
                <span className="font-semibold">
                  {analytics.progressUpdates}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Milestones</span>
                </div>
                <span className="font-semibold">
                  {analytics.milestoneReached}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm">Challenges</span>
                </div>
                <span className="font-semibold">
                  {analytics.challengesFaced}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Help Requests</span>
                </div>
                <span className="font-semibold">{analytics.helpRequests}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Days Active</span>
                <span className="font-medium">
                  {analytics.daysSinceCreation}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
