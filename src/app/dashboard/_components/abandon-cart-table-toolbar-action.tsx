"use client";

import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { CartItem } from "@prisma/client";
import { DeleteCartItemsDialog } from "./delete-cart-item-dialog";

interface CartsTableToolbarActionsProps {
  table: Table<CartItem>;
}

export function AbandonedCartTableToolbarActions({ table }: CartsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteCartItemsDialog
          cartitem={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "abandon-carts-orders",
            excludeColumns: ["select", "actions"],
            onlySelected: true,
          })
        }
        className="gap-2"
      >
        <Download className="size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
