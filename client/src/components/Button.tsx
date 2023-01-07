import styled from 'styled-components';
import { ReactNode } from 'react';

interface ButtonProp {
  children: string | ReactNode;
  _onClick?: (e: React.FormEvent<HTMLFormElement>) => void;
  isValidate?: boolean;
}

export const Button = ({ children, _onClick, ...rest }: ButtonProp) => {
  return (
    <ElButton onClick={() => _onClick} isValidate={rest.isValidate}>
      {children}
    </ElButton>
  );
};

const ElButton = styled.button<{ isValidate?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 40px;
  margin: 0;
  padding: 12px 24px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0);
  background-color: ${({ isValidate }) =>
    isValidate ? 'rgb(41, 72, 242)' : 'rgba(0, 0, 0, 0.4)'};
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0.105em;
  font-feature-settings: 'ss01', 'ss02', 'ss03', 'ss05', 'salt', 'ss06', 'ss07',
    'ss08', 'cv01', 'cv02', 'cv03', 'cv04', 'cv05', 'cv07', 'cv08', 'cv09',
    'cv10', 'cv11', 'cv12', 'case', 'cpsp';
  color: rgb(255, 255, 255);
  overflow: hidden;
  transform: translateZ(0px);
  transition: all 0.2s ease 0s;
  cursor: ${({ isValidate }) => (isValidate ? 'pointer' : 'default')};
`;
