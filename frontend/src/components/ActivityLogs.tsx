import { $api } from "@/lib/api";
import { components } from "@/lib/v1";
import { Calendar, TrendingUp } from "lucide-react";

interface ActivityLogsProps {
    activity: components["schemas"]["Activity"];
}

export function ActivityLogs({ activity }: ActivityLogsProps) {
    const logs = $api.useQuery("get", "/api/activities/logs", {
        params: {
            query: {
                activityId: activity.id
            }
        }
    });

    if (logs.isLoading) {
        return <div className="text-sm text-muted-foreground animate-pulse">Loading logs...</div>;
    }

    if (logs.isError || !logs.data) {
        return <div className="text-sm text-destructive">Error loading logs</div>;
    }

    if (logs.data.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No logs yet. Start tracking your progress!</p>
            </div>
        );
    }

    // Sort logs by date (newest first)
    const sortedLogs = [...logs.data].sort((a, b) =>
        new Date(b.date!).getTime() - new Date(a.date!).getTime()
    );

    // Calculate stats
    const total = sortedLogs.reduce((sum, log) => sum + (log.value || 0), 0);
    const average = total / sortedLogs.length;

    return (
        <div className="space-y-4">
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="text-xs text-muted-foreground mb-1">Total</div>
                    <div className="text-2xl font-bold text-primary">{total.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">{activity.unit}</div>
                </div>
                <div className="bg-gradient-to-br from-chart-1/10 to-chart-1/5 rounded-lg p-4 border border-chart-1/20">
                    <div className="text-xs text-muted-foreground mb-1">Average</div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--chart-1)' }}>{average.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">{activity.unit}</div>
                </div>
                <div className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-lg p-4 border border-chart-2/20">
                    <div className="text-xs text-muted-foreground mb-1">Entries</div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--chart-2)' }}>{sortedLogs.length}</div>
                    <div className="text-xs text-muted-foreground">logs</div>
                </div>
            </div>

            {/* Logs List */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Recent Entries</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {sortedLogs.map((log) => (
                        <div
                            key={log.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">
                                        {new Date(log.date!).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(log.date!).toLocaleDateString('en-US', { weekday: 'long' })}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-primary">{log.value}</div>
                                <div className="text-xs text-muted-foreground">{activity.unit}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
