import { useGroupCode } from '@/hooks/group-code';
import { useReaderUrlParams } from '@/hooks/url';
import { routes } from '@/routes/routes';
import { FunctionComponent, useState } from 'react';

type ReaderUnauthorizedProps = { editionId: number; position: number };

export const ReaderUnauthorized: FunctionComponent<ReaderUnauthorizedProps> = (params) => {
  const { editionId, position } = params;
  const readerParams = useReaderUrlParams();
  const { onEnterGroupCode } = useGroupCode();
  const [groupCode, setGroupCode] = useState('');

  const handleSubmit = () => {
    onEnterGroupCode({
      ...readerParams,
      editionId,
      groupCode,
      position,
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-[32px] text-[#103A3A] font-['Playfair_Display']">Enter Class Code or Sign In</h1>

      <p className="text-[#103A3A] mb-6">
        Questions about class codes, accounts and student privacy? Read our{' '}
        <a
          href="https://www.adaptivereader.com/pages/account-faqs"
          className="text-[#103A3A] underline hover:text-opacity-80"
          target="_blank"
          rel="noopener noreferrer"
        >
          Account FAQs
        </a>
        .
      </p>

      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Enter Class Code"
          onChange={(e) => setGroupCode(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#103A3A] focus:border-transparent"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#103A3A] text-white h-[48px] rounded-full mb-4 hover:bg-opacity-90 transition-colors"
      >
        Submit
      </button>

      <div className="flex items-center mb-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-4 text-gray-400">or</div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <a
        href={`${routes.signIn.path}?redirectUrl=${encodeURIComponent(window.location.href)}`}
        className="w-full text-center border-2 border-[#103A3A] text-[#103A3A] h-[48px] leading-[44px] rounded-full mb-6 hover:bg-[#103A3A] hover:text-white transition-colors block"
      >
        Sign In
      </a>

      <p className="text-[#103A3A]">
        New to Adaptive Reader? Create a{' '}
        <a
          href={`${routes.signUp.path}?redirectUrl=${encodeURIComponent(window.location.href)}`}
          className="underline hover:text-opacity-80"
        >
          free account
        </a>{' '}
        to get started.
      </p>
    </div>
  );
};
