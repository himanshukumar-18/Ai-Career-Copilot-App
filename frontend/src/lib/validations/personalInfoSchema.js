import { z } from "zod";

export const personalInfoSchema = z.object({
    first_name: z
        .string()
        .min(2, "First name is required"),

    last_name: z
        .string()
        .min(2, "Last name is required"),

    headline: z
        .string()
        .min(3, "Professional headline is required"),

    email: z
        .string()
        .email("Invalid email address"),

    phone: z
        .string()
        .min(10, "Phone number is too short"),

    address: z.string().optional(),

    city: z.string().optional(),

    state: z.string().optional(),

    postal_code: z.string().optional(),

    country: z.string().optional(),

    website: z.string().optional(),

    portfolio: z.string().optional(),

    linkedin: z.string().optional(),

    github: z.string().optional(),
});