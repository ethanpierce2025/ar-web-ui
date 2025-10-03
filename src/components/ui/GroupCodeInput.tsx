import { useApp } from '@/context/app.context';
import { useGroupCode } from '@/hooks/group-code';
import { isClassroomCodeValid } from '@/utils/validations';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from './Button';

const Input = styled.input`
  text-transform: uppercase;

  ::placeholder {
    font-size: 14px;
    text-transform: none;
  }
`;

export type ClassroomCodeInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  className?: string;
  codeLength?: number;
  editionId: number;
  onSuccess: (data: any) => void;
};

export const GroupCodeInput: FunctionComponent<ClassroomCodeInputProps> = (props) => {
  const { className, codeLength = 8, editionId, onSuccess, ...inputProps } = props;
  const [code, setCode] = useState('');
  const isValid = isClassroomCodeValid(code, codeLength);
  const { onEnterGroupCode } = useGroupCode();
  const { groupCode } = useApp();

  function onEnterCode() {
    if (isValid) {
      onEnterGroupCode({
        editionId,
        groupCode: code,
        position: 1,
      });
    }
  }

  useEffect(() => {
    if (groupCode && isValid) {
      setCode('');
      onSuccess(groupCode);
    }
  }, [groupCode]);

  return (
    <div className={`flex gap-2 w-full`}>
      <Input
        className="w-full px-4 border h-[42px] rounded-lg"
        type="text"
        placeholder="Enter Class Code"
        onChange={(event) => setCode(event.target.value)}
        maxLength={codeLength}
        {...inputProps}
      />
      <div>
        <Button
          disabled={!isValid}
          onClick={onEnterCode}
          className="!rounded-md"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
