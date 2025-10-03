import { EditionPassageDto } from '@/types/api.types';
import { textToParagraphs } from '@/utils/text';
import { FunctionComponent, PropsWithChildren } from 'react';
import { PassageImage } from './PassageImage';

type HighlighterProps = {
  passageData: EditionPassageDto | undefined;
  currentTime: number;
  enabled: boolean;
  direction: 'ltr' | 'rtl';
  decodeEnabled: boolean;
  hideImage?: boolean;
};

export const Highlighter: FunctionComponent<HighlighterProps> = (props: PropsWithChildren<HighlighterProps>) => {
  const { currentTime, direction, enabled, passageData, decodeEnabled, hideImage } = props;

  const highlightText = (text: string, startIndex: number, endIndex: number): string[] => {
    const paragraphs = textToParagraphs(text);
    let offset = 0;
    return paragraphs.map((paragraph) => {
      const paragraphStart = offset;
      const paragraphEnd = paragraphStart + paragraph.length;
      const overlapStart = Math.max(paragraphStart, startIndex);
      const overlapEnd = Math.min(paragraphEnd, endIndex);
      const hasOverlap = overlapStart < overlapEnd;
      const localStart = overlapStart - paragraphStart;
      const localEnd = overlapEnd - paragraphStart;
      const highlighted = hasOverlap
        ? paragraph.slice(0, localStart) +
          `<span class="bg-yellow-200 rounded-sm">` +
          paragraph.slice(localStart, localEnd) +
          `</span>` +
          paragraph.slice(localEnd)
        : paragraph;
      offset = paragraphEnd + 1;
      return highlighted;
    });
  };

  const highlightAndConvertTextToParagraphs = (text: string) => {
    if (!passageData?.audio?.speechMarks) return textToParagraphs(text);
    const { speechMarks } = passageData.audio;
    const indices = Object.keys(speechMarks).map(Number);
    const highlightedTextIndex = indices.findIndex((key) => speechMarks[key] >= currentTime);
    if (highlightedTextIndex === -1 || highlightedTextIndex >= indices.length) return textToParagraphs(text);
    const startIndex = indices[highlightedTextIndex];
    const nextIndex = indices[highlightedTextIndex + 1];
    const endIndex = typeof nextIndex === 'number' ? nextIndex : text.length;
    return highlightText(text, startIndex, endIndex);
  };

  const textToDisplay = decodeEnabled && passageData?.textDecoded ? passageData.textDecoded : passageData?.text;
  const paragraphs = textToParagraphs(textToDisplay ?? '');
  const highlightedParagraphs = highlightAndConvertTextToParagraphs(textToDisplay ?? '');

  const image = !hideImage && <PassageImage imageUrl={passageData?.imageUrl}></PassageImage>;

  return enabled ? (
    <div
      className="flex flex-col gap-2 pb-5 reader"
      dir={direction}
    >
      {image}
      {highlightedParagraphs?.map((paragraph, index) => (
        <p
          key={`paragraph-${index}`}
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      ))}
    </div>
  ) : (
    <div
      className="flex flex-col gap-2 pb-5 reader"
      dir={direction}
    >
      {image}
      {paragraphs.map((paragraph, index) => (
        <p
          key={`paragraph-${index}`}
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      ))}
    </div>
  );
};
