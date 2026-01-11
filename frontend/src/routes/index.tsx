import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({ component: App })
import "@/lib/api";
import { $api } from '@/lib/api';

"use client";

import { CreateNewGoal } from '@/components/CreateNewGoal';
import { SimpleGoalCard } from '@/components/SimpleGoalCard';
import { TodayLogs } from '@/components/TodayLogs';
import { Target } from 'lucide-react';

function App() {
  const user = $api.useQuery("get", "/api/security");

  const goals = $api.useQuery("get", "/api/goals", undefined, {
    enabled: user.isSuccess
  });

  if (!goals.isEnabled)
    return <></>;

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
        {goals.isLoading && (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading your goals...</div>
          </div>
        )}

        {goals.isSuccess && (
          <>
            {/* Goals Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Your Goals</h2>
                  <p className="text-muted-foreground mt-1">Active goals and objectives</p>
                </div>
                <CreateNewGoal refetch={goals.refetch} />
              </div>

              {goals.data.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed border-border">
                  <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first goal to start tracking!</p>
                  <CreateNewGoal refetch={goals.refetch} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goals.data.map(goal => <SimpleGoalCard key={goal.id} goal={goal} />)}
                </div>
              )}
            </section>

            {/* Today's Activities Section */}
            <section>
              <TodayLogs />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
