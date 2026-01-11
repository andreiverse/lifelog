import { components } from "@/lib/v1";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { ArrowDown, ArrowUp, Activity as ActivityIcon } from "lucide-react";
import { Button } from "./ui/button";
import { $api } from "@/lib/api";
import { CreateNewActivity } from "./CreateNewActivity";
import { ActivityLogForm } from "./ActivityLogForm";
import { Plus } from "lucide-react";
import { ActivityLogs } from "./ActivityLogs";

function ActivityItem({ activity }: { activity: components["schemas"]["Activity"] }) {
    const [showLogs, setShowLogs] = useState(false);
    const logs = $api.useQuery("get", "/api/activities/logs", {
        params: {
            query: {
                activityId: activity.id
            }
        }
    });

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
                            <p className="text-sm text-muted-foreground">Unit: {activity.unit}</p>
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
                            {showLogs ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
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
    );
}

export function GoalActivities({ goal }: { goal: components["schemas"]["Goal"] }) {
    const activities = $api.useQuery("get", "/api/activities", {
        params: {
            query: {
                goalId: goal.id
            }
        }
    });

    if (activities.isLoading) {
        return <div className="text-muted-foreground animate-pulse">Loading activities...</div>
    }

    if (activities.isError || !activities.data) {
        return <div className="text-destructive">Error loading activities</div>
    }

    return (
        <div className="space-y-4">
            <CreateNewActivity refetch={activities.refetch} goal={goal} />

            {activities.data.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No activities yet. Create your first activity to start tracking!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activities.data.map(act =>
                        <ActivityItem key={act.id} activity={act} />
                    )}
                </div>
            )}
        </div>
    );
}
export function Goal({ goal }: { goal: components["schemas"]["Goal"] }) {
    const [seeActs, setSeeActs] = useState(false);

    const formatDate = (date: string | undefined) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 border-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">{goal.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(goal.start)} → {formatDate(goal.finish)}
                        </p>
                    </div>
                    <Button
                        onClick={() => setSeeActs(v => !v)}
                        variant={seeActs ? "secondary" : "default"}
                        className="gap-2"
                    >
                        {seeActs ? (
                            <>
                                <ArrowUp className="w-4 h-4" /> Hide
                            </>
                        ) : (
                            <>
                                <ArrowDown className="w-4 h-4" /> Show
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            {seeActs && (
                <CardContent>
                    <GoalActivities goal={goal} />
                </CardContent>
            )}
        </Card>
    );
}