import React from 'react';
import { TextLink } from '~/components/atoms/text-link';
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const ListItem = styled.li`
  display: contents;
`;

export interface LinkListProps {
  linkList: {
    text: string;
    path: string;
  }[];
}

export const LinkList: React.FC<LinkListProps> = ({ linkList }) => {
  return (
    <List>
      {linkList.map((link, index) => (
        <ListItem key={index}>
          <TextLink to={link.path}>{link.text}</TextLink>
        </ListItem>
      ))}
    </List>
  );
};
