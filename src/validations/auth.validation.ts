import { z } from 'zod';

const generateToken = z.object({
  body: z.object({
    uid: z.string(),
  }),
});

type IGenerateToken = z.infer<typeof generateToken>;

export { generateToken };
export type { IGenerateToken };
