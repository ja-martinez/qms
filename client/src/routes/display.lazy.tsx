import { createLazyFileRoute } from "@tanstack/react-router";
import { REFETCH_INTERVAL } from "@/lib/globals";
import { getDesks } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import soundUrl from "@/assets/notification.mp3"
import { Howl } from "howler";
import { useState } from "react";
import { Desk } from "@/lib/types";

export const Route = createLazyFileRoute("/display")({
  component: Display,
});

const sound = new Howl({
  src: [soundUrl]
})

function Display() {
  const [prevDesks, setPrevDesks] = useState<Desk[] | undefined>([])

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
      <>
        <div className="flex items-center justify-center bg-white text-[2rem] xl:text-[3.5rem]">
          <div>{desk.number}</div>
        </div>
        <div className="flex items-center justify-center bg-white text-[2rem] xl:text-[3.5rem]">
          <div>{desk.clientId ? desk.clientId : "--"}</div>
        </div>
      </>
    );
  });

  if (desks && prevDesks) {
    console.log(desks, prevDesks)
    console.log(desks[3].clientId)
    for (let i=0; i<desks.length; i++) {
      if (desks[i]?.clientId !== prevDesks[i]?.clientId) {
        sound.play()
        setPrevDesks(desks)
      }
    }
  }

  if (!prevDesks && desks) {
    setPrevDesks(desks)
  }


  return (
    <div className="h-screen bg-neutral-100 overflow-hidden">
      <div className="grid h-full grid-cols-2 gap-1.5 bg-black">
        {/* All desks section */}
        <div className="grid grid-cols-2 grid-rows-8 gap-y-1.5">
          <div className="flex items-center justify-center bg-white text-4xl">
            <div>Escritorio</div>
          </div>
          <div className="flex items-center justify-center bg-white text-4xl">
            <div>Cliente</div>
          </div>
          {deskDisplays}
        </div>
        {/* Most recent client section */}
        <div className="flex flex-col items-center justify-start bg-white p-7 gap-8 leading-none">
          {mostRecentIndex !== undefined ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="text-[3rem] ">Numero</div>
                <div className="text-[15rem] font-medium">
                  {desks![mostRecentIndex].clientId}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="text-[3rem] ">Proceda al escritorio</div>
                <div className="text-[15rem] font-medium">
                  {desks![mostRecentIndex].number}
                </div>
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
