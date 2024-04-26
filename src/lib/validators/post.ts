import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters" })
    .max(120, { message: "Title must be most 120 characters" }),

  subredditId: z.string(),
  content: z.any(),
});

export type PostCreationRequst = z.infer<typeof PostValidator>;
