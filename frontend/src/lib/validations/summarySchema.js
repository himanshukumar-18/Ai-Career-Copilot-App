import { z } from "zod";

export const summaryFormSchema = z.object({
    content: z
        .string()
        .trim()
        .max(2000, "Summary must be 2000 characters or fewer."),
});