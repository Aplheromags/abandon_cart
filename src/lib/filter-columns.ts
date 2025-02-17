// import { Filter, JoinOperator } from "@/types";
// import { addDays, endOfDay, startOfDay } from "date-fns";

// /**
//  * Construct Prisma filter conditions based on the provided filters for a specific model.
//  *
//  * @param filters - An array of filters to be applied to the model.
//  * @param joinOperator - The join operator to use for combining the filters ("and" | "or").
//  * @returns A Prisma-compatible filter object.
//  */

// export function filterColumns<T>({ filters, joinOperator }: { filters: Filter<T>[]; joinOperator: JoinOperator }) {
//   const conditions = filters.map((filter) => {
//     const { operator, value, type } = filter;
//     const id = filter.id as keyof T;

//     switch (operator) {
//       case "eq":
//         return { [id as keyof T]: { equals: value } };
//       case "ne":
//         return { [id as keyof T]: { not: value } };
//       case "iLike":
//         return type === "text" && typeof value === "string" ? { [id as keyof T]: { contains: value } } : undefined;
//       case "notILike":
//         return type === "text" && typeof value === "string" ? { [id as keyof T]: { not: { contains: value } } } : undefined;
//       case "lt":
//         return { [id as keyof T]: { lt: value } };
//       case "lte":
//         return { [id as keyof T]: { lte: value } };
//       case "gt":
//         return { [id as keyof T]: { gt: value } };
//       case "gte":
//         return { [id as keyof T]: { gte: value } };
//       case "isBetween":
//         return type === "date" && Array.isArray(value) && value.length === 2 && value[0] && value[1]
//           ? {
//               [id as keyof T]: {
//                 gte: startOfDay(new Date(value[0])),
//                 lte: endOfDay(new Date(value[1])),
//               },
//             }
//           : undefined;
//       case "isRelativeToToday":
//         if (type === "date" && typeof value === "string") {
//           const today = new Date();
//           const [amount, unit] = value.split(" ");
//           let startDate: Date, endDate: Date;

//           if (!amount || !unit) return undefined;

//           switch (unit) {
//             case "days":
//               startDate = startOfDay(addDays(today, parseInt(amount)));
//               endDate = endOfDay(startDate);
//               break;
//             case "weeks":
//               startDate = startOfDay(addDays(today, parseInt(amount) * 7));
//               endDate = endOfDay(addDays(startDate, 6));
//               break;
//             case "months":
//               startDate = startOfDay(addDays(today, parseInt(amount) * 30));
//               endDate = endOfDay(addDays(startDate, 29));
//               break;
//             default:
//               return undefined;
//           }

//           return { [id as keyof T]: { gte: startDate, lte: endDate } };
//         }
//         return undefined;
//       case "isEmpty":
//         return { [id as keyof T]: { equals: null } };
//       case "isNotEmpty":
//         return { [id as keyof T]: { not: null || "" } };
//       default:
//         throw new Error(`Unsupported operator: ${operator}`);
//     }
//   });

//   const validConditions = conditions.filter(Boolean);

//   if (validConditions.length === 0) return undefined;

//   return joinOperator === "and" ? { AND: validConditions } : { OR: validConditions };
// }
