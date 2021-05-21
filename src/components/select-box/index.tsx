import React, { ReactEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SvgArrowDown } from '~/icons/ArrowDown';
import { ErrorMessage } from '../error-message';

const Root = styled.div`
  position: relative;
`;

const StyledSelect = styled.select`
  height: 50px;
  border-radius: 25px;
  border: none;
  background: ${(props) => props.theme.colors.bgGray};
  padding: ${(props) => props.theme.space[4]}px
    ${(props) => props.theme.space[5]}px;
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.primaryText};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;

  &:focus {
    box-shadow: 0 0 1px 1px ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    outline: none;
  }
`;

const DefaultOption = styled.option`
  color: ${(props) => props.theme.colors.primaryText};
`;

const ArrowDownIcon = styled(SvgArrowDown)`
  right: ${(props) => props.theme.space[2]}px;
  width: 20px;
  height: 20px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
`;

interface Props {
  id: string;
  name: string;
  options: string[];
  errorMessage?: string;
  onChange: ReactEventHandler<HTMLSelectElement>;
  disabled: boolean;
}

export const SelectBox: React.FC<Props> = React.memo(function Select({
  id,
  name,
  options,
  errorMessage,
  onChange,
  disabled,
}) {
  const { t } = useTranslation(['selectOptions']);
  return (
    <Root>
      <StyledSelect
        onChange={onChange}
        id={id}
        name={name}
        defaultValue=""
        disabled={disabled}
      >
        <DefaultOption value="">{t(`selectOptions:DEFAULT`)}</DefaultOption>
        {options.map((option) => (
          <option key={option} value={option}>
            {t(`selectOptions:${id.toUpperCase()}_${option}`)}
          </option>
        ))}
      </StyledSelect>
      <ArrowDownIcon />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Root>
  );
});
