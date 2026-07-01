import { z } from "zod";

export const languageSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Language name is required."),

    proficiency: z
        .string()
        .trim()
        .min(1, "Proficiency level is required."),

    reading: z.boolean(),
    writing: z.boolean(),
    speaking: z.boolean(),
});

export const languagesFormSchema = z.object({
    languages: z.array(languageSchema),
});
