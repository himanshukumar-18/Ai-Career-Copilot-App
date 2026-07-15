import { z } from "zod";

export const educationSchema = z
    .object({
        degree: z
            .string()
            .trim()
            .min(2, "Degree is required."),

        institution: z
            .string()
            .trim()
            .min(2, "Institution is required."),

        field_of_study: z
            .string()
            .trim()
            .optional(),

        location: z
            .string()
            .trim()
            .optional(),

        start_date: z
            .string()
            .min(1, "Start date is required."),

        end_date: z.string().optional(),

        currently_studying: z.boolean(),

        grade: z.string().optional(),

        description: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.currently_studying) return true;

            return (
                data.end_date &&
                data.end_date.length > 0
            );
        },
        {
            path: ["end_date"],
            message:
                "End date is required unless currently studying.",
        }
    );

export const educationsFormSchema =
    z.object({
        educations: z.array(
            educationSchema
        ),
    });