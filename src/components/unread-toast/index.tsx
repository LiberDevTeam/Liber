import { FC, memo } from 'react';
import styled from 'styled-components';
import { IconButton } from '~/components/icon-button';
import { SvgClose } from '~/icons/Close';

const Root = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: ${(props) => props.theme.radii.medium}px;
  box-shadow: ${(props) => props.theme.shadows[1]};
  background-color: ${(props) => props.theme.colors.bg};
`;

const MainButton = styled.button`
  border-color: transparent;
  background: transparent;
  padding: ${(props) => props.theme.space[2]}px;
`;

const CloseButton = styled(IconButton)`
  color: ${(props) => props.theme.colors.secondaryText};
  margin-left: ${(props) => props.theme.space[2]}px;
`;

export interface UnreadToastProps {
  messageCount: number;
  onClick: () => void;
  onClose: () => void;
  className?: string;
}

// TODO: update style
export const UnreadToast: FC<UnreadToastProps> = memo(function UnreadToast({
  messageCount,
  onClick,
  onClose,
  className,
}) {
  return (
    <Root className={className}>
      <MainButton
        onClick={onClick}
      >{`${messageCount} new messages`}</MainButton>
      <CloseButton
        icon={<SvgClose width={24} height={24} />}
        onClick={onClose}
      />
    </Root>
  );
});
