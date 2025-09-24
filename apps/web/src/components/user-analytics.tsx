'use client';

import { api } from '@purple/backend/convex/_generated/api';
import { useQuery } from 'convex/react';
import { 
  Activity, 
  Calendar,
  CheckCircle,
  FolderOpen,
  Target,
  Users
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        
        {analytics.totalProjects > 0 && (
          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Buddy Match Rate</span>
              <span className="text-sm font-semibold">{analytics.buddyMatchRate}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${analytics.buddyMatchRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.projectsWithBuddy} of {analytics.totalProjects} projects have accountability buddies
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}