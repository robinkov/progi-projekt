import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGet, fetchPost } from '@/utils/fetchUtils';

globalThis.fetch = vi.fn();

describe('fetchUtils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetchGet rejects on invalid JSON', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => { throw new Error('bad json'); }
    });
    await expect(fetchGet('/x')).rejects.toThrow('Invalid JSON response.');
  });

  it('fetchPost rejects when response.ok is false and contains message', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Bad' })
    });
    await expect(fetchPost('/x', {})).rejects.toThrow('Bad');
  });
});