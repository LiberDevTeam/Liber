import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';

interface RootProps {
  bgImg: string;
}

export const Root = styled.div<RootProps>`
  background-image: ${(props) => props.theme.linearGradient[0]},
    url('${(props) => props.bgImg}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  border-radius: ${(props) => props.theme.radii.medium}px;
  display: flex;
  align-items: flex-end;
  padding: ${(props) => props.theme.space[3]}px;
  flex: 1;
`;

export const Content = styled.div``;

export const Header = styled.div`
  height: 2.5rem;
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

export const Avatar = styled(IpfsContent)`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: ${(props) => props.theme.radii.round};
  object-fit: cover;
  border: ${(props) => props.theme.border.white[1]};
  margin-right: ${(props) => props.theme.space[3]}px;
  box-shadow: ${(props) => props.theme.shadows[1]};
`;

export const Title = styled.div`
  margin-right: ${(props) => props.theme.space[2]}px;
  font-size: ${(props) => props.theme.fontSizes['xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

export const Timestamp = styled.span`
  margin-top: ${(props) => props.theme.space[1]}px;
  font-size: ${(props) => props.theme.fontSizes['sm']};
  opacity: 0.6;
`;

export const Body = styled.span`
  color: #fff;
  font-weight: ${(props) => props.theme.fontWeights.light};
  line-height: 140%;
`;
