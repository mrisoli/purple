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
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/empty-state';
import { FormField } from '@/components/form-field';
import { FormTextarea } from '@/components/form-textarea';
import { StripeCheckout } from '@/components/stripe-checkout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DEBOUNCE_DELAY, debounce, validation } from '@/lib/utils';

type Project = {
  _id: string;
  name: string;
  description: string;
  buddyId?: string;
  createdAt: number;
};

type ActionType = {
  _id: string;
  type: string;
  message: string;
  createdAt: number;
  user?: { name: string } | null;
  project?: { name: string } | null;
};

type User = {
  premium: boolean;
};

type DashboardContentProps = {
  user: ReturnType<typeof useUser>['user'];
  currentUser: User | null | undefined;
  projects: Project[] | undefined;
  recentActions: ActionType[] | undefined;
  onCreateProject: (e: React.FormEvent) => Promise<void>;
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  projectDescription: string;
  setProjectDescription: (desc: string) => void;
  formErrors: { projectName?: string; projectDescription?: string };
};

// Helper components to reduce complexity
function DashboardHeader({
  user,
  currentUser,
}: {
  user: DashboardContentProps['user'];
  currentUser: User | null | undefined;
}) {
  return (
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
  );
}

function StatsCards({
  stats,
  currentUser,
}: {
  stats: {
    totalProjects: number;
    activeProjects: number;
    withBuddies: number;
    recentActionsCount: number;
  };
  currentUser: User | null | undefined;
}) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Projects</CardTitle>
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
          <CardTitle className="font-medium text-sm">With Buddies</CardTitle>
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
          <CardTitle className="font-medium text-sm">Need Buddies</CardTitle>
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
          <CardTitle className="font-medium text-sm">Recent Actions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.recentActionsCount}</div>
          <p className="text-muted-foreground text-xs">
            Latest progress updates
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectsSection({
  projects,
  showCreateForm,
  setShowCreateForm,
  onCreateProject,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  formErrors,
}: {
  projects: Project[] | undefined;
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
  onCreateProject: (e: React.FormEvent) => Promise<void>;
  projectName: string;
  setProjectName: (name: string) => void;
  projectDescription: string;
  setProjectDescription: (desc: string) => void;
  formErrors: { projectName?: string; projectDescription?: string };
}) {
  return (
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

      {showCreateForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onCreateProject}>
              <FormField
                error={formErrors.projectName}
                id="projectName"
                label="Project Name"
                maxLength={100}
                onChange={setProjectName}
                placeholder="e.g., Learn Spanish, Build a side project..."
                required
                showCharCount
                value={projectName}
              />
              <FormTextarea
                description="What are you trying to achieve? (optional)"
                id="projectDescription"
                label="Description"
                maxLength={500}
                onChange={setProjectDescription}
                placeholder="Describe your goal and why it matters to you..."
                rows={3}
                showCharCount
                value={projectDescription}
              />
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

      <div className="space-y-4">
        {projects === undefined &&
          Array.from({ length: 2 }, (_, i) => (
            <Card key={`loading-skeleton-${i + 1}`}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        {projects !== undefined && projects.length === 0 && (
          <EmptyState
            action={{
              label: 'Create Your First Project',
              onClick: () => setShowCreateForm(true),
            }}
            description="Create your first project to start your accountability journey!"
            icon={Target}
            title="No projects yet"
          />
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
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
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
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <Button asChild size="sm">
                    <Link href={`/projects/${project._id}`}>View Project</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

function RecentActivitySection({
  recentActions,
}: {
  recentActions: ActionType[] | undefined;
}) {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-xl">Recent Activity</h2>
      <div className="space-y-4">
        {recentActions === undefined &&
          Array.from({ length: 3 }, (_, i) => (
            <Card key={`activity-skeleton-${i + 1}`}>
              <CardContent className="py-4">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        {recentActions !== undefined && recentActions.length === 0 && (
          <EmptyState
            description="Start logging progress updates to see your activity timeline!"
            icon={Activity}
            title="No activity yet"
          />
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
  );
}

function UpgradePrompt({
  currentUser,
  stats,
}: {
  currentUser: User | null | undefined;
  stats: { totalProjects: number };
}) {
  if (currentUser?.premium || stats.totalProjects < 1) {
    return null;
  }

  return (
    <Card className="mt-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="text-lg">Unlock More Projects</CardTitle>
        <CardDescription>
          You've used your free project! Upgrade to Premium to create unlimited
          projects and get more features.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <StripeCheckout
          buttonText="Upgrade Now - $9/month"
          priceId={
            process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_premium'
          }
        />
        <Button asChild variant="outline">
          <Link href="/pricing">View All Plans</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function DashboardContent({
  user,
  currentUser,
  projects,
  recentActions,
  onCreateProject,
  showCreateForm,
  setShowCreateForm,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  formErrors,
}: DashboardContentProps) {
  const stats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter((p) => !p.buddyId).length || 0,
    withBuddies: projects?.filter((p) => p.buddyId).length || 0,
    recentActionsCount: recentActions?.length || 0,
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <DashboardHeader currentUser={currentUser} user={user} />
      <StatsCards currentUser={currentUser} stats={stats} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProjectsSection
          formErrors={formErrors}
          onCreateProject={onCreateProject}
          projectDescription={projectDescription}
          projectName={projectName}
          projects={projects}
          setProjectDescription={setProjectDescription}
          setProjectName={setProjectName}
          setShowCreateForm={setShowCreateForm}
          showCreateForm={showCreateForm}
        />
        <RecentActivitySection recentActions={recentActions} />
      </div>

      <UpgradePrompt currentUser={currentUser} stats={stats} />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{
    projectName?: string;
    projectDescription?: string;
  }>({});

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

  // Validation handlers
  const validateProjectName = useCallback((name: string) => {
    const error = validation.projectName(name);
    setFormErrors((prev) => ({ ...prev, projectName: error || undefined }));
    return !error;
  }, []);

  const debouncedValidateProjectName = useCallback(
    debounce(validateProjectName, DEBOUNCE_DELAY),
    []
  );

  const handleProjectNameChange = useCallback(
    (name: string) => {
      setProjectName(name);
      if (name.trim()) {
        debouncedValidateProjectName(name);
      } else {
        setFormErrors((prev) => ({ ...prev, projectName: undefined }));
      }
    },
    [debouncedValidateProjectName]
  );

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateProjectName(projectName);

    if (!isNameValid) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      await createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
      });
      setProjectName('');
      setProjectDescription('');
      setFormErrors({});
      setShowCreateForm(false);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create project. Please try again.'
      );
    }
  };

  return (
    <>
      <Authenticated>
        <DashboardContent
          currentUser={currentUser}
          formErrors={formErrors}
          onCreateProject={handleCreateProject}
          projectDescription={projectDescription}
          projectName={projectName}
          projects={projects}
          recentActions={recentActions}
          setProjectDescription={setProjectDescription}
          setProjectName={handleProjectNameChange}
          setShowCreateForm={setShowCreateForm}
          showCreateForm={showCreateForm}
          user={user}
        />
      </Authenticated>
      <Unauthenticated>
        <div className="container mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="mb-4 font-bold text-2xl">Sign in to continue</h1>
          <p className="mb-8 text-muted-foreground">
            Please sign in to access your accountability dashboard.
          </p>
          <SignInButton mode="modal">
            <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Sign In
            </button>
          </SignInButton>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Card key={`auth-skeleton-${i + 1}`}>
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
