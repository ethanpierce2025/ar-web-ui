import { defaultPublicationVersion } from '@/constants';
import { useReaderUrlParams } from '@/hooks/url';
import { renderHook } from '@testing-library/react';
import { Location, useParams } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn().mockReturnValue({ search: '' } as Location<any>),
    useParams: vi.fn(),
  };
});

describe('useReaderUrlParams', () => {
  test('Single column reader should be parsed correctly', () => {
    vi.mocked(useParams).mockReturnValue({ publicationSlug: 'frankenstein', '*': 'v1/en:original/11' });

    const {
      result: { current: data },
    } = renderHook(() => useReaderUrlParams());

    expect(data.publicationSlug).toBe('frankenstein');
    expect(data.publicationVersion).toBe('v1');
    expect(data.language).toBe('en');
    expect(data.level).toBe('ORIGINAL');
    expect(data.position).toBe(11);
    expect(data.renavigateToReaderUrl).toBe(false);
    expect(data.secondaryLanguage).toBeUndefined();
    expect(data.secondaryLevel).toBeUndefined();
  });

  test('Dual column reader should be parsed correctly', () => {
    vi.mocked(useParams).mockReturnValue({ publicationSlug: 'frankenstein', '*': 'v1/en:original/es:gold/11' });

    const {
      result: { current: data },
    } = renderHook(() => useReaderUrlParams());

    expect(data.publicationSlug).toBe('frankenstein');
    expect(data.publicationVersion).toBe('v1');
    expect(data.language).toBe('en');
    expect(data.level).toBe('ORIGINAL');
    expect(data.position).toBe(11);
    expect(data.renavigateToReaderUrl).toBe(false);
    expect(data.secondaryLanguage).toBe('es');
    expect(data.secondaryLevel).toBe('GOLD');
  });

  test('Single column reader without version should be parsed correctly', () => {
    vi.mocked(useParams).mockReturnValue({ publicationSlug: 'frankenstein', '*': 'en/gold/152' });

    const {
      result: { current: data },
    } = renderHook(() => useReaderUrlParams());

    expect(data.publicationSlug).toBe('frankenstein');
    expect(data.publicationVersion).toBe(defaultPublicationVersion);
    expect(data.language).toBe('en');
    expect(data.level).toBe('GOLD');
    expect(data.position).toBe(152);
    expect(data.renavigateToReaderUrl).toBe(true);
    expect(data.secondaryLanguage).toBeUndefined();
    expect(data.secondaryLevel).toBeUndefined();
  });

  test('Dual column reader without version should be parsed correctly', () => {
    vi.mocked(useParams).mockReturnValue({ publicationSlug: 'frankenstein', '*': 'en:ur/original:silver/152' });

    const {
      result: { current: data },
    } = renderHook(() => useReaderUrlParams());

    expect(data.publicationSlug).toBe('frankenstein');
    expect(data.publicationVersion).toBe(defaultPublicationVersion);
    expect(data.language).toBe('en');
    expect(data.level).toBe('ORIGINAL');
    expect(data.position).toBe(152);
    expect(data.renavigateToReaderUrl).toBe(true);
    expect(data.secondaryLanguage).toBe('ur');
    expect(data.secondaryLevel).toBe('SILVER');
  });

  test('Single column reader with an invalid position should be parsed correctly', () => {
    vi.mocked(useParams).mockReturnValue({ publicationSlug: 'frankenstein', '*': 'v1/en:original/squadup' });

    const {
      result: { current: data },
    } = renderHook(() => useReaderUrlParams());

    expect(data.publicationSlug).toBe('frankenstein');
    expect(data.publicationVersion).toBe('v1');
    expect(data.language).toBe('en');
    expect(data.level).toBe('ORIGINAL');
    expect(data.position).toBe(1);
    expect(data.renavigateToReaderUrl).toBe(true);
    expect(data.secondaryLanguage).toBeUndefined();
    expect(data.secondaryLevel).toBeUndefined();
  });
});
