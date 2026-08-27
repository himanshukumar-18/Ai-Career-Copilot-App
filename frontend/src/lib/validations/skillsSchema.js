import { z } from "zod";

const skillSchema = z.object({
    name: z.string().trim().min(2, "Skill name is required."),
    level: z.string().trim().min(1, "Skill level is required."),
});

export const skillsFormSchema = z.object({
    skills: z.array(skillSchema).min(1, "Add at least one skill.")
});