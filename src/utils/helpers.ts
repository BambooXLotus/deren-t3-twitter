import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { User } from '@clerk/nextjs/dist/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterUserForClient(user: User) {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    externalUsername: user.externalAccounts[0]?.emailAddress || null
  }
}