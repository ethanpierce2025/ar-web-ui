import { FunctionComponent, PropsWithChildren } from 'react';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';

export type CopyToClipboardProps = {
  copiedElement?: React.ReactElement;
  copyElement?: React.ReactElement;
  isCopied?: boolean;
  onCopy: (copied: boolean) => void;
  text: string;
};

export const CopyToClipboard: FunctionComponent<PropsWithChildren<CopyToClipboardProps>> = (props) => {
  const { children, copiedElement, copyElement, isCopied, onCopy, text } = props;

  return (
    <ReactCopyToClipboard
      text={text}
      onCopy={(_text, result) => onCopy(result)}
    >
      <div className="flex flex-col">
        {isCopied ? copiedElement : copyElement}
        {children}
      </div>
    </ReactCopyToClipboard>
  );
};
