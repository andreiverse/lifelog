import { $api } from "@/lib/api";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { components } from "@/lib/v1";

interface NewActivityProps {
    refetch: () => void;
    goal: components["schemas"]["Goal"]
}

export function CreateNewActivity({ refetch, goal }: NewActivityProps) {
    const [title, setTitle] = useState("");
    const [unit, setUnit] = useState(""); 

    const user = $api.useQuery("get", "/api/security");
    const createAcitityMutation = $api.useMutation("post", "/api/activities");

    const createActivity = async () => {
        if (!title || !unit) return alert("All fields are required");

        await createAcitityMutation.mutateAsync({
            body: {
                goalId: goal.id,
                title, unit,
                userId: user.data?.id ?? null
            }
        })
        setTitle("");
        setUnit("");
        refetch();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>New activity</Button>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <Label htmlFor="name">Activity Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title name"
                    />
                </div>

                <div>
                    <Label htmlFor="name">Activity Unit</Label>
                    <Input
                        id="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="Enter unit name"
                    />
                </div>

                <DialogClose asChild>
                    <Button onClick={createActivity} disabled={createAcitityMutation.isPending}>
                        {createAcitityMutation.isPending ? "Creating..." : "Create Activity"}
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}