import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const SectionTitle = styled.p`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.secondaryText};
`;

const SectionDescription = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  color: ${(props) => props.theme.colors.secondaryText};
`;

const SectionMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: ${(props) => props.theme.space[3]}px 0;
`;

export interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  description = '',
  children,
}) => {
  return (
    <Container>
      <SectionTitle>{title}</SectionTitle>
      <SectionDescription>{description}</SectionDescription>
      <SectionMain>{children}</SectionMain>
    </Container>
  );
};
