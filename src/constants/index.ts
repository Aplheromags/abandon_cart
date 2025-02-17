import { Cart_Status } from "@prisma/client";

export type StatusType = {
  label: string;
  value: Cart_Status;
  color?: {
    textColor: string;
    bgColor: string;
    ringColor: string;
  };
};

export const CART_STATUS: StatusType[] = [
  {
    label: "Pending",
    value: "PENDING",
    color: {
      textColor: "text-yellow-700 font-medium",
      bgColor: "bg-yellow-100 dark:bg-yellow-400 dark:text-black",
      ringColor: "ring-yellow-600/20",
    },
  },
  {
    value: "RECOVERED",
    label: "Recovered",
    color: {
      textColor: "text-green-700 font-medium",
      bgColor: "bg-green-100 dark:bg-green-400 dark:text-black",
      ringColor: "ring-green-600/20",
    },
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    color: {
      textColor: "text-red-700 font-medium",
      bgColor: "bg-red-100 dark:bg-red-400 dark:text-black",
      ringColor: "ring-red-600/20",
    },
  },
];
