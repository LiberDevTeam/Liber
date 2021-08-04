import { createPopper } from '@popperjs/core';
import { BaseEmoji, emojiIndex, Picker } from 'emoji-mart';
import { lighten } from 'polished';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SvgPlus } from '~/icons/Plus';
import { SvgSmilingFace } from '~/icons/SmilingFace';
import { Reaction } from '~/state/places/type';

const Root = styled.div`
  display: grid;
  gap: ${(props) => props.theme.space[2]}px;
  max-width: 60vw;
  grid-template-columns: repeat(auto-fit, 50px);
`;

const PickerWrapper = styled.div``;

const AddButton = styled.button`
  color: ${(props) => props.theme.colors.secondaryText};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 54px;
  border: none;
  border-radius: ${(props) => props.theme.radii.large}px;
  background: ${(props) => props.theme.colors.bgGray};
  cursor: pointer;

  & > svg {
    width: 16px;
    height: 16px;
  }

  &:active {
    background: ${(props) => lighten(0.02, props.theme.colors.bgGray)};
  }
`;

const ReactionButton = styled.button<{ me: boolean }>`
  color: ${(props) => props.theme.colors.primaryText};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.space[1]}px;
  height: 28px;
  width: 54px;
  border: 1px solid
    ${(props) =>
      props.me ? props.theme.colors.lightPrimary : props.theme.colors.gray};
  border-radius: ${(props) => props.theme.radii.large}px;
  background: ${(props) =>
    props.me ? props.theme.colors.bgPrimary : props.theme.colors.white};
  cursor: pointer;

  & > svg {
    width: 16px;
    height: 16px;
  }

  &:active {
    background: ${(props) => props.theme.colors.gray};
  }
`;

const getEmoji = (emojiId: string): BaseEmoji => {
  const match = emojiIndex.emojis[emojiId];

  if ('1' in match) {
    // use default skin
    return match['1'] as BaseEmoji;
  }

  return match as BaseEmoji;
};

interface Props {
  id: string;
  myId: string;
  onClick: (props: { messageId: string; emojiId: string }) => void;
  reactions: Reaction[];
  className?: string;
}

// TODO: Refactor emoji picker positioning
export const Reactions: React.FC<Props> = ({
  id,
  myId,
  onClick,
  reactions,
  className,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (buttonRef.current && pickerRef.current && showPicker) {
      const popper = createPopper(buttonRef.current, pickerRef.current, {
        placement: 'bottom',
      });
      return () => popper.destroy();
    }
  }, [buttonRef, pickerRef, showPicker]);

  return (
    <Root className={className}>
      {reactions.map((v) =>
        emojiIndex.emojis[v.emojiId] ? (
          <ReactionButton
            key={`${id}-${v.emojiId}`}
            me={v.userIds.includes(myId)}
            onClick={() => {
              onClick({ messageId: id, emojiId: v.emojiId });
            }}
          >
            <span>{getEmoji(v.emojiId).native}</span>
            {v.userIds.length}
          </ReactionButton>
        ) : null
      )}
      <AddButton
        ref={buttonRef}
        onClick={(e) => {
          setShowPicker(!showPicker);
        }}
      >
        <SvgPlus fontSize={20} />
        <SvgSmilingFace />
      </AddButton>
      {showPicker ? (
        <PickerWrapper ref={pickerRef}>
          <Picker
            native
            onSelect={(emoji) => {
              if (emoji.id) {
                onClick({ messageId: id, emojiId: emoji.id });
              }
              setShowPicker(false);
            }}
          />
        </PickerWrapper>
      ) : null}
    </Root>
  );
};
