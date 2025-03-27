import { z } from "zod";

export const useLoginschema = () => z.object({
    universityId: z.string().min(5, "not a valid University ID "),
    password: z.string().min(6, "not a valid password "),
});
