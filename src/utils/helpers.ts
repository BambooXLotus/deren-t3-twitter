import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { User } from '@clerk/nextjs/dist/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterUserForClient({ id, username, profileImageUrl }: User) {
  return {
    id,
    username,
    profileImageUrl
  }
}