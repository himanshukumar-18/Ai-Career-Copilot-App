import { z } from "zod";

const today = new Date();

export const certificationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Certification name is required."),

    issuer: z
        .string()
        .trim()
        .min(2, "Issuing organization is required."),

    issue_date: z
        .string()
        .min(1, "Issue date is required."),

    expiry_date: z
        .string()
        .optional()
        .refine(
            (value) => {
                if (!value) return true;

                return new Date(value) >= today;
            },
            {
                message:
                    "Expiration date cannot be in the past.",
            }
        ),

    credential_id: z
        .string()
        .trim()
        .optional(),

    credential_url: z
        .string()
        .trim()
        .optional()
        .refine(
            (value) => {
                if (!value) return true;

                return /^https?:\/\/.+/.test(value);
            },
            {
                message:
                    "Enter a valid URL.",
            }
        ),
});

export const certificationsFormSchema = z.object({
    certifications: z
        .array(certificationSchema)
        .min(
            1,
            "Add at least one certification."
        ),
});