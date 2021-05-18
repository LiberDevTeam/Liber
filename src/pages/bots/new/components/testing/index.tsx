import React, { memo } from 'react';
import styled from 'styled-components';
import { Input } from '~/components/input';
import { TestCase } from '~/state/ducks/bots/botsSlice';
import { Button } from '../../../../../components/button';
import { IconButton } from '../../../../../components/icon-button';

const Root = styled.div``;

const Description = styled.p`
  color: ${(props) => props.theme.colors.secondaryText};
  font-weight: ${(props) => props.theme.fontWeights.light};
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const StyledInput = styled(Input)`
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const Subtitle = styled.h2`
  margin-bottom: ${(props) => props.theme.space[4]}px;
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin: ${(props) => `${props.theme.space[2]}px 0 ${props.theme.space[4]}px`};
`;

const Item = styled.div`
  position: relative;
`;

const RemoveButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  border-radius: ${(props) => props.theme.radii.round};
  background-color: ${(props) => props.theme.colors.red};
  color: ${(props) => props.theme.colors.white};
`;

const AddLink = styled.a`
  width: 100%;
  text-align: center;
  margin: ${(props) => `${props.theme.space[8]}px 0 ${props.theme.space[4]}px`};
  display: block;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.primary};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
`;

const RunTestButton = styled(Button)`
  color: ${(props) => props.theme.colors.primary};
  border: ${(props) => props.theme.border.primary.thin};
  background: ${(props) => props.theme.colors.white};
  width: 100%;
  margin-bottom: ${(props) => props.theme.space[4]}px;
`;

const CreateButton = styled(Button)`
  width: 100%;
`;

interface Props {
  testCases?: TestCase[];
  disabled?: boolean;
  onChange: (cases: TestCase[]) => void;
}

export const Testing: React.FC<Props> = memo(function Editor({
  testCases = [{ title: '', input: '', output: '' }],
  disabled,
  onChange,
}) {
  const handleRemove = (index: number) => () =>
    onChange(testCases.slice(0, index).concat(testCases.slice(index + 1)));
  const handleAdd = () =>
    onChange([...testCases, { title: '', input: '', output: '' }]);
  return <Root></Root>;
});
