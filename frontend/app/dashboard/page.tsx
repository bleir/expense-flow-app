"use client";

import { useQuery } from "@tanstack/react-query";
import CategoryForm from "./components/CategoryForm";
import { categoriesApi } from "@/lib/api";

export default function DashboardPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Manage your expense categories</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <CategoryForm />

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Your Categories</h2>
            <p className="text-muted-foreground">
              {categories?.length || 0} categories
            </p>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Loading categories...</p>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-full bg-${category.color}-500`}
                    style={{
                      backgroundColor:
                        category.color === "yellow"
                          ? "#eab308"
                          : category.color === "blue"
                            ? "#3b82f6"
                            : category.color === "green"
                              ? "#22c55e"
                              : "#6b7280",
                    }}
                  />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {category.color}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                No categories yet. Create your first category to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
