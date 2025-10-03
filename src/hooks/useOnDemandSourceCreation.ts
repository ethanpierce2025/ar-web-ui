import { CreateOnDemandSourceDto, CreateOnDemandSourceDtoLevelEnum } from '@/types/api.types';
import { useCallback, useEffect, useRef } from 'react';

interface UseOnDemandSourceCreationParams {
  editionMissing: boolean;
  createOnDemandSource: (params: { body: CreateOnDemandSourceDto } | undefined) => void;
  isCreatingOnDemandSource: boolean;
  language: string;
  level: string;
  publicationVersion: string;
}

export const useOnDemandSourceCreation = ({
  editionMissing,
  createOnDemandSource,
  isCreatingOnDemandSource,
  language,
  level,
  publicationVersion,
}: UseOnDemandSourceCreationParams) => {
  const hasAttemptedCreation = useRef(false);

  const attemptCreation = useCallback(() => {
    if (editionMissing && !isCreatingOnDemandSource && !hasAttemptedCreation.current) {
      hasAttemptedCreation.current = true;

      createOnDemandSource({
        body: {
          languageCode: language,
          level: level as unknown as CreateOnDemandSourceDtoLevelEnum,
          version: publicationVersion,
        },
      });
    }
  }, [editionMissing, isCreatingOnDemandSource, language, level, publicationVersion, createOnDemandSource]);

  useEffect(() => {
    attemptCreation();
  }, [attemptCreation]);

  const resetAttempt = useCallback(() => {
    hasAttemptedCreation.current = false;
  }, []);

  return { resetAttempt };
};
