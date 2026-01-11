import { $api } from "@/lib/api";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useState, ReactNode } from "react";

interface ActivityLogFormProps {
    refetch: () => void;
    trigger?: ReactNode;
    defaultActivityId?: string;
    defaultValue?: string;
    defaultDate?: string;
}

export function ActivityLogForm({
    refetch,
    trigger,
    defaultActivityId = "",
    defaultValue = "",
    defaultDate = new Date().toISOString().split('T')[0]
}: ActivityLogFormProps) {
    const [selectedActivityId, setSelectedActivityId] = useState(defaultActivityId);
    const [value, setValue] = useState(defaultValue);
    const [date, setDate] = useState(defaultDate);

    const user = $api.useQuery("get", "/api/security");
    const activities = $api.useQuery("get", "/api/activities", {
        params: { query: { userId: user.data?.id || undefined } }
    });
    const createLogMutation = $api.useMutation("post", "/api/activities/logs");

    const createLog = async () => {
        if (!value || !selectedActivityId) return alert("Please select an activity and enter a value");

        await createLogMutation.mutateAsync({
            body: {
                activityId: selectedActivityId,
                value: parseInt(value),
                date: new Date(date).toISOString(),
                userId: user.data?.id ?? null
            }
        });
        setValue(defaultValue);
        setSelectedActivityId(defaultActivityId);
        setDate(defaultDate);
        refetch();
    };

    // Group activities by goal
    const groupedActivities = activities.data?.reduce((acc, activity) => {
        const goalName = activity.goal?.name || "No Goal";
        if (!acc[goalName]) acc[goalName] = [];
        acc[goalName].push(activity);
        return acc;
    }, {} as Record<string, typeof activities.data>);

    // Get selected activity details for showing unit
    const selectedActivity = activities.data?.find(act => act.id === selectedActivityId);

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Add Activity Log</h2>

                    <div>
                        <Label htmlFor="activity">Select Activity</Label>
                        <select
                            id="activity"
                            className="w-full p-2 rounded-md border border-input bg-background"
                            value={selectedActivityId}
                            onChange={(e) => setSelectedActivityId(e.target.value)}
                        >
                            <option value="">Choose an activity...</option>
                            {groupedActivities && Object.entries(groupedActivities).map(([goalName, acts]) => (
                                <optgroup key={goalName} label={goalName}>
                                    {acts?.map(act => (
                                        <option key={act.id} value={act.id}>
                                            {act.title} ({act.unit})
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="value">
                            Value {selectedActivity && `(${selectedActivity.unit})`}
                        </Label>
                        <Input
                            id="value"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={selectedActivity ? `Enter value in ${selectedActivity.unit}` : "Enter value"}
                        />
                    </div>

                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <DialogClose asChild>
                        <Button
                            onClick={createLog}
                            disabled={createLogMutation.isPending}
                            className="w-full"
                        >
                            {createLogMutation.isPending ? "Adding..." : "Add Log"}
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
