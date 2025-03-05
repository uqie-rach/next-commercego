import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5, "Title must have at least 5 characters").max(100, "Max. 100 Characters").nonempty(),
  content: z.string().refine(
    (data) => {
      try {
        JSON.parse(data); // Pastikan content adalah JSON valid
        return true;
      } catch {
        return false;
      }
    },
    { message: "Content must be a valid JSON" }
  ),
  userId: z.string().cuid("Invalid UserID"), // Jika menggunakan UUID
});


export const editArticleSchema = z.object({
  title: z.string().min(5, "Title must have at least 5 characters").max(100, "Max. 100 Characters").nonempty(),
  content: z.string().refine(
    (data) => {
      try {
        JSON.parse(data); // Pastikan content adalah JSON valid
        return true;
      } catch {
        return false;
      }
    },
    { message: "Content must be a valid JSON" }
  ),
});
