import { editionDefaults } from '@/constants';
import { EditionLanguageDto, EditionSelectDto } from '@/types/api.types';
import { Publication } from '@/types/publication.types';

type PublciationLanguages = {
  editonsByLanguage: Record<string, EditionSelectDto[]>;
  languages: EditionLanguageDto[];
};

export function usePublicationLanguages(publication?: Publication): PublciationLanguages {
  if (!publication) {
    return {
      editonsByLanguage: {},
      languages: editionDefaults.languages,
    };
  }

  const editonsByLanguage = publication.editions.reduce((acc, edition) => {
    const { language } = edition;
    if (!acc[language.code]) {
      acc[language.code] = [];
    }
    acc[language.code].push(edition);
    return acc;
  }, {});

  const languages = publication.editions.reduce((acc, { language }) => {
    if (!acc[language.code]) {
      acc[language.code] = language;
    }
    return acc;
  }, {});

  return {
    editonsByLanguage,
    languages: Object.values(languages),
  };
}
