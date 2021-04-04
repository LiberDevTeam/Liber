import styled from 'styled-components';

type RootProps = {
  bgImg: string;
}

export const Root = styled.div<RootProps>`
  background-image: url(${props => props.bgImg})
`;

export const Title = styled.div`
`;

export const Avatar = styled.img`
`

export const Text = styled.div`
`;

export const Timestamp = styled.span`
`;
