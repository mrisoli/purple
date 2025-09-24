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
import { ProgressRing } from '@/components/progress-ring';

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Progress</CardTitle>
            <CardDescription>
              Visual representation of your milestone completion
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <ProgressRing
              progress={analytics.completionRate}
              size={140}
              strokeWidth={12}
              label="Completed"
              color={analytics.completionRate >= 75 ? 'hsl(142, 76%, 36%)' : 
                     analytics.completionRate >= 50 ? 'hsl(48, 96%, 53%)' : 
                     'hsl(220, 14%, 96%)'}
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
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Progress Updates</span>
                </div>
                <span className="font-semibold">{analytics.progressUpdates}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Milestones</span>
                </div>
                <span className="font-semibold">{analytics.milestoneReached}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Challenges</span>
                </div>
                <span className="font-semibold">{analytics.challengesFaced}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Help Requests</span>
                </div>
                <span className="font-semibold">{analytics.helpRequests}</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Days Active</span>
                <span className="font-medium">{analytics.daysSinceCreation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}