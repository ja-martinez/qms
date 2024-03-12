// import { Input } from "./ui/input";

// export default function TableFilter({ columnFilters, setColumnFilters }) {
//   const clientId = columnFilters.find((f) => f.id === "id")?.value || "";

//   const onFilterChange = (id, value) =>
//     setColumnFilters((prev) =>
//       prev
//         .filter((f) => f.id !== id)
//         .concat({
//           id,
//           value,
//         }),
//     );

//   return (
//     <div className="flex justify-between pb-4">
//       <h2 className="text-3xl font-medium tracking-tight">Clients</h2>
//       <Input
//         placeholder="Filter clients..."
//         value={clientId}
//         onChange={(e) => onFilterChange("id", e.target.value)}
//         className="max-w-sm"
//       />
//     </div>
//   );
// }
