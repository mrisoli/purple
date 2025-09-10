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
import { Plus, Users, Target, Activity, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
	const { user } = useUser();
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	
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
		if (!projectName.trim()) return;
		
		try {
			await createProject({
				name: projectName,
				description: projectDescription,
			});
			setProjectName("");
			setProjectDescription("");
			setShowCreateForm(false);
		} catch (error) {
			console.error("Error creating project:", error);
			// In a real app, we'd show a toast/notification here
		}
	};

	const stats = {
		totalProjects: projects?.length || 0,
		activeProjects: projects?.filter(p => !p.buddyId).length || 0,
		withBuddies: projects?.filter(p => p.buddyId).length || 0,
		recentActionsCount: recentActions?.length || 0,
	};

	return (
		<>
			<Authenticated>
				<div className="container mx-auto max-w-6xl px-4 py-8">
					{/* Header */}
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-3xl font-bold">Dashboard</h1>
							<p className="text-muted-foreground">
								Welcome back, {user?.fullName || user?.firstName}! 
								{currentUser?.premium ? " (Premium)" : " (Free)"}
							</p>
						</div>
						<UserButton />
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Projects</CardTitle>
								<Target className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.totalProjects}</div>
								<p className="text-xs text-muted-foreground">
									{currentUser?.premium ? "Unlimited" : "1 max for free users"}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">With Buddies</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.withBuddies}</div>
								<p className="text-xs text-muted-foreground">
									Projects with accountability partners
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Need Buddies</CardTitle>
								<Clock className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.activeProjects}</div>
								<p className="text-xs text-muted-foreground">
									Waiting for accountability partners
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Recent Actions</CardTitle>
								<Activity className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.recentActionsCount}</div>
								<p className="text-xs text-muted-foreground">
									Latest progress updates
								</p>
							</CardContent>
						</Card>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Projects Section */}
						<div>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold">Your Projects</h2>
								<Button
									onClick={() => setShowCreateForm(!showCreateForm)}
									size="sm"
									variant="outline"
								>
									<Plus className="h-4 w-4 mr-2" />
									New Project
								</Button>
							</div>

							{/* Create Project Form */}
							{showCreateForm && (
								<Card className="mb-4">
									<CardHeader>
										<CardTitle className="text-lg">Create New Project</CardTitle>
									</CardHeader>
									<CardContent>
										<form onSubmit={handleCreateProject} className="space-y-4">
											<div>
												<Label htmlFor="projectName">Project Name</Label>
												<Input
													id="projectName"
													value={projectName}
													onChange={(e) => setProjectName(e.target.value)}
													placeholder="e.g., Learn Spanish, Build a side project..."
													required
												/>
											</div>
											<div>
												<Label htmlFor="projectDescription">Description</Label>
												<Input
													id="projectDescription"
													value={projectDescription}
													onChange={(e) => setProjectDescription(e.target.value)}
													placeholder="What are you trying to achieve?"
												/>
											</div>
											<div className="flex gap-2">
												<Button type="submit" size="sm">
													Create Project
												</Button>
												<Button
													type="button"
													size="sm"
													variant="outline"
													onClick={() => setShowCreateForm(false)}
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
								{projects === undefined ? (
									// Loading skeletons
									Array.from({ length: 2 }).map((_, i) => (
										<Card key={i}>
											<CardHeader>
												<Skeleton className="h-5 w-3/4" />
												<Skeleton className="h-4 w-1/2" />
											</CardHeader>
										</Card>
									))
								) : projects.length === 0 ? (
									<Card>
										<CardContent className="text-center py-8">
											<Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
											<h3 className="text-lg font-medium mb-2">No projects yet</h3>
											<p className="text-muted-foreground mb-4">
												Create your first project to start your accountability journey!
											</p>
											<Button onClick={() => setShowCreateForm(true)}>
												<Plus className="h-4 w-4 mr-2" />
												Create Your First Project
											</Button>
										</CardContent>
									</Card>
								) : (
									projects.map((project) => (
										<Card key={project._id} className="hover:shadow-md transition-shadow">
											<CardHeader>
												<div className="flex justify-between items-start">
													<div>
														<CardTitle className="text-lg">{project.name}</CardTitle>
														<CardDescription>{project.description}</CardDescription>
													</div>
													<div className="flex items-center gap-2">
														{project.buddyId ? (
															<div className="flex items-center text-green-600">
																<Users className="h-4 w-4 mr-1" />
																<span className="text-sm">Has Buddy</span>
															</div>
														) : (
															<div className="flex items-center text-amber-600">
																<Clock className="h-4 w-4 mr-1" />
																<span className="text-sm">Needs Buddy</span>
															</div>
														)}
													</div>
												</div>
											</CardHeader>
											<CardContent>
												<div className="flex justify-between items-center">
													<p className="text-sm text-muted-foreground">
														Created {new Date(project.createdAt).toLocaleDateString()}
													</p>
													<Button asChild size="sm">
														<Link href={`/projects/${project._id}`}>
															View Project
														</Link>
													</Button>
												</div>
											</CardContent>
										</Card>
									))
								)}
							</div>
						</div>

						{/* Recent Activity */}
						<div>
							<h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
							<div className="space-y-4">
								{recentActions === undefined ? (
									// Loading skeletons
									Array.from({ length: 3 }).map((_, i) => (
										<Card key={i}>
											<CardContent className="py-4">
												<Skeleton className="h-4 w-3/4 mb-2" />
												<Skeleton className="h-3 w-1/2" />
											</CardContent>
										</Card>
									))
								) : recentActions.length === 0 ? (
									<Card>
										<CardContent className="text-center py-8">
											<Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
											<h3 className="text-lg font-medium mb-2">No activity yet</h3>
											<p className="text-muted-foreground">
												Start logging progress updates to see your activity timeline!
											</p>
										</CardContent>
									</Card>
								) : (
									recentActions.map((action) => (
										<Card key={action._id}>
											<CardContent className="py-4">
												<div className="flex items-start gap-3">
													<div className="mt-1">
														{action.type === "milestone_reached" ? (
															<CheckCircle className="h-4 w-4 text-green-600" />
														) : (
															<Activity className="h-4 w-4 text-blue-600" />
														)}
													</div>
													<div className="flex-1">
														<p className="text-sm font-medium">
															{action.user?.name || "Someone"} in "{action.project?.name}"
														</p>
														<p className="text-sm text-muted-foreground">{action.message}</p>
														<p className="text-xs text-muted-foreground mt-1">
															{new Date(action.createdAt).toLocaleString()}
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
									))
								)}
							</div>
						</div>
					</div>

					{/* Upgrade Prompt for Free Users */}
					{!currentUser?.premium && stats.totalProjects >= 1 && (
						<Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
							<CardHeader>
								<CardTitle className="text-lg">Unlock More Projects</CardTitle>
								<CardDescription>
									You've used your free project! Upgrade to Premium to create unlimited projects and get more features.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button asChild>
									<Link href="/pricing">
										Upgrade to Premium
									</Link>
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</Authenticated>
			<Unauthenticated>
				<div className="container mx-auto max-w-md px-4 py-16 text-center">
					<h1 className="text-2xl font-bold mb-4">Sign in to continue</h1>
					<p className="text-muted-foreground mb-8">
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
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							{Array.from({ length: 4 }).map((_, i) => (
								<Card key={i}>
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
