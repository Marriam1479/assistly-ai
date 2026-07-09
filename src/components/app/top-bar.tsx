import { Bell, Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";

export function TopBar() {
  const { settings, setSettings } = useApp();
  const dark = settings.theme === "dark";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-3 backdrop-blur-md sm:px-5">
      <SidebarTrigger className="shrink-0" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold sm:text-base">
          AI Workplace Productivity Assistant
        </h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        onClick={() => setSettings({ theme: dark ? "light" : "dark" })}
      >
        {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start gap-0.5">
            <span className="text-sm font-medium">Welcome to Workplace AI</span>
            <span className="text-xs text-muted-foreground">Explore the AI tools to boost your workflow.</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start gap-0.5">
            <span className="text-sm font-medium">Tip: Save your best outputs</span>
            <span className="text-xs text-muted-foreground">Saved documents are available anytime.</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="icon" aria-label="Settings" asChild>
        <Link to="/settings">
          <SettingsIcon className="size-5" />
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="shrink-0 rounded-full outline-none ring-ring focus-visible:ring-2" aria-label="Account">
            <Avatar className="size-9">
              <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
                AI
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex-col items-start">
            <span className="text-sm font-medium">Alex Morgan</span>
            <span className="text-xs font-normal text-muted-foreground">alex@company.com</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/help">Help & Support</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}