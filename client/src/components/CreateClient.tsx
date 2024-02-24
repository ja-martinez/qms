import { Button } from "./ui/button";

export default function CreateClient() {
  function handleCreateInsClient() {}

  function handleCreateMvsClient() {}

  return (
    <div className="flex gap-4">
      <Button onClick={handleCreateInsClient} className="basis-0 grow">Insurance</Button>
      <Button onClick={handleCreateMvsClient} className="basis-0 grow">Motor Vehicle Services</Button>
    </div>
  );
}
