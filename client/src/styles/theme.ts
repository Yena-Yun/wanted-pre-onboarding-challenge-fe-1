import styled from 'styled-components';

export const FlexBox = styled.div<{ gap?: string }>`
  display: flex;
  gap: ${(props) => (props.gap ? props.gap : '0')};
`;

export const FlexColumn = styled(FlexBox)`
  flex-direction: column;
`;

export const FlexColumnCustom = styled(FlexColumn)<{
  justify?: string;
  align?: string;
}>`
  justify-content: ${(props) => (props.justify ? props.justify : 'center')};
  align-items: ${(props) => (props.align ? props.align : 'center')};
`;

export const FlexCustom = styled(FlexBox)<{ justify?: string; align?: string }>`
  justify-content: ${(props) => (props.justify ? props.justify : 'center')};
  align-items: ${(props) => (props.align ? props.align : 'center')};
`;

export const SizeBox = styled.div<{
  width?: string;
  maxWidth?: string;
  height?: string;
}>`
  width: ${(props) => (props.width ? props.width : 'auto')};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : 'fit-content')};
  height: ${(props) => (props.height ? props.height : 'auto')};
`;
