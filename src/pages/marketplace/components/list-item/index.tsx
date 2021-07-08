import styled from 'styled-components';

export const ListItem = styled.li`
  width: 100%;
  padding: ${(props) => props.theme.space[3]}px 0
    ${(props) => props.theme.space[4]}px;
  border-bottom: ${(props) =>
    props.theme.border.bold(props.theme.colors.gray3)};
  margin-bottom: ${(props) => props.theme.space[2]}px;
  position: relative;
`;
