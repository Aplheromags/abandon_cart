"use client";

import { type DataTableRowAction } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Loader2 } from "lucide-react";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate } from "@/lib/utils";

import { CART_STATUS } from "@/constants";
import { getErrorMessage } from "@/lib/handle-error";
import { CartItem } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";
import { updateCartItem } from "../_lib/action";
import { getStatusIcon } from "../_lib/utils";

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<CartItem> | null>>;
}

type JsonObject = { [key: string]: unknown };

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<CartItem>[] {
  return [
    {
      id: "select",
      size: 35,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" className="translate-y-0.5" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cart ID" className="w-max" />,
      cell: ({ row }) => <div className="w-max">{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "productName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2 w-full">
            {row.original.productImage && <Image className="rounded-sm" src={row.original.productImage} width={35} height={35} alt={row.original.productName} />}
            <span className="max-w-[31.25rem] truncate font-medium">{row.original.productName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "productPrice",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">${row.getValue("productPrice")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "productType",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product Type" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {(() => {
                const properties = row.original?.properties as JsonObject | undefined;
                if (properties && typeof properties === "object") {
                  // Iterate over the keys to check for variations of "Product Type"
                  for (const key of Object.keys(properties)) {
                    // Case-insensitive check for 'Product Type' in the key
                    if (key.toLowerCase().includes("product type")) {
                      let value = properties[key]?.toString() ?? "";

                      // Remove extra quotes at the beginning and end of the string
                      if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1); // Remove the first and last character (the quotes)
                      }
                      return value;
                    }
                  }
                }
              })()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "instagram",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Instagram" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {(() => {
                const properties = row.original?.properties as JsonObject | undefined;
                if (properties && typeof properties === "object") {
                  for (const key of Object.keys(properties)) {
                    // Case-insensitive check for keys containing 'Instagram'
                    if (key.toLowerCase().includes("instagram")) {
                      let value = properties[key]?.toString() ?? null;

                      // If the value starts and ends with quotes, remove them
                      if (value && value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1); // Remove the first and last character (the quotes)
                      }

                      return value;
                    }
                  }
                }
              })()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = CART_STATUS.find((status) => status.value === row.original.status);

        if (!status) return null;

        const Icon = getStatusIcon(status.value);

        return (
          <div className={cn("flex w-fit rounded-lg px-2 items-center", status.color?.bgColor, status.color?.textColor)}>
            <Icon className={cn("mr-1 size-4 text-muted-foreground shrink-0", status.color?.bgColor, status.color?.textColor)} aria-hidden="true" />
            <span className="capitalize">{status.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();

        if (isUpdatePending) {
          return (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          );
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => setRowAction({ row, type: "update" })}>Edit</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.status}
                    onValueChange={(value) => {
                      startUpdateTransition(() => {
                        toast.promise(
                          updateCartItem({
                            id: row.original.id,
                            status: value as CartItem["status"],
                          }),
                          {
                            loading: "Updating...",
                            success: "Status updated",
                            error: (err) => getErrorMessage(err),
                          }
                        );
                      });
                    }}
                  >
                    {CART_STATUS.map((status) => {
                      return (
                        <DropdownMenuRadioItem key={status.value} value={status.value} disabled={isUpdatePending} className="capitalize">
                          {status.label}
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setRowAction({ row, type: "delete" })}>
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
