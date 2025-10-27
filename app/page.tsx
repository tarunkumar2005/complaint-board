"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function Home() {
  const { isAuthenticated, loading: authLoading, refetch } = useAuth();
  const {
    isAuthenticated: isAdmin,
    loading: adminLoading,
    refetch: refetchAdmin,
  } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
  });
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await refetch();
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/auth/admin/logout", { method: "POST" });
      await refetchAdmin();
      router.refresh();
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit complaint");
        setLoading(false);
        return;
      }

      setSuccess("Complaint submitted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "Medium",
      });
      setLoading(false);
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            ComplaintHub
          </span>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminLogout}
                  className="text-muted-foreground"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/admin/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Admin Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
            {!isAuthenticated && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/85 backdrop-blur-sm">
                <div className="px-6 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-7 w-7 text-primary" />
                  </div>
                  <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
                    Raise Your Complaint Easily
                  </h1>
                  <p className="mb-8 text-base text-muted-foreground">
                    Please log in to submit your complaint
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Link href="/login">
                      <Button size="lg" className="min-w-32">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="lg" variant="outline" className="min-w-32">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={`space-y-6 p-10 ${!isAuthenticated ? "opacity-25" : ""}`}
            >
              {isAuthenticated && (
                <>
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      Submit Your Complaint
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Fill out the form below to submit your complaint
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
                      {success}
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Complaint Title
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description of your complaint"
                  disabled={!isAuthenticated}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="h-12"
                  required
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Select
                    disabled={!isAuthenticated}
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category" className="h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Priority</Label>
                  <RadioGroup
                    disabled={!isAuthenticated}
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                    className="flex flex-wrap gap-4 pt-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Low" id="low" />
                      <Label htmlFor="low" className="text-sm font-normal">
                        Low
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Medium" id="medium" />
                      <Label htmlFor="medium" className="text-sm font-normal">
                        Medium
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="High" id="high" />
                      <Label htmlFor="high" className="text-sm font-normal">
                        High
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your complaint in detail..."
                  className="min-h-32 resize-none"
                  disabled={!isAuthenticated}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={!isAuthenticated || loading}
                className="h-12 w-full"
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
