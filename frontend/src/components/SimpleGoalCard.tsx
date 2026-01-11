import { components } from "@/lib/v1";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface SimpleGoalCardProps {
    goal: components["schemas"]["Goal"];
}

export function SimpleGoalCard({ goal }: SimpleGoalCardProps) {
    const formatDate = (date: string | undefined) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link to="/activities" search={{ goalId: goal.id! }}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-primary/10">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{goal.name}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {formatDate(goal.start)} → {formatDate(goal.finish)}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
}
