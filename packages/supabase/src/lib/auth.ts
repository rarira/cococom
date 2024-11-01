import {
  SignInWithIdTokenCredentials,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  SupabaseClient,
} from '@supabase/supabase-js';

import { Database } from '../types';

export class AuthTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async signUpWithEmail(credentials: SignUpWithPasswordCredentials) {
    return await this.supabaseClient.auth.signUp(credentials);
  }

  async signInWithEmail(credentials: SignInWithPasswordCredentials) {
    return await this.supabaseClient.auth.signInWithPassword(credentials);
  }

  async signInWithIdToken(credentials: SignInWithIdTokenCredentials) {
    return await this.supabaseClient.auth.signInWithIdToken(credentials);
  }

  async verifyOtp(email: string, token: string) {
    return await this.supabaseClient.auth.verifyOtp({ email, token, type: 'recovery' });
  }

  async signOut() {
    return await this.supabaseClient.auth.signOut();
  }

  async deleteUser(userId: string) {
    const response = await this.supabaseClient.functions.invoke('delete-user', {
      body: { userId },
    });

    return response;
  }

  async changePassword(newPassword: string) {
    return await this.supabaseClient.auth.updateUser({
      password: newPassword,
    });
  }

  async resetPassword(email: string, redirectTo: string) {
    return await this.supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
  }
}
