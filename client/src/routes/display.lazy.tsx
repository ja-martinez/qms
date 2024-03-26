import { createLazyFileRoute } from "@tanstack/react-router";
import { REFETCH_INTERVAL } from "@/lib/globals";
import { getDesks } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import soundUrl from "@/assets/notification.mp3";
import { Howl } from "howler";
import { useState, Fragment, useRef, useEffect } from "react";
import { Desk } from "@/lib/types";

export const Route = createLazyFileRoute("/display")({
  component: Display,
});

const sound = new Howl({
  src: [soundUrl],
});

function Display() {
  const [prevDesks, setPrevDesks] = useState<Desk[] | undefined>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      <Fragment key={desk.id}>
        <div className="flex items-center justify-center bg-white text-[2rem] xl:text-[3.5rem] 2xl:text-[4rem]">
          <div>{desk.number}</div>
        </div>
        <div className="flex items-center justify-center bg-white text-[2rem] xl:text-[3.5rem] 2xl:text-[4rem]">
          <div>{desk.clientId ? desk.clientId : "--"}</div>
        </div>
      </Fragment>
    );
  });

  useEffect(() => {
    // Check if there's a new desk
    if (desks && prevDesks) {
      for (let i = 0; i < desks.length; i++) {
        if (desks[i]?.clientId !== prevDesks[i]?.clientId) {
          sound.play();
          setPrevDesks(desks);

          const mostRecentNode = document.getElementById("most-recent");

          if (!timeoutRef.current) {
            intervalRef.current = setInterval(() => {
              if (
                mostRecentNode?.style.backgroundColor ===
                "rgb(255 255 255 / var(--tw-bg-opacity))"
              ) {
                mostRecentNode!.style.backgroundColor =
                  "rgb(134 239 172 / var(--tw-bg-opacity))";
              } else {
                mostRecentNode!.style.backgroundColor =
                  "rgb(255 255 255 / var(--tw-bg-opacity))";
              }
            }, 800);
          } else {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            clearInterval(intervalRef.current!);
            mostRecentNode!.style.backgroundColor =
              "rgb(255 255 255 / var(--tw-bg-opacity))";

            intervalRef.current = null;
            timeoutRef.current = null;
          }, 30000);

          // now exit because only one change is relevant
          break;
        }
      }
    }

    if (!prevDesks && desks) {
      setPrevDesks(desks);
    }
  }, [desks, prevDesks]);

  return (
    <div
      className="h-screen overflow-hidden bg-neutral-100"
      onClick={() => sound.play()}
    >
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
        <div
          id="most-recent"
          className="flex flex-col items-center justify-start gap-8 bg-white p-7 leading-none"
        >
          {mostRecentIndex !== undefined ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="text-[3rem] font-medium 2xl:text-[5rem]">
                  Numero
                </div>
                <div className="text-[17rem] font-bold 2xl:text-[19rem]">
                  {desks![mostRecentIndex].clientId}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="text-[3rem] font-medium 2xl:text-[5rem]">
                  Proceda al escritorio
                </div>
                <div className="text-[17rem] font-bold 2xl:text-[19rem]">
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
