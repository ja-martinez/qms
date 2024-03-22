import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  // filterFns,
  // Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callClient, getClients } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components//ui/badge";
import { useDeskId } from "@/contexts/DeskContext";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DataTablePagination } from "./DataTablePagination";
import { REFETCH_INTERVAL } from "@/lib/globals";
// import { equal } from "assert";

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "Client Number",
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
  {
    accessorKey: "lastDesk.number",
    header: "Desk"
  },
  {
    accessorKey: "called",
    header: "Called",
    cell: ({ row }) => {
      const isCalled = Boolean(row.getValue("called"));

      if (isCalled) {
        return (
          <Badge variant="success" className="">
            Called
          </Badge>
        );
      }

      return (
        <Badge variant="secondary" className="">
          Not Called
        </Badge>
      );
    },
  },
  {
    id: "callClient",
    cell: ({ row }) => {
      const clientId = row.original.id;

      return <CallClientButton clientId={clientId} />;
    },
  },
];

function CallClientButton({ clientId }: { clientId: number }) {
  const deskId = useDeskId()!;
  const user = useUser()!;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (_e: React.SyntheticEvent) => {
      const token = await user.getIdToken();
      const client = await callClient(deskId, clientId, token);
      toast("Client has been called", {
        description: `Client number ${client?.id}`,
      });
      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["desks"] });
    },
  });

  return (
    <Button className="w-full" onClick={mutation.mutate}>
      Call Client
    </Button>
  );
}

export default function ClientTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const clients = await getClients();
      clients.sort((a, b) => {
        if (a.called !== b.called) {
          return Number(a.called) - Number(b.called);
        }

        return b.id - a.id;
      });
      return clients;
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
  });

  const clients = clientsQuery.data ? clientsQuery.data : [];

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    // filterFns: {
    //   idFilter: idFilter,
    // },
    // globalFilterFn: idFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    autoResetPageIndex: false
  });

  if (clientsQuery.status !== "success") {
    return null;
  }

  return (
    <div>
      {/* Filter / Search */}
      <div className="flex justify-between pb-4">
        <h2 className="text-3xl font-medium tracking-tight">Clients</h2>
        {/* <Input
          placeholder="Filter clients..."
          value={(table.getColumn("id")?.getFilterValue() as number) ?? ""}
          onChange={(event) => {
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          }
          className="max-w-sm"
        /> */}
      </div>
      {/* Table */}
      <div className="rounded-md border px-3 py-1 mb-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
