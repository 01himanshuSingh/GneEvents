import { z } from "zod";

export const useLoginschema = () => z.object({
    universityId: z.string().min(5, "University ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
