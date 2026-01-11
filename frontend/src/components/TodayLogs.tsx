import { $api } from "@/lib/api";
import { Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ActivityLogForm } from "./ActivityLogForm";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export function TodayLogs() {
    const user = $api.useQuery("get", "/api/security");
    const todayLogs = $api.useQuery("get", "/api/activities/logs/today", {
        params: {
            query: {
                userId: user.data?.id || undefined
            }
        },
        enabled: user.isSuccess
    });

    if (!todayLogs.isEnabled || todayLogs.isLoading) {
        return <div className="text-muted-foreground">Loading today's logs...</div>;
    }

    if (todayLogs.isError || !todayLogs.data) {
        return <div className="text-destructive">Error loading today's logs</div>;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Today's Activity</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <ActivityLogForm
                        refetch={todayLogs.refetch}
                        trigger={
                            <Button className="gap-2" size="lg">
                                <Plus className="w-5 h-5" />
                                Quick Add for Today
                            </Button>
                        }
                    />
                </div>
            </CardHeader>
            <CardContent>
                {todayLogs.data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No activities logged today yet!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayLogs.data.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-primary/10">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{log.activity?.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {log.activity?.goal?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-primary">{log.value}</div>
                                    <div className="text-xs text-muted-foreground">{log.activity?.unit}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
