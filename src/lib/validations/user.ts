import { z } from 'zod';

export const updateUserValidator = z.object({
  name: z.string().max(255).nonempty({ message: 'Required!' }),
  email: z.string().email().nonempty({ message: 'Required!' }),
  duty: z.enum(['core', 'associate core', 'lead']).optional(),
  phone: z.string().nonempty({ message: 'Required!' }).max(20, { message: 'Max 20 characters!' }),
  image: z.string().max(100).optional(),
  bio: z.string().max(255, { message: 'Max character reached!' }).optional(),
  location: z.string().regex(/^[a-zA-Z\s]+,\s*[a-zA-Z\s]+$/, { message: 'Invalid format! Use "city, country".' }).max(100).nonempty({ message: 'Required!' }),
  linkedin: z.string().url().max(100).optional(),
  github: z.string().url().max(100).optional(),
  twitter: z.string().url().max(100).optional(),
  website: z.string().url().max(100).optional(),
  instagram: z.string().url().max(100).optional(),
})
