import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { $api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateNewActivity } from '@/components/CreateNewActivity';
import { ActivityLogForm } from '@/components/ActivityLogForm';
import { ActivityLogs } from '@/components/ActivityLogs';
import { ArrowLeft, Activity as ActivityIcon, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type ActivitiesSearch = {
    goalId?: string
}

export const Route = createFileRoute('/activities')({
    component: ActivitiesPage,
    validateSearch: (search: Record<string, unknown>): ActivitiesSearch => {
        return {
            goalId: (search.goalId as string) || undefined,
        }
    },
})

function ActivitiesPage() {
    const { goalId } = Route.useSearch()
    const navigate = useNavigate()

    const user = $api.useQuery("get", "/api/security")
    const goals = $api.useQuery("get", "/api/goals", {
        params: { query: { userId: user.data?.id || undefined } },
        enabled: user.isSuccess
    })

    const activities = $api.useQuery("get", "/api/activities", {
        params: {
            query: {
                goalId: goalId || undefined
            }
        }
    })

    const selectedGoal = goals.data?.find(g => g.id === goalId)

    if (activities.isLoading) {
        return <div className="container mx-auto max-w-7xl px-4 py-8">Loading...</div>
    }

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
            <Link to="/">
                <Button className="mb-4" variant="ghost">
                    <ArrowLeft className="w-5 h-5" /> back
                </Button>
            </Link>
    
            {/* Filter section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <CardTitle className="text-lg">Filter by Goal</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={!goalId ? "default" : "outline"}
                            onClick={() => navigate({ to: '/activities' })}
                            size="sm"
                        >
                            All Goals
                        </Button>
                        {goals.data?.map(goal => (
                            <Button
                                key={goal.id}
                                variant={goalId === goal.id ? "default" : "outline"}
                                onClick={() => navigate({ to: '/activities', search: { goalId: goal.id } })}
                                size="sm"
                            >
                                {goal.name}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Header */}
            <div className="flex items-center gap-4">

                <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                        {selectedGoal ? selectedGoal.name : 'All Activities'}
                    </h1>
                    {selectedGoal && (
                        <p className="text-muted-foreground">
                            {new Date(selectedGoal.start!).toLocaleDateString()} → {new Date(selectedGoal.finish!).toLocaleDateString()}
                        </p>
                    )}
                </div>
                {selectedGoal && (
                    <CreateNewActivity refetch={activities.refetch} goal={selectedGoal} />
                )}
            </div>


            {/* Activities List */}
            <div className="space-y-4">
                {activities.data?.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <ActivityIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No activities found{selectedGoal ? ' for this goal' : ''}.</p>
                            {selectedGoal && <p className="text-sm mt-2">Create your first activity above!</p>}
                        </CardContent>
                    </Card>
                ) : (
                    activities.data?.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))
                )}
            </div>
        </div>
    )
}

function ActivityCard({ activity }: { activity: any }) {
    const [showLogs, setShowLogs] = useState(false)
    const logs = $api.useQuery("get", "/api/activities/logs", {
        params: {
            query: {
                activityId: activity.id
            }
        }
    })

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <ActivityIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{activity.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {activity.goal?.name} • Unit: {activity.unit}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ActivityLogForm
                            defaultActivityId={activity.id}
                            refetch={logs.refetch}
                            trigger={
                                <Button size="sm" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Log
                                </Button>
                            }
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLogs(!showLogs)}
                        >
                            {showLogs ? 'Hide Logs' : 'View Logs'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            {showLogs && (
                <CardContent>
                    <ActivityLogs activity={activity} />
                </CardContent>
            )}
        </Card>
    )
}
