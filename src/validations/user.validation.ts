import { z } from 'zod';

const updateMe = z.object({
  body: z.strictObject({
    fullName: z.string().trim().optional(),
    email: z.string().email().optional(),
  }),
});

const updateMyPreferences = z.object({
  body: z.strictObject({
    notificationsEnabled: z.boolean().optional(),
    locationShared: z.boolean().optional(),
  }),
});

type IUpdateMe = z.infer<typeof updateMe>;
type IUpdateMyPreferences = z.infer<typeof updateMyPreferences>;

export { updateMe, updateMyPreferences };
export type { IUpdateMe, IUpdateMyPreferences };
