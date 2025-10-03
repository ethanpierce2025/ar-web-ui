import { defaultPublicationVersion } from '@/constants';
import { LegacyPublicationOverviewPage } from '@/pages/LegacyPublicationOverviewPage';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/url', () => ({
  useLegacyPublicationOverviewUrlParams: () => ({
    publicationSlug: 'frankenstein',
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn((props) => {
      return (
        <div
          data-testid="navigate"
          data-to={props.to}
        />
      );
    }),
  };
});

describe('LegacyPublicationOverviewPage', () => {
  it('Legacy publication page should render Navigate with the correct "to" prop', () => {
    render(<LegacyPublicationOverviewPage />);

    const navigateDiv = screen.getByTestId('navigate');
    expect(navigateDiv.getAttribute('data-to')).toBe(`/frankenstein/${defaultPublicationVersion}`);
  });
});
