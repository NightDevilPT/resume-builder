"use client";

import {
	Menu,
	FileText,
	CreditCard,
	Home,
	User,
	LogOut,
	User as UserIcon,
	Settings,
	LayoutDashboard,
	CheckCircle2,
	AlertCircle,
	Shield,
	Loader2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
	{
		name: "Home",
		href: "/",
		icon: Home,
		description: "Back to homepage",
	},
	{
		name: "Templates",
		href: "/templates",
		icon: FileText,
		description: "Professional resume templates",
	},
	{
		name: "Pricing",
		href: "/pricing",
		icon: CreditCard,
		description: "Plans & pricing",
	},
];

export function HeaderComponent() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const {
		user,
		isAuthenticated,
		isLoading,
		logout: logoutUser,
	} = useAuthContext();

	// Handle logout
	const handleLogout = async () => {
		try {
			// Show loading toast
			const loadingToast = toast.loading("Signing out...");

			// Call logout (clears cookies and local state)
			await logoutUser();

			// Dismiss loading toast
			toast.dismiss(loadingToast);

			// Show success message
			toast.success("Logged out successfully", {
				description: "You have been signed out of your account",
			});

			// Redirect to home
			router.push("/");
		} catch (error) {
			console.error("[LOGOUT_ERROR]:", error);
			toast.error("Failed to logout", {
				description: "Please try again",
			});
		}
	};

	// Get user initials for avatar fallback
	const getUserInitials = () => {
		if (!user) return "U";
		return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
	};

	// Get full name
	const getFullName = () => {
		if (!user) return "";
		return user.fullName || `${user.firstName} ${user.lastName}`;
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<FileText className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold">ResumeCraft</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden xl:flex items-center space-x-1">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Button
									key={item.name}
									asChild
									variant={isActive ? "secondary" : "ghost"}
									size="sm"
									className={cn(
										"gap-2",
										isActive && "font-semibold"
									)}
								>
									<Link href={item.href}>
										<item.icon className="h-4 w-4" />
										{item.name}
									</Link>
								</Button>
							);
						})}
					</nav>

					{/* Right Side - User Auth & Create Resume */}
					<div className="flex items-center gap-3">
						{/* Desktop - Create Resume Button */}
						{isAuthenticated && (
							<div className="hidden xl:flex">
								<Button asChild size="sm" className="gap-2">
									<Link href="/create-resume">
										<FileText className="h-4 w-4" />
										Create Resume
									</Link>
								</Button>
							</div>
						)}

						{/* Desktop - User Authentication */}
						<div className="hidden xl:flex items-center">
							{isLoading ? (
								<Button
									variant="ghost"
									size="sm"
									disabled
									className="gap-2"
								>
									<Loader2 className="h-4 w-4 animate-spin" />
									Loading...
								</Button>
							) : isAuthenticated && user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="gap-2 h-10"
										>
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={
														user.avatar || undefined
													}
													alt={getFullName()}
												/>
												<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
													{getUserInitials()}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col items-start">
												<span className="text-sm font-medium">
													{user.firstName}
												</span>
												{user.role === "admin" && (
													<Badge
														variant="secondary"
														className="h-4 text-[10px] px-1"
													>
														Admin
													</Badge>
												)}
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-64"
										align="end"
									>
										<DropdownMenuLabel>
											<div className="flex justify-start items-center gap-2">
												<div>
													<Avatar className="h-8 w-8">
														<AvatarImage
															src={
																user.avatar ||
																undefined
															}
															alt={getFullName()}
														/>
														<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
															{getUserInitials()}
														</AvatarFallback>
													</Avatar>
												</div>
												<div>
													<div className="flex items-center gap-2">
														<p className="text-sm font-medium">
															{getFullName()}
														</p>
														{user.emailVerified ? (
															<CheckCircle2 className="h-4 w-4 text-green-500" />
														) : (
															<AlertCircle className="h-4 w-4 text-yellow-500" />
														)}
													</div>
													<p className="text-xs text-muted-foreground font-normal">
														{user.email}
													</p>
													{!user.emailVerified && (
														<Badge
															variant="outline"
															className="w-fit text-yellow-600 border-yellow-600"
														>
															Email not verified
														</Badge>
													)}
												</div>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem asChild>
												<Link
													href="/dashboard"
													className="cursor-pointer"
												>
													<LayoutDashboard className="mr-2 h-4 w-4" />
													<span>Dashboard</span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link
													href="/profile"
													className="cursor-pointer"
												>
													<User className="mr-2 h-4 w-4" />
													<span>Profile</span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link
													href="/settings"
													className="cursor-pointer"
												>
													<Settings className="mr-2 h-4 w-4" />
													<span>Settings</span>
												</Link>
											</DropdownMenuItem>
										</DropdownMenuGroup>
										{user.role === "admin" && (
											<>
												<DropdownMenuSeparator />
												<DropdownMenuGroup>
													<DropdownMenuLabel className="text-xs text-muted-foreground">
														Admin
													</DropdownMenuLabel>
													<DropdownMenuItem asChild>
														<Link
															href="/templates/admin"
															className="cursor-pointer"
														>
															<Shield className="mr-2 h-4 w-4" />
															<span>
																Manage Templates
															</span>
														</Link>
													</DropdownMenuItem>
												</DropdownMenuGroup>
											</>
										)}
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleLogout}
											className="cursor-pointer text-destructive focus:text-destructive"
										>
											<LogOut className="mr-2 h-4 w-4" />
											<span>Sign Out</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<div className="flex items-center gap-2">
									<Button asChild variant="ghost" size="sm">
										<Link href="/auth/login">Sign In</Link>
									</Button>
									<Button asChild size="sm">
										<Link href="/auth/signup">Sign Up</Link>
									</Button>
								</div>
							)}
						</div>
					</div>

					{/* Mobile Menu */}
					<div className="flex xl:hidden items-center gap-2">
						{/* Create Resume Button - Mobile */}
						{isAuthenticated && (
							<Button asChild size="sm" className="mr-2">
								<Link href="/create-resume">
									<FileText className="h-4 w-4" />
								</Link>
							</Button>
						)}

						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="w-[280px] p-5"
							>
								<div className="flex flex-col h-full">
									{/* Mobile Navigation Header */}
									<div className="flex items-center justify-between border-b pb-4">
										<Link
											href="/"
											className="flex items-center space-x-2"
											onClick={() => setIsOpen(false)}
										>
											<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
												<FileText className="h-5 w-5 text-primary-foreground" />
											</div>
											<span className="text-xl font-bold">
												ResumeCraft
											</span>
										</Link>
									</div>

									{/* User Info in Mobile */}
									{isLoading ? (
										<div className="border-b py-4 px-3">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
												<div className="flex-1 space-y-2">
													<div className="h-4 bg-muted rounded animate-pulse w-3/4" />
													<div className="h-3 bg-muted rounded animate-pulse w-1/2" />
												</div>
											</div>
										</div>
									) : (
										isAuthenticated &&
										user && (
											<div className="border-b py-4">
												<div className="flex items-center gap-3 px-3">
													<Avatar className="h-10 w-10">
														<AvatarImage
															src={
																user.avatar ||
																undefined
															}
															alt={getFullName()}
														/>
														<AvatarFallback className="bg-primary/10 text-primary font-semibold">
															{getUserInitials()}
														</AvatarFallback>
													</Avatar>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<p className="text-sm font-medium truncate">
																{getFullName()}
															</p>
															{user.emailVerified ? (
																<CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
															) : (
																<AlertCircle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
															)}
														</div>
														<p className="text-xs text-muted-foreground truncate">
															{user.email}
														</p>
														{user.role ===
															"admin" && (
																<Badge
																	variant="secondary"
																	className="mt-1 h-4 text-[10px] w-fit"
																>
																	Admin
																</Badge>
															)}
													</div>
												</div>
											</div>
										)
									)}

									{/* Mobile Navigation */}
									<nav className="flex-1 py-6">
										<div className="space-y-2">
											{navigation.map((item) => {
												const isActive =
													pathname === item.href;
												return (
													<Link
														key={item.name}
														href={item.href}
														onClick={() =>
															setIsOpen(false)
														}
														className={cn(
															"flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all hover:bg-accent",
															isActive
																? "bg-accent text-foreground"
																: "text-foreground/70"
														)}
													>
														<item.icon className="h-5 w-5" />
														<div className="flex flex-col">
															<span>
																{item.name}
															</span>
															<span className="text-xs text-muted-foreground">
																{
																	item.description
																}
															</span>
														</div>
													</Link>
												);
											})}
										</div>
									</nav>

									{/* Mobile Auth Buttons */}
									<div className="border-t pt-6 space-y-2">
										{isAuthenticated && user ? (
											<>
												<Button
													asChild
													variant="outline"
													className="w-full justify-start gap-2"
													onClick={() =>
														setIsOpen(false)
													}
												>
													<Link href="/dashboard">
														<LayoutDashboard className="h-4 w-4" />
														Dashboard
													</Link>
												</Button>
												<Button
													asChild
													variant="outline"
													className="w-full justify-start gap-2"
													onClick={() =>
														setIsOpen(false)
													}
												>
													<Link href="/profile">
														<UserIcon className="h-4 w-4" />
														Profile
													</Link>
												</Button>
												<Button
													asChild
													variant="outline"
													className="w-full justify-start gap-2"
													onClick={() =>
														setIsOpen(false)
													}
												>
													<Link href="/settings">
														<Settings className="h-4 w-4" />
														Settings
													</Link>
												</Button>
												{user.role === "admin" && (
													<>
														<div className="py-2">
															<p className="text-xs text-muted-foreground px-3">
																Admin
															</p>
														</div>
														<Button
															asChild
															variant="outline"
															className="w-full justify-start gap-2"
															onClick={() =>
																setIsOpen(false)
															}
														>
															<Link href="/admin/templates">
																<Shield className="h-4 w-4" />
																Manage Templates
															</Link>
														</Button>
													</>
												)}
												<div className="pt-2">
													<Button
														variant="outline"
														className="w-full justify-start gap-2 text-destructive hover:text-destructive"
														onClick={() => {
															handleLogout();
															setIsOpen(false);
														}}
													>
														<LogOut className="h-4 w-4" />
														Sign Out
													</Button>
												</div>
											</>
										) : (
											<>
												<Button
													asChild
													variant="outline"
													className="w-full justify-center gap-2"
													onClick={() =>
														setIsOpen(false)
													}
												>
													<Link href="/auth/login">
														<User className="h-4 w-4" />
														Sign In
													</Link>
												</Button>
												<Button
													asChild
													className="w-full justify-center gap-2"
													onClick={() =>
														setIsOpen(false)
													}
												>
													<Link href="/auth/signup">
														Sign Up
													</Link>
												</Button>
											</>
										)}

										{/* Mobile Create Resume Button */}
										{isAuthenticated && (
											<div className="pt-2">
												<Button
													asChild
													className="w-full justify-center gap-2"
													onClick={() =>
														setIsOpen(false)
													}
												>
													<Link href="/create-resume">
														<FileText className="h-4 w-4" />
														Create Resume
													</Link>
												</Button>
											</div>
										)}
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}
