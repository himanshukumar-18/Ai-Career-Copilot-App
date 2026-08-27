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

        employment_type: z.string().optional(),

        location: z.string().trim().optional(),

        start_date: z
            .string()
            .min(1, "Start date is required."),

        end_date: z.string().optional(),

        currently_working: z.boolean().default(false),

        description: z.string().trim().optional(),
    })
    .superRefine((data, context) => {
        if (!data.currently_working && !data.end_date) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["end_date"],
                message:
                    "End date is required unless this is your current role.",
            });
        }

        if (
            data.start_date &&
            data.end_date &&
            new Date(data.end_date) < new Date(data.start_date)
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["end_date"],
                message: "End date cannot be earlier than start date.",
            });
        }
    });

export const experiencesFormSchema = z.object({
    experiences: z.array(experienceSchema),
});