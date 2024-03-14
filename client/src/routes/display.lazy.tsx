import { REFETCH_INTERVAL } from "@/lib/globals";
import { getDesks } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { MoveRight } from "lucide-react";

export const Route = createLazyFileRoute("/display")({
  component: Display,
});

function Display() {
  const { data: desks } = useQuery({
    queryKey: ["desks"],
    queryFn: getDesks,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
  });

  // const mostRecentIndex = desks?.filter((desk) => !!desk.clientId).sort(())

  // get desks that have a client and get the most recent one
  let mostRecentIndex;
  let mostRecentDate = new Date("December 17, 1995 03:24:00");
  if (desks) {
    for (let i = 0; i < desks.length; i++) {
      if (!desks[i].clientId) continue;

      const currDate = new Date(desks[i].updatedAt);

      if (currDate > mostRecentDate) {
        mostRecentIndex = i;
        mostRecentDate = currDate;
      }
    }
  }

  const deskDisplays = desks?.map((desk) => {
    return (
      <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-white px-8 py-3">
        <div className="flex flex-col items-center justify-center">
          <div className="text-xl text-muted-foreground">Cliente</div>
          <div className="text-9xl font-medium">{desk.client?.id || "--"}</div>
        </div>
        <MoveRight size={70} strokeWidth={1.4} color="#737373" />
        <div className="flex flex-col items-center justify-center">
          <div className="text-xl text-muted-foreground">Escritorio</div>
          <div className="text-9xl font-medium">{desk.number}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="h-screen bg-neutral-100 p-10">
      <div className="grid h-full grid-flow-col grid-cols-2 grid-rows-5 gap-x-7 gap-y-3">
        {deskDisplays}
        <div className="col-start-2 row-span-3 row-start-1 flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white p-3">
          {mostRecentIndex !== undefined ? (
            <>
              <div className="text-3xl ">Numero</div>
              <div className="text-[11rem] font-medium text-green-600">
                {desks![mostRecentIndex].clientId}
              </div>
              <div className="text-3xl ">Proceda al escritorio</div>
              <div className="text-[11rem] font-medium text-green-600">
                {desks![mostRecentIndex].number}
              </div>
            </>
          ) : (
            <div className="text-wrap text-4xl">
              Bienvenidos a RL Jones Insurance
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
