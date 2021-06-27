import { BaseEmoji, Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { useFormik } from 'formik';
import { lighten } from 'polished';
import React, { memo, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '~/components/icon-button';
import { Input } from '~/components/input';
import { PreviewImage } from '~/components/preview-image';
import { useAppSelector } from '~/hooks';
import { SvgAttach as AttachIcon } from '~/icons/Attach';
import { SvgNavigation as SendIcon } from '~/icons/Navigation';
import { SvgSmilingFace as StickerIcon } from '~/icons/SmilingFace';
import { readAsDataURL } from '~/lib/readFile';
import { publishPlaceMessage } from '~/state/places/messagesSlice';
import { useReduxDispatch } from '~/state/store';
import { selectAllUsers } from '~/state/users/usersSlice';
import { theme } from '~/theme';
import { AudioPreview } from '../audio-preview';
import { VideoPreview } from '../video-preview';

const Root = styled.form`
  display: contents;
`;

const InputFile = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  width: 100%;
  border: 0;
`;

const TextInput = styled(Input)`
  flex: 1;
  padding-left: ${(props) => props.theme.space[1]}px;
`;

const Attachments = styled.div`
  position: absolute;
  bottom: 100%;
  padding-top: ${(props) => props.theme.space[2]}px;
  display: flex;
  overflow-x: auto;
  align-items: center;
  width: 100%;
  background: white;

  & > * {
    margin: 9px ${(props) => props.theme.space[3]}px
      ${(props) => props.theme.space[2]}px;
  }
`;

const MessageActions = styled.div`
  display: flex;

  & > * {
    margin-left: ${(props) => props.theme.space[3]}px;
    color: ${(props) => props.theme.colors.secondaryText};

    &:first-child {
      margin-left: 0;
    }
  }
`;

const UploadFileButtonGroup = styled.div`
  position: relative;
  width: 28px;
  height: 28px;

  &:active {
    opacity: 0.8;
  }
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  right: ${(props) => props.theme.space[4]}px;
  margin-bottom: ${(props) => props.theme.space[2]}px;
  bottom: 100%;
`;

const StyledIconButton = styled.button`
  display: inline-flex;
  width: 54px;
  height: 54px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  margin-left: ${(props) => props.theme.space[2]}px;
  border-radius: ${(props) => props.theme.radii.round};
  border: none;

  &:hover {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => lighten(0.1, props.theme.colors.primary)};
  }

  &:active {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => lighten(0.2, props.theme.colors.primary)};
  }

  &:disabled {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.colors.disabled};
  }

  & > svg {
    transform: rotate(90deg);
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.space[3]}px;
`;

const MentionListWrapper = styled.div`
  padding: ${(props) => props.theme.space[3]}px;
`;

const MentionList = styled.ul`
  padding: ${(props) => props.theme.space[2]}px;
  box-shadow: ${(props) => props.theme.shadows[1]};
  border-radius: ${(props) => props.theme.radii.medium}px;
`;

const MentionListItem = styled.li`
  padding: ${(props) => props.theme.space[1]}px;
  cursor: pointer;
`;

export interface FormValues {
  text: string;
}

export interface MessageInputProps {
  placeId: string;
}

export const MessageInput: React.FC<MessageInputProps> = memo(
  function MessageInput({ placeId }) {
    const dispatch = useReduxDispatch();

    const users = useAppSelector((state) => selectAllUsers(state.users));

    const [attachments, setAttachments] = useState<File[]>([]);
    const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [mentionTarget, setMentionTarget] =
      useState<{ word: string; start: number; end: number } | null>(null);

    const messageInputRef = useRef<HTMLInputElement>(null);
    const messagesBottomRef = useRef<HTMLDivElement>(null);
    const attachmentRef = useRef<HTMLInputElement>(null);

    const handleRemoveAvatar = useCallback((idx: number) => {
      setAttachments((prev) => prev.filter((_, i) => i != idx));
      setAttachmentPreviews((prev) => prev.filter((_, i) => i != idx));
    }, []);

    const handleChangeAttachment = async () => {
      if (attachmentRef.current?.files) {
        const files = Array.from(attachmentRef.current.files);
        const previews = await Promise.all(
          Array.from(files).map(async (file) => {
            if (file.type.match(/video\/.*/)) {
              return 'video-preview';
            } else if (file.type.match(/audio\/.*/)) {
              return 'audio-preview';
            } else {
              return await readAsDataURL(file);
            }
          })
        );

        setAttachments((prev) => [...prev, ...files]);
        setAttachmentPreviews((prev) => [...prev, ...previews]);

        attachmentRef.current.value = '';
      }
    };

    const formik = useFormik<FormValues>({
      initialValues: {
        text: '',
      },
      validateOnMount: true,
      async onSubmit({ text }) {
        dispatch(publishPlaceMessage({ placeId, text, attachments }));

        formik.resetForm();
        formik.validateForm();
        messageInputRef.current?.focus();
        messagesBottomRef.current?.scrollIntoView();

        setAttachmentPreviews([]);
        setAttachments([]);
      },
    });

    const handleOnSelect = useCallback(() => {
      if (!messageInputRef.current) {
        setMentionTarget(null);
        return;
      }

      if (messageInputRef.current.selectionStart === null) {
        setMentionTarget(null);
        return;
      }

      const words = formik.values.text
        .slice(0, messageInputRef.current.selectionStart)
        .split(' ');

      if (!words) {
        setMentionTarget(null);
        return;
      }

      const currentPositionWord = words[words.length - 1];

      if (currentPositionWord[0] !== '@') {
        setMentionTarget(null);
        return;
      }

      const word = currentPositionWord.slice(1);
      setMentionTarget({
        word,
        start: messageInputRef.current.selectionStart - word.length,
        end: messageInputRef.current.selectionStart,
      });
    }, [formik.values.text]);

    const mentionList = mentionTarget
      ? users.filter((user) => user.username?.includes(mentionTarget.word))
      : [];

    return (
      <>
        {mentionList.length > 0 ? (
          <MentionListWrapper>
            <MentionList>
              {mentionList.map((user) => (
                <MentionListItem
                  key={`mention-${user.id}`}
                  onClick={() => {
                    if (mentionTarget) {
                      formik.setFieldValue(
                        'text',
                        formik.values.text.slice(0, mentionTarget.start) +
                          `${user.username} ` +
                          formik.values.text.slice(mentionTarget.end)
                      );
                      setMentionTarget(null);
                    }
                  }}
                >
                  @{user.username}
                </MentionListItem>
              ))}
            </MentionList>
          </MentionListWrapper>
        ) : null}
        {attachmentPreviews ? (
          <Attachments>
            {attachmentPreviews.map((preview, i) => {
              if (preview === 'video-preview') {
                return (
                  <VideoPreview
                    key={i}
                    onRemove={() => handleRemoveAvatar(i)}
                  />
                );
              }
              if (preview === 'audio-preview') {
                return (
                  <AudioPreview
                    key={i}
                    onRemove={() => handleRemoveAvatar(i)}
                  />
                );
              } else {
                return (
                  <PreviewImage
                    key={i}
                    src={preview}
                    onRemove={() => handleRemoveAvatar(i)}
                  />
                );
              }
            })}
          </Attachments>
        ) : null}
        {showEmojiPicker ? (
          <EmojiPickerContainer>
            <Picker
              native
              onSelect={(emoji) => {
                formik.setFieldValue(
                  'text',
                  formik.values.text + ` ${(emoji as BaseEmoji).native} `
                );
                setShowEmojiPicker(false);
              }}
            />
          </EmojiPickerContainer>
        ) : null}
        <Root onSubmit={formik.handleSubmit}>
          <Controls>
            <TextInput
              innerRef={messageInputRef}
              name="text"
              onSelect={handleOnSelect}
              placeholder="Message..."
              value={formik.values.text}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              actions={
                <MessageActions>
                  <IconButton
                    type="button"
                    icon={<StickerIcon width={24} height={24} />}
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                  />
                  <UploadFileButtonGroup>
                    <IconButton
                      type="button"
                      icon={<AttachIcon width={24} height={24} />}
                      onClick={() => null}
                      title="Attach file"
                      disabled={formik.isSubmitting}
                      color={theme.colors.secondaryText}
                    />
                    <InputFile
                      ref={attachmentRef}
                      name="attachment"
                      type="file"
                      accept="image/*,audio/*,video/*"
                      onChange={handleChangeAttachment}
                    />
                  </UploadFileButtonGroup>
                </MessageActions>
              }
            />

            <StyledIconButton
              title="Send"
              type="submit"
              disabled={
                formik.values.text === '' && attachmentPreviews.length === 0
              }
            >
              <SendIcon width={20} height={20} />
            </StyledIconButton>
          </Controls>
        </Root>
      </>
    );
  }
);
