import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfsContent';

type RootProps = {
  bgImg: string;
}

export const Root = styled.div<RootProps>`
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, #000000 125%), url("${props => props.bgImg}");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 25rem;
  width: 100%;
  border-radius: 1.5rem;
  display: flex;
  align-items: flex-end;
  padding: ${props => props.theme.space[3]}px;
`;

export const Content = styled.div`
`;

export const Header = styled.div`
  height: 2.5rem;
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: ${props => props.theme.space[2]}px;
`;

export const Avatar = styled(IpfsContent)`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 1.5rem;
  object-fit: cover;
  border: 1px solid #fff;
  margin-right: ${props => props.theme.space[3]}px;
  filter: drop-shadow(0 .2rem .5rem rgba(0,0,0,0.15));
`

export const Title = styled.div`
  margin-right: ${props => props.theme.space[2]}px;
  font-size: ${props => props.theme.fontSizes['xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
`

export const Timestamp = styled.span`
  margin-top: ${props => props.theme.space[1]}px;
  font-size: ${props => props.theme.fontSizes['sm']};
  font-weight: ${props => props.theme.fontWeights.bold};
  opacity: 0.6;
`;

export const Body = styled.span`
  color: #fff;
  font-weight: ${props => props.theme.fontWeights.light};
  line-height: 140%;
`;
