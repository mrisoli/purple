"use client";

import { api } from "@purple/backend/convex/_generated/api";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
	useMutation,
} from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
	ArrowLeft, 
	Users, 
	Mail, 
	Plus, 
	Activity, 
	CheckCircle, 
	Clock,
	UserPlus,
	Target
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Id } from "@purple/backend/convex/_generated/dataModel";

export default function ProjectPage() {
	const { user } = useUser();
	const params = useParams();
	const projectId = params.id as Id<"projects">;
	
	const [showInviteForm, setShowInviteForm] = useState(false);
	const [showActionForm, setShowActionForm] = useState(false);
	const [buddyEmail, setBuddyEmail] = useState("");
	const [actionType, setActionType] = useState("progress_update");
	const [actionMessage, setActionMessage] = useState("");

	// Queries and mutations
	const project = useQuery(api.projects.get, { projectId });
	const actions = useQuery(api.actions.listByProject, { projectId });
	const currentUser = useQuery(api.users.current);
	const inviteBuddy = useMutation(api.projects.inviteBuddy);
	const createAction = useMutation(api.actions.create);

	const handleInviteBuddy = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!buddyEmail.trim()) return;
		
		try {
			await inviteBuddy({
				projectId,
				buddyEmail: buddyEmail.trim(),
			});
			setBuddyEmail("");
			setShowInviteForm(false);
		} catch (error) {
			console.error("Error inviting buddy:", error);
			// In a real app, we'd show a toast/notification here
		}
	};

	const handleCreateAction = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!actionMessage.trim()) return;
		
		try {
			await createAction({
				projectId,
				type: actionType,
				message: actionMessage.trim(),
			});
			setActionMessage("");
			setShowActionForm(false);
		} catch (error) {
			console.error("Error creating action:", error);
			// In a real app, we'd show a toast/notification here
		}
	};

	if (project === undefined) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<div className="space-y-6">
					<Skeleton className="h-8 w-64" />
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
				<div className="text-center py-16">
					<h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
					<p className="text-muted-foreground mb-8">
						This project doesn't exist or you don't have access to it.
					</p>
					<Button asChild>
						<Link href="/dashboard">
							<ArrowLeft className="h-4 w-4 mr-2" />
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
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-4">
							<Button variant="outline" size="sm" asChild>
								<Link href="/dashboard">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Dashboard
								</Link>
							</Button>
							<div>
								<h1 className="text-3xl font-bold">{project.name}</h1>
								<p className="text-muted-foreground">{project.description}</p>
							</div>
						</div>
						<UserButton />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Action Log */}
							<Card>
								<CardHeader>
									<div className="flex justify-between items-center">
										<CardTitle className="flex items-center gap-2">
											<Activity className="h-5 w-5" />
											Action Log
										</CardTitle>
										<Button 
											onClick={() => setShowActionForm(!showActionForm)}
											size="sm"
										>
											<Plus className="h-4 w-4 mr-2" />
											Log Progress
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									{/* Create Action Form */}
									{showActionForm && (
										<Card className="mb-4">
											<CardHeader>
												<CardTitle className="text-lg">Log Your Progress</CardTitle>
											</CardHeader>
											<CardContent>
												<form onSubmit={handleCreateAction} className="space-y-4">
													<div>
														<Label htmlFor="actionType">Type</Label>
														<select
															id="actionType"
															value={actionType}
															onChange={(e) => setActionType(e.target.value)}
															className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
														>
															<option value="progress_update">Progress Update</option>
															<option value="milestone_reached">Milestone Reached</option>
															<option value="challenge_faced">Challenge Faced</option>
															<option value="help_needed">Help Needed</option>
														</select>
													</div>
													<div>
														<Label htmlFor="actionMessage">Message</Label>
														<Input
															id="actionMessage"
															value={actionMessage}
															onChange={(e) => setActionMessage(e.target.value)}
															placeholder="What did you accomplish? What challenges did you face?"
															required
														/>
													</div>
													<div className="flex gap-2">
														<Button type="submit" size="sm">
															Log Action
														</Button>
														<Button
															type="button"
															size="sm"
															variant="outline"
															onClick={() => setShowActionForm(false)}
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
										{actions === undefined ? (
											// Loading skeletons
											Array.from({ length: 3 }).map((_, i) => (
												<div key={i} className="flex gap-3 p-4 border rounded-lg">
													<Skeleton className="h-4 w-4 rounded-full" />
													<div className="flex-1">
														<Skeleton className="h-4 w-3/4 mb-2" />
														<Skeleton className="h-3 w-1/2" />
													</div>
												</div>
											))
										) : actions.length === 0 ? (
											<div className="text-center py-8">
												<Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
												<h3 className="text-lg font-medium mb-2">No actions yet</h3>
												<p className="text-muted-foreground">
													Start logging your progress to build your accountability timeline!
												</p>
											</div>
										) : (
											actions.map((action) => (
												<div key={action._id} className="flex gap-3 p-4 border rounded-lg">
													<div className="mt-1">
														{action.type === "milestone_reached" ? (
															<CheckCircle className="h-4 w-4 text-green-600" />
														) : action.type === "challenge_faced" ? (
															<Clock className="h-4 w-4 text-amber-600" />
														) : action.type === "help_needed" ? (
															<UserPlus className="h-4 w-4 text-red-600" />
														) : (
															<Activity className="h-4 w-4 text-blue-600" />
														)}
													</div>
													<div className="flex-1">
														<div className="flex justify-between items-start mb-1">
															<p className="text-sm font-medium">
																{action.user?.name || "Someone"}
															</p>
															<p className="text-xs text-muted-foreground">
																{new Date(action.createdAt).toLocaleString()}
															</p>
														</div>
														<p className="text-sm text-muted-foreground mb-1">
															{action.type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
														</p>
														<p className="text-sm">{action.message}</p>
													</div>
												</div>
											))
										)}
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
										<p className="text-sm font-medium text-muted-foreground">Created</p>
										<p className="text-sm">{new Date(project.createdAt).toLocaleDateString()}</p>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">Status</p>
										<div className="flex items-center gap-2 mt-1">
											{project.buddyId ? (
												<div className="flex items-center text-green-600">
													<Users className="h-4 w-4 mr-1" />
													<span className="text-sm">Active with Buddy</span>
												</div>
											) : (
												<div className="flex items-center text-amber-600">
													<Clock className="h-4 w-4 mr-1" />
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
										<div className="text-center py-4">
											<Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
											<h3 className="text-lg font-medium mb-2">Buddy Connected!</h3>
											<p className="text-muted-foreground">
												Your accountability buddy is helping you stay on track.
											</p>
										</div>
									) : (
										<div>
											{!showInviteForm ? (
												<div className="text-center py-4">
													<Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
													<h3 className="text-lg font-medium mb-2">Invite a Buddy</h3>
													<p className="text-muted-foreground mb-4">
														Get someone to help keep you accountable!
													</p>
													<Button 
														onClick={() => setShowInviteForm(true)}
														size="sm"
													>
														<UserPlus className="h-4 w-4 mr-2" />
														Invite Buddy
													</Button>
												</div>
											) : (
												<form onSubmit={handleInviteBuddy} className="space-y-4">
													<div>
														<Label htmlFor="buddyEmail">Buddy Email</Label>
														<Input
															id="buddyEmail"
															type="email"
															value={buddyEmail}
															onChange={(e) => setBuddyEmail(e.target.value)}
															placeholder="friend@example.com"
															required
														/>
													</div>
													<div className="flex gap-2">
														<Button type="submit" size="sm">
															Send Invite
														</Button>
														<Button
															type="button"
															size="sm"
															variant="outline"
															onClick={() => setShowInviteForm(false)}
														>
															Cancel
														</Button>
													</div>
												</form>
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
										<span className="text-sm text-muted-foreground">Total Actions</span>
										<span className="text-sm font-medium">{actions?.length || 0}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">Milestones</span>
										<span className="text-sm font-medium">
											{actions?.filter(a => a.type === "milestone_reached").length || 0}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">Progress Updates</span>
										<span className="text-sm font-medium">
											{actions?.filter(a => a.type === "progress_update").length || 0}
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
					<h1 className="text-2xl font-bold mb-4">Sign in to continue</h1>
					<p className="text-muted-foreground mb-8">
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
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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