import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ProfileApproval from '@/pages/admin/ProfileApproval';
vi.mock('@/config/supabase', () => (
    { supabase:
        { auth:
            { getSession: vi.fn(() => (
                { data: { session: { access_token: 'token' } } }
                ))
            }
        }
    }
));
vi.mock('@/utils/fetchUtils', () => ({
  fetchGet: vi.fn(),
  fetchPost: vi.fn(),
}));
import { fetchGet, fetchPost } from '@/utils/fetchUtils';

describe('ProfileApproval', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders profiles and approves one (removes from DOM)', async () => {
    (fetchGet as any).mockResolvedValue({ success: true, profiles: [{ id: 1, profile_name: 'Org', logo_photo_url: '', banner_photo_url: '', description: 'D', address: '', mail: 'a@b', phone: '' }] });
    (fetchPost as any).mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <ProfileApproval />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Org')).toBeInTheDocument());
    const approveBtn = screen.getByRole('button', { name: /Odobri Profil/i });
    fireEvent.click(approveBtn);

    await waitFor(() => expect(screen.queryByText('Org')).not.toBeInTheDocument());
  });
});