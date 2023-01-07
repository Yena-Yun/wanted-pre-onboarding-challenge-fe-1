import styled from 'styled-components';

type TitleProp = {
  title: string;
};

export const Title = ({ title }: TitleProp) => {
  return <ElTitle>{title}</ElTitle>;
};

const ElTitle = styled.h2`
  min-width: fit-content;
`;
