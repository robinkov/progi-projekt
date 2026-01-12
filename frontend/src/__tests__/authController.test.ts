import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthController from '@/controllers/authController';

vi.mock('@/config/supabase', () => {
  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        getSession: vi.fn(),
        signOut: vi.fn(),
        signInWithOAuth: vi.fn(),
      },
    },
  };
});

import { supabase } from '@/config/supabase';

describe('AuthController', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('resolves on successful login', async () => {
    vi.mocked(supabase.auth.signInWithPassword as any).mockResolvedValue({ error: null });
    await expect(AuthController.loginWithEmailAndPassword('a@b.com', 'pass')).resolves.toBeUndefined();
  });

  it('rejects on login error (wrong password)', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({ error: { message: 'Invalid' } });
    await expect(AuthController.loginWithEmailAndPassword('a@b.com', 'bad')).rejects.toThrow('Invalid');
  });

  it('rejects on signup error (email exists)', async () => {
    (supabase.auth.signUp as any).mockResolvedValue({ error: { message: 'Email exists' } });
    await expect(AuthController.signUpWithEmailAndPassword('x@y.com', 'pw', 'Full Name')).rejects.toThrow('Email exists');
  });
  
  it('rejects when getCurrentSession has no session', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null }, error: null });
    await expect(AuthController.getCurrentSession()).rejects.toThrow('No active session.');
  });
  
  it('throws when calling a non-existing AuthController function', () => {
    const callNonExisting = () => {(AuthController as any).nonExistingMethod();};
    expect(callNonExisting).toThrow();
  });

  it('rejects login when email and password are empty (edge case)', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({error: { message: 'Email and password are required' }});
    await expect(AuthController.loginWithEmailAndPassword('', '')).rejects.toThrow('Email and password are required');
  });

});