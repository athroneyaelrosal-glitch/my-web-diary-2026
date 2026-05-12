import type { Session } from '@supabase/supabase-js';

export interface UserType {
  session: Session | null,
  email: string | null
}

export const user: UserType = {
  session: null,
  email: null,
}
