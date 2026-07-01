import { z } from "zod";

export const experienceSchema = z
    .object({
        company: z
            .string()
            .trim()
            .min(2, "Company name is required."),

        position: z
            .string()
            .trim()
            .min(2, "Position is required."),

        employment_type: z
            .string()
            .optional(),

        location: z
            .string()
            .optional(),

        start_date: z
            .string()
            .min(1, "Start date is required."),

        end_date: z
            .string()
            .optional(),

        is_current: z.boolean(),

        description: z
            .string()
            .optional(),

        responsibilities: z
            .string()
            .optional(),
    })
    .refine(
        (data) => {
            if (data.is_current) return true;

            return (
                data.end_date &&
                data.end_date.length > 0
            );
        },
        {
            path: ["end_date"],
            message:
                "End date is required unless this is your current job.",
        }
    );

export const experiencesFormSchema = z.object({
    experiences: z.array(experienceSchema),
});