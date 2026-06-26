import { z } from "zod";

export const createResumeSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Resume title must be at least 3 characters.")
        .max(100, "Resume title cannot exceed 100 characters."),

    template: z
        .string()
        .min(1, "Please select a template."),
});