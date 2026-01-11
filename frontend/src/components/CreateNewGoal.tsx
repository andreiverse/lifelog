import { $api } from "@/lib/api";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";

interface NewGoalProps {
    refetch: () => void;
    variant?: "default" | "outline";
}

export function CreateNewGoal({ refetch, variant = "default" }: NewGoalProps) {
    const [name, setName] = useState("");
    const [start, setStart] = useState(""); // ISO date string
    const [finish, setFinish] = useState(""); // ISO date string

    const user = $api.useQuery("get", "/api/security");
    const createGoalMutation = $api.useMutation("post", "/api/goals");

    const createGoal = async () => {
        if (!name || !start || !finish) return alert("All fields are required");

        await createGoalMutation.mutateAsync({
            body: {
                name,
                start,
                finish,
                userId: user.data?.id ?? null
            }
        })
        setName("");
        setStart("");
        setFinish("");
        refetch();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>New goal</Button>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <Label htmlFor="name">Goal Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter goal name"
                    />
                </div>

                <div>
                    <Label htmlFor="start">Start Date</Label>
                    <Input
                        id="start"
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="finish">Finish Date</Label>
                    <Input
                        id="finish"
                        type="datetime-local"
                        value={finish}
                        onChange={(e) => setFinish(e.target.value)}
                    />
                </div>

                <DialogClose asChild>
                    <Button onClick={createGoal} disabled={createGoalMutation.isPending}>
                        {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}