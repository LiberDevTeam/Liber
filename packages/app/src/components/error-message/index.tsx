import styled from 'styled-components';

export const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.red};
  padding: ${(props) =>
    `${props.theme.space[2]}px 0 0 ${props.theme.space[1]}px`};
`;
