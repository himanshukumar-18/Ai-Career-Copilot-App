import { z } from "zod";

const urlOrEmpty = z
    .string()
    .trim()
    .optional()
    .refine((value) => {
        if (!value) return true;
        return /^https?:\/\/.+/.test(value);
    }, {
        message: "Enter a valid URL.",
    });

export const socialLinksFormSchema = z.object({
    website: urlOrEmpty,
    portfolio: urlOrEmpty,
    linkedin: urlOrEmpty,
    github: urlOrEmpty,
});