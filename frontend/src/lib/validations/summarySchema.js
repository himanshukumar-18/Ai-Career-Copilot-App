import { z } from "zod";

export const summaryFormSchema = z.object({
    summary: z
        .string()
        .trim()
        .min(20, "Summary must be at least 20 characters.")
        .max(1000, "Summary cannot exceed 1000 characters."),
});