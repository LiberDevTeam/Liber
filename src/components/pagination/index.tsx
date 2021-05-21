import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SvgArrowIosBack as LeftIcon } from '../../icons/ArrowIosBack';
import { SvgChevronRight as RightIcon } from '../../icons/ChevronRight';
import { IconButton } from '../icon-button';
import { Input } from '../input';

const Form = styled.form`
  display: flex;
  justify-content: center;
`;

const StyledInput = styled(Input)`
  width: 52px;
  height: 52px;
`;

interface Props {
  current: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

export const Pagination: React.FC<Props> = memo(function Pagination({
  current,
  onChange,
  disabled = false,
  className,
}) {
  const [page, setPage] = useState(current.toString());
  useEffect(() => {
    setPage(current.toString());
  }, [current]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChange(Number(page) || 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    !e.target.validity.patternMismatch && setPage(e.target.value);
  };

  const onPrev = () => {
    const current = Number(page);
    // if the current page is 1, it isn't moved from the current page.
    const prev = current > 1 ? current - 1 : 1;
    setPage(prev.toString());
    onChange(Number(prev) || 1);
  };

  const onNext = () => {
    const current = Number(page);
    // if current page is empty string, assume it 1.
    const next = current ? current + 1 : 1;
    setPage(next.toString());
    onChange(Number(next) || 1);
  };

  return (
    <Form onSubmit={handleSubmit} className={className}>
      <IconButton
        type="button"
        onClick={onPrev}
        disabled={disabled}
        icon={<LeftIcon width="24" height="24" />}
      />
      <StyledInput
        type="text"
        pattern="[0-9]*"
        name="page"
        value={page}
        textCenter
        disabled={disabled}
        onChange={handleChange}
      />
      <IconButton
        type="button"
        onClick={onNext}
        disabled={disabled}
        icon={<RightIcon width="24" height="24" />}
      />
    </Form>
  );
});
