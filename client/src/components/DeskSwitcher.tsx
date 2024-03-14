import { useDeskId, useSetDeskId } from "@/contexts/DeskContext";
import { getDesks } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar as AvatarShadcn } from "@/components/ui/avatar";
import Avatar from "boring-avatars";

export default function DeskSwicher() {
  const deskId = useDeskId();
  const setDeskId = useSetDeskId();

  const { data: desks } = useQuery({
    queryKey: ["desks"],
    queryFn: getDesks,
  });

  const deskSelectItems = desks?.map((desk) => (
    <SelectItem className="pr-8" value={String(desk.id)} key={desk.id}>
      <div className="flex gap-4">
        <AvatarShadcn className="h-5 w-5">
          <div className="aspect-square h-full w-full">
            <Avatar
              size={20}
              name={desk.id.toString()}
              variant="marble"
              square
            />
          </div>
        </AvatarShadcn>
        Desk {desk.number}
      </div>
      {/* <div>Desk {desk.number}</div> */}
    </SelectItem>
  ));

  return (
    <Select
      value={String(deskId)}
      onValueChange={(value) => setDeskId(Number(value))}
    >
      <SelectTrigger className="w-auto gap-24 px-4 py-0 font-medium">
        <SelectValue className="" placeholder="Select a desk number" />
      </SelectTrigger>
      <SelectContent className="">{deskSelectItems}</SelectContent>
    </Select>
  );
}
