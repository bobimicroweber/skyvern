import { getClient } from "@/api/AxiosClient";
import { TaskApiResponse } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { basicTimeFormat } from "@/util/timeFormat";
import { LatestScreenshot } from "./LatestScreenshot";
import { useCredentialGetter } from "@/hooks/useCredentialGetter";

function RunningTasks() {
  const navigate = useNavigate();
  const credentialGetter = useCredentialGetter();

  const { data: runningTasks } = useQuery<Array<TaskApiResponse>>({
    queryKey: ["tasks", "running"],
    queryFn: async () => {
      const client = await getClient(credentialGetter);
      return client
        .get("/tasks", {
          params: {
            task_status: "running",
          },
        })
        .then((response) => response.data);
    },
  });

  if (runningTasks?.length === 0) {
    return <div>No running tasks</div>;
  }

  return runningTasks?.map((task) => {
    return (
      <Card
        key={task.task_id}
        className="hover:bg-muted/50 cursor-pointer"
        onClick={() => {
          navigate(`/tasks/${task.task_id}`);
        }}
      >
        <CardHeader>
          <CardTitle>{task.task_id}</CardTitle>
          <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis">
            {task.request.url}
          </CardDescription>
        </CardHeader>
        <CardContent>
          Latest screenshot:
          <div className="w-40 h-40 border-2">
            <LatestScreenshot id={task.task_id} />
          </div>
        </CardContent>
        <CardFooter>Created: {basicTimeFormat(task.created_at)}</CardFooter>
      </Card>
    );
  });
}

export { RunningTasks };
