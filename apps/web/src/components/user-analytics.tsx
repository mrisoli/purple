'use client';

import { api } from '@purple/backend/convex/_generated/api';
import { useQuery } from 'convex/react';
import {
  Activity,
  Calendar,
  CheckCircle,
  FolderOpen,
  Target,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserAnalytics() {
  const analytics = useQuery(api.analytics.getUserAnalytics);

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="space-y-2" key={i}>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      icon: FolderOpen,
      label: 'Total Projects',
      value: analytics.totalProjects,
      color: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'With Buddy',
      value: analytics.projectsWithBuddy,
      color: 'text-green-600',
    },
    {
      icon: Activity,
      label: 'Total Actions',
      value: analytics.totalActions,
      color: 'text-purple-600',
    },
    {
      icon: CheckCircle,
      label: 'Milestones',
      value: analytics.totalMilestones,
      color: 'text-orange-600',
    },
    {
      icon: Target,
      label: 'Avg per Project',
      value: analytics.avgActionsPerProject,
      color: 'text-teal-600',
    },
    {
      icon: Calendar,
      label: 'Most Active Day',
      value: analytics.mostActiveDay,
      color: 'text-pink-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Your Analytics</CardTitle>
        <CardDescription>
          Overview of your accountability journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div className="space-y-2 text-center" key={label}>
              <div className="flex items-center justify-center">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="font-bold text-2xl">{value}</div>
              <p className="text-muted-foreground text-sm">{label}</p>
            </div>
          ))}
        </div>

        {analytics.totalProjects > 0 && (
          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Buddy Match Rate</span>
              <span className="font-semibold text-sm">
                {analytics.buddyMatchRate}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${analytics.buddyMatchRate}%` }}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {analytics.projectsWithBuddy} of {analytics.totalProjects}{' '}
              projects have accountability buddies
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
