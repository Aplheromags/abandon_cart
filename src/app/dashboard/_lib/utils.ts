import { Cart_Status } from "@prisma/client";
import { CircleFadingArrowUp, CircleIcon, CirclePause, CircleX } from "lucide-react";

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Cart_Status) {
  const statusIcons = {
    [Cart_Status.PENDING]: CirclePause,
    [Cart_Status.RECOVERED]: CircleFadingArrowUp,
    [Cart_Status.CANCELLED]: CircleX,
  };

  return statusIcons[status] || CircleIcon;
}
