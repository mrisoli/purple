'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { api } from '@purple/backend/convex/_generated/api';
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from 'convex/react';
import {
  Activity,
  CheckCircle,
  Clock,
  Plus,
  Target,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useUser();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Ensure user is synced in Convex
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const currentUser = useQuery(api.users.current);
  const projects = useQuery(api.projects.list);
  const recentActions = useQuery(api.actions.getRecentActions);
  const createProject = useMutation(api.projects.create);

  // Sync user on first load
  useEffect(() => {
    if (user) {
      getOrCreateUser();
    }
  }, [user, getOrCreateUser]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      return;
    }

    try {
      await createProject({
        name: projectName,
        description: projectDescription,
      });
      setProjectName('');
      setProjectDescription('');
      setShowCreateForm(false);
    } catch (_error) {
      // In a real app, we'd show a toast/notification here
    }
  };

  const stats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter((p) => !p.buddyId).length || 0,
    withBuddies: projects?.filter((p) => p.buddyId).length || 0,
    recentActionsCount: recentActions?.length || 0,
  };

  return (
    <>
      <Authenticated>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.fullName || user?.firstName}!
                {currentUser?.premium ? ' (Premium)' : ' (Free)'}
              </p>
            </div>
            <UserButton />
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Projects
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{stats.totalProjects}</div>
                <p className="text-muted-foreground text-xs">
                  {currentUser?.premium ? 'Unlimited' : '1 max for free users'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  With Buddies
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{stats.withBuddies}</div>
                <p className="text-muted-foreground text-xs">
                  Projects with accountability partners
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Need Buddies
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{stats.activeProjects}</div>
                <p className="text-muted-foreground text-xs">
                  Waiting for accountability partners
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Recent Actions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {stats.recentActionsCount}
                </div>
                <p className="text-muted-foreground text-xs">
                  Latest progress updates
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Projects Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-xl">Your Projects</h2>
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>

              {/* Create Project Form */}
              {showCreateForm && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Create New Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleCreateProject}>
                      <div>
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                          id="projectName"
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="e.g., Learn Spanish, Build a side project..."
                          required
                          value={projectName}
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectDescription">Description</Label>
                        <Input
                          id="projectDescription"
                          onChange={(e) =>
                            setProjectDescription(e.target.value)
                          }
                          placeholder="What are you trying to achieve?"
                          value={projectDescription}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" type="submit">
                          Create Project
                        </Button>
                        <Button
                          onClick={() => setShowCreateForm(false)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Projects List */}
              <div className="space-y-4">
                {projects === undefined &&
                  // Loading skeletons
                  Array.from({ length: 2 }).map((_, i) => (
                    <Card key={`loading-${i}`}>
                      <CardHeader>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                    </Card>
                  ))}
                {projects !== undefined && projects.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Target className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 font-medium text-lg">
                        No projects yet
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        Create your first project to start your accountability
                        journey!
                      </p>
                      <Button onClick={() => setShowCreateForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Project
                      </Button>
                    </CardContent>
                  </Card>
                )}
                {projects !== undefined &&
                  projects.length > 0 &&
                  projects.map((project) => (
                    <Card
                      className="transition-shadow hover:shadow-md"
                      key={project._id}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {project.name}
                            </CardTitle>
                            <CardDescription>
                              {project.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {project.buddyId ? (
                              <div className="flex items-center text-green-600">
                                <Users className="mr-1 h-4 w-4" />
                                <span className="text-sm">Has Buddy</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-amber-600">
                                <Clock className="mr-1 h-4 w-4" />
                                <span className="text-sm">Needs Buddy</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground text-sm">
                            Created{' '}
                            {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                          <Button asChild size="sm">
                            <Link href={`/projects/${project._id}`}>
                              View Project
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="mb-4 font-semibold text-xl">Recent Activity</h2>
              <div className="space-y-4">
                {recentActions === undefined &&
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={`activity-loading-${i}`}>
                      <CardContent className="py-4">
                        <Skeleton className="mb-2 h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                {recentActions !== undefined && recentActions.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 font-medium text-lg">
                        No activity yet
                      </h3>
                      <p className="text-muted-foreground">
                        Start logging progress updates to see your activity
                        timeline!
                      </p>
                    </CardContent>
                  </Card>
                )}
                {recentActions !== undefined &&
                  recentActions.length > 0 &&
                  recentActions.map((action) => (
                    <Card key={action._id}>
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {action.type === 'milestone_reached' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Activity className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {action.user?.name || 'Someone'} in "
                              {action.project?.name}"
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {action.message}
                            </p>
                            <p className="mt-1 text-muted-foreground text-xs">
                              {new Date(action.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>

          {/* Upgrade Prompt for Free Users */}
          {!currentUser?.premium && stats.totalProjects >= 1 && (
            <Card className="mt-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-lg">Unlock More Projects</CardTitle>
                <CardDescription>
                  You've used your free project! Upgrade to Premium to create
                  unlimited projects and get more features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/pricing">Upgrade to Premium</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="container mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="mb-4 font-bold text-2xl">Sign in to continue</h1>
          <p className="mb-8 text-muted-foreground">
            Please sign in to access your accountability dashboard.
          </p>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={`auth-loading-${i}`}>
                  <CardHeader>
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AuthLoading>
    </>
  );
}
