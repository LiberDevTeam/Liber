import styled from 'styled-components';

export const Textarea = styled.textarea`
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.md};
  background: ${(props) => props.theme.colors.bg3};
  border: none;
  border-radius: ${(props) => props.theme.radii.large}px;
  padding: ${(props) => `${props.theme.space[3]}px ${props.theme.space[5]}px`};

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.colors.lightPrimary} 0px 0px 0px 2px;
    outline: none;
  }

  ::placeholder {
    color: ${(props) => props.theme.colors.secondaryText};
  }
`;
