import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Single project schema — field names match the Django Project model exactly
// ─────────────────────────────────────────────────────────────────────────────
const projectSchema = z
    .object({
        // ── Core ────────────────────────────────────────────────────────────
        title: z
            .string()
            .min(1, "Project title is required."),

        role: z
            .string()
            .optional(),

        description: z
            .string()
            .optional(),

        // ── Technologies (required, comma-separated) ─────────────────────
        technologies: z
            .string()
            .min(1, "At least one technology is required."),

        // ── URLs (optional — empty string is allowed) ────────────────────
        github_url: z
            .string()
            .url("Must be a valid URL.")
            .optional()
            .or(z.literal("")),

        live_demo_url: z
            .string()
            .url("Must be a valid URL.")
            .optional()
            .or(z.literal("")),

        // ── Dates ────────────────────────────────────────────────────────
        start_date: z
            .string()
            .optional(),

        end_date: z
            .string()
            .optional(),

        // ── Flags (match Django BooleanField defaults) ───────────────────
        currently_working: z
            .boolean()
            .default(false),

        is_featured: z
            .boolean()
            .default(false),

        is_visible: z
            .boolean()
            .default(true),

        // ── Display order (coerce because <input type="number"> returns a string) ──
        display_order: z
            .coerce
            .number()
            .int()
            .min(0)
            .default(0),
    })
    // ── Cross-field rule: end_date required when not currently working ───
    .refine(
        (data) => {
            if (data.currently_working) return true;
            return !!data.end_date;
        },
        {
            path: ["end_date"],
            message: "End date is required unless this is a current project.",
        }
    );

// ─────────────────────────────────────────────────────────────────────────────
// Form-level schema (wraps the array)
// ─────────────────────────────────────────────────────────────────────────────
export const projectsFormSchema = z.object({
    projects: z
        .array(projectSchema)
        .min(1, "Add at least one project."),
});