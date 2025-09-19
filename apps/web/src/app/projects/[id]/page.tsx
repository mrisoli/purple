'use client';

import { SignInButton, UserButton } from '@clerk/nextjs';
import { api } from '@purple/backend/convex/_generated/api';
import type { Id } from '@purple/backend/convex/_generated/dataModel';
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from 'convex/react';
import {
  Activity,
  ArrowLeft,
  CheckCircle,
  Clock,
  Mail,
  Plus,
  Target,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const getActionIcon = (actionType: string) => {
  if (actionType === 'milestone_reached') {
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  }
  if (actionType === 'challenge_faced') {
    return <Clock className="h-4 w-4 text-amber-600" />;
  }
  if (actionType === 'help_needed') {
    return <UserPlus className="h-4 w-4 text-red-600" />;
  }
  return <Activity className="h-4 w-4 text-blue-600" />;
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [buddyEmail, setBuddyEmail] = useState('');
  const [actionType, setActionType] = useState('progress_update');
  const [actionMessage, setActionMessage] = useState('');

  // Queries and mutations
  const project = useQuery(api.projects.get, { projectId });
  const actions = useQuery(api.actions.listByProject, { projectId });
  const _currentUser = useQuery(api.users.current);
  const inviteBuddy = useMutation(api.projects.inviteBuddy);
  const createAction = useMutation(api.actions.create);

  const handleInviteBuddy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buddyEmail.trim()) {
      toast.error('Please enter a buddy email address');
      return;
    }

    try {
      await inviteBuddy({
        projectId,
        buddyEmail: buddyEmail.trim(),
      });
      setBuddyEmail('');
      setShowInviteForm(false);
      toast.success('Buddy invited successfully!');
    } catch (error) {
      console.error('Error inviting buddy:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to invite buddy. Please try again.'
      );
    }
  };

  const handleCreateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionMessage.trim()) {
      toast.error('Please enter a message for your progress update');
      return;
    }

    try {
      await createAction({
        projectId,
        type: actionType,
        message: actionMessage.trim(),
      });
      setActionMessage('');
      setShowActionForm(false);
      toast.success('Progress logged successfully!');
    } catch (error) {
      console.error('Error creating action:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to log progress. Please try again.'
      );
    }
  };

  if (project === undefined) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="py-16 text-center">
          <h1 className="mb-4 font-bold text-2xl">Project Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            This project doesn't exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Authenticated>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="font-bold text-3xl">{project.name}</h1>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </div>
            <UserButton />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Action Log */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Action Log
                    </CardTitle>
                    <Button
                      onClick={() => setShowActionForm(!showActionForm)}
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Log Progress
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Create Action Form */}
                  {showActionForm && (
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Log Your Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form
                          className="space-y-4"
                          onSubmit={handleCreateAction}
                        >
                          <div>
                            <Label htmlFor="actionType">Type</Label>
                            <select
                              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              id="actionType"
                              onChange={(e) => setActionType(e.target.value)}
                              value={actionType}
                            >
                              <option value="progress_update">
                                Progress Update
                              </option>
                              <option value="milestone_reached">
                                Milestone Reached
                              </option>
                              <option value="challenge_faced">
                                Challenge Faced
                              </option>
                              <option value="help_needed">Help Needed</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="actionMessage">Message</Label>
                            <Input
                              id="actionMessage"
                              onChange={(e) => setActionMessage(e.target.value)}
                              placeholder="What did you accomplish? What challenges did you face?"
                              required
                              value={actionMessage}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" type="submit">
                              Log Action
                            </Button>
                            <Button
                              onClick={() => setShowActionForm(false)}
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

                  {/* Actions List */}
                  <div className="space-y-4">
                    {(() => {
                      if (actions === undefined) {
                        return Array.from({ length: 3 }, (_, i) => (
                          <div
                            className="flex gap-3 rounded-lg border p-4"
                            key={`action-skeleton-${i + 1}`}
                          >
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="mb-2 h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        ));
                      }

                      if (actions.length === 0) {
                        return (
                          <div className="py-8 text-center">
                            <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 font-medium text-lg">
                              No actions yet
                            </h3>
                            <p className="text-muted-foreground">
                              Start logging your progress to build your
                              accountability timeline!
                            </p>
                          </div>
                        );
                      }

                      return actions.map((action) => (
                        <div
                          className="flex gap-3 rounded-lg border p-4"
                          key={action._id}
                        >
                          <div className="mt-1">
                            {getActionIcon(action.type)}
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 flex items-start justify-between">
                              <p className="font-medium text-sm">
                                {action.user?.name || 'Someone'}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {new Date(action.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <p className="mb-1 text-muted-foreground text-sm">
                              {action.type
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </p>
                            <p className="text-sm">{action.message}</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Project Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">
                      Created
                    </p>
                    <p className="text-sm">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">
                      Status
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {project.buddyId ? (
                        <div className="flex items-center text-green-600">
                          <Users className="mr-1 h-4 w-4" />
                          <span className="text-sm">Active with Buddy</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600">
                          <Clock className="mr-1 h-4 w-4" />
                          <span className="text-sm">Waiting for Buddy</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accountability Buddy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Accountability Buddy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project.buddyId ? (
                    <div className="py-4 text-center">
                      <Users className="mx-auto mb-4 h-12 w-12 text-green-600" />
                      <h3 className="mb-2 font-medium text-lg">
                        Buddy Connected!
                      </h3>
                      <p className="text-muted-foreground">
                        Your accountability buddy is helping you stay on track.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {showInviteForm ? (
                        <form
                          className="space-y-4"
                          onSubmit={handleInviteBuddy}
                        >
                          <div>
                            <Label htmlFor="buddyEmail">Buddy Email</Label>
                            <Input
                              id="buddyEmail"
                              onChange={(e) => setBuddyEmail(e.target.value)}
                              placeholder="friend@example.com"
                              required
                              type="email"
                              value={buddyEmail}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" type="submit">
                              Send Invite
                            </Button>
                            <Button
                              onClick={() => setShowInviteForm(false)}
                              size="sm"
                              type="button"
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="py-4 text-center">
                          <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                          <h3 className="mb-2 font-medium text-lg">
                            Invite a Buddy
                          </h3>
                          <p className="mb-4 text-muted-foreground">
                            Get someone to help keep you accountable!
                          </p>
                          <Button
                            onClick={() => setShowInviteForm(true)}
                            size="sm"
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Buddy
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Total Actions
                    </span>
                    <span className="font-medium text-sm">
                      {actions?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Milestones
                    </span>
                    <span className="font-medium text-sm">
                      {actions?.filter((a) => a.type === 'milestone_reached')
                        .length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Progress Updates
                    </span>
                    <span className="font-medium text-sm">
                      {actions?.filter((a) => a.type === 'progress_update')
                        .length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="container mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="mb-4 font-bold text-2xl">Sign in to continue</h1>
          <p className="mb-8 text-muted-foreground">
            Please sign in to access this project.
          </p>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </AuthLoading>
    </>
  );
}
