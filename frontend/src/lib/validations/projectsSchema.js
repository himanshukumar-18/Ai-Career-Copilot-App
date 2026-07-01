import { z } from "zod";

const projectSchema = z.object({
    title: z.string().trim().min(2, "Project name is required."),
    company: z.string().trim().optional(),
    role: z.string().trim().optional(),
    start_date: z.string().min(1, "Start date is required."),
    end_date: z.string().optional(),
    is_current: z.boolean(),
    link: z
        .string()
        .trim()
        .optional()
        .refine((value) => {
            if (!value) return true;
            return /^https?:\/\/.+/.test(value);
        }, {
            message: "Enter a valid URL.",
        }),
    description: z.string().trim().optional(),
}).refine(
    (data) => {
        if (data.is_current) return true;
        return !!data.end_date;
    },
    {
        path: ["end_date"],
        message: "End date is required unless this project is current.",
    }
);

export const projectsFormSchema = z.object({
    projects: z.array(projectSchema).min(1, "Add at least one project.")
});