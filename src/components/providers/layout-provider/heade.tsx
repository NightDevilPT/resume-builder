"use client";

import {
	Menu,
	FileText,
	CreditCard,
	Home,
	User,
	LogOut,
	User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Mock user data - replace with actual authentication logic
const useAuth = () => {
	// For demo purposes - replace with your actual auth state
	const [user, setUser] = useState<{ name: string; email: string } | null>(
		null
	);

	return {
		user,
		isAuthenticated: !!user,
		login: () => setUser({ name: "John Doe", email: "john@example.com" }),
		logout: () => setUser(null),
	};
};

const navigation = [
	{
		name: "Home",
		href: "/",
		icon: Home,
		description: "Back to homepage",
	},
	{
		name: "Templates",
		href: "/templates/admin",
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
	const { user, isAuthenticated, login, logout } = useAuth();

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
					<nav className="hidden xl:flex items-center space-x-4">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Button
									key={item.name}
									asChild
									variant={isActive ? "secondary" : "ghost"}
									size="sm"
								>
									<Link
										href={item.href}
										className="flex items-center gap-2"
									>
										<item.icon className="h-4 w-4" />
										{item.name}
									</Link>
								</Button>
							);
						})}
					</nav>

					{/* Right Side - User Auth & Create Resume */}
					<div className="flex items-center gap-4">
						{/* Desktop - Create Resume Button */}
						<div className="hidden xl:flex">
							<Button asChild size="sm">
								<Link href="/create-resume">Create Resume</Link>
							</Button>
						</div>

						{/* Desktop - User Authentication */}
						<div className="hidden xl:flex items-center gap-2">
							{isAuthenticated ? (
								<div className="flex items-center gap-3">
									{/* User Avatar with Dropdown */}
									<div className="relative group">
										<Button
											variant="ghost"
											size="sm"
											className="flex items-center gap-2 rounded-full"
										>
											<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
												<UserIcon className="h-4 w-4 text-primary" />
											</div>
											<span className="text-sm font-medium">
												{user?.name?.split(" ")[0]}
											</span>
										</Button>

										{/* Dropdown Menu */}
										<div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-popover p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg">
											<div className="flex flex-col space-y-1">
												<Link
													href="/dashboard"
													className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
												>
													<User className="h-4 w-4" />
													Dashboard
												</Link>
												<Link
													href="/profile"
													className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
												>
													<User className="h-4 w-4" />
													Profile
												</Link>
												<button
													onClick={logout}
													className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent text-destructive"
												>
													<LogOut className="h-4 w-4" />
													Sign Out
												</button>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<Button asChild variant="ghost" size="sm">
										<Link href="/login">Sign In</Link>
									</Button>
									<Button asChild size="sm">
										<Link href="/signup">Sign Up</Link>
									</Button>
								</div>
							)}
						</div>
					</div>

					{/* Mobile Menu */}
					<div className="flex xl:hidden items-center gap-2">
						{/* Create Resume Button - Mobile */}
						<Button asChild size="sm" className="mr-2">
							<Link href="/create-resume">Create</Link>
						</Button>

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
									{isAuthenticated && (
										<div className="border-b py-4">
											<div className="flex items-center gap-3 px-3">
												<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
													<UserIcon className="h-5 w-5 text-primary" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">
														{user?.name}
													</p>
													<p className="text-xs text-muted-foreground truncate">
														{user?.email}
													</p>
												</div>
											</div>
										</div>
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
									<div className="border-t pt-6 space-y-3">
										{isAuthenticated ? (
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
														<User className="h-4 w-4" />
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
													variant="outline"
													className="w-full justify-start gap-2 text-destructive"
													onClick={() => {
														logout();
														setIsOpen(false);
													}}
												>
													<LogOut className="h-4 w-4" />
													Sign Out
												</Button>
											</>
										) : (
											<>
												<Button
													asChild
													variant="outline"
													className="w-full justify-start gap-2"
													onClick={() =>
														setIsOpen(false)
													}
												>
													<Link href="/login">
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
													<Link href="/signup">
														<User className="h-4 w-4" />
														Sign Up
													</Link>
												</Button>
											</>
										)}

										{/* Mobile Create Resume Button */}
										<Button
											asChild
											className="w-full justify-center gap-2 mt-4"
											onClick={() => setIsOpen(false)}
										>
											<Link href="/create-resume">
												<FileText className="h-4 w-4" />
												Create Resume
											</Link>
										</Button>
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
