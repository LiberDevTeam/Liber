import styled from 'styled-components';

export const Header = styled.div`
  height: 2.5rem;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.primaryText};
  margin-bottom: ${(props) => props.theme.space[2]}px;
  justify-content: space-between;
`;

export const Avatar = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 1.5rem;
  object-fit: cover;
  border: ${(props) => props.theme.border.white.thin};
  margin-right: ${(props) => props.theme.space[3]}px;
  box-shadow: ${(props) => props.theme.shadows[1]};
`;

export const Title = styled.div`
  font-size: ${(props) => props.theme.fontSizes['xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  display: flex;
  align-items: center;
`;

export const Timestamp = styled.span`
  color: ${(props) => props.theme.colors.secondaryText};
  margin-top: ${(props) => props.theme.space[1]}px;
  margin-right: ${(props) => props.theme.space[3]}px;
  font-size: ${(props) => props.theme.fontSizes['sm']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  opacity: 0.6;
`;

export const Text = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.light};
  line-height: 140%;
`;
