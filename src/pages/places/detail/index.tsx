import 'emoji-mart/css/emoji-mart.css';
import Observer from '@researchgate/react-intersection-observer';
import { push } from 'connected-react-router';
import { useFormik } from 'formik';
import { lighten } from 'polished';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { readAsDataURL } from '~/lib/readFile';
import {
  openProtectedPlace,
  publishPlaceMessage,
} from '~/state/ducks/p2p/p2pSlice';
import {
  clearUnreadMessages,
  removePlace,
  selectPlaceMessagesByPID,
} from '~/state/ducks/places/placesSlice';
import { theme } from '../../../theme';
import { IconButton } from '../../../components/icon-button';
import { Input } from '../../../components/input';
import { MessageView } from '../../../components/message-view';
import { PlaceDetailHeader } from '../../../components/place-detail-header';
import { PreviewImage } from '../../../components/preview-image';
import { SharePlaceDialog } from '../../../components/share-place-dialog';
import { UnreadToast } from '../../../components/unread-toast';
import { SvgAttach as AttachIcon } from '../../../icons/Attach';
import { SvgNavigation as SendIcon } from '../../../icons/Navigation';
import { SvgSmilingFace as StickerIcon } from '../../../icons/SmilingFace';
import { selectMe } from '../../../state/ducks/me/meSlice';
import { selectPlaceById } from '../../../state/ducks/places/placesSlice';
import BaseLayout from '../../../templates';
import { Picker, BaseEmoji } from 'emoji-mart';

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column;
  padding-bottom: ${(props) => props.theme.space[10]}px;
  overflow: hidden;
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

const ToastWrapper = styled.div`
  position: absolute;
  display: block;
  text-align: center;
  top: -60px;
  left: 0;
  right: 0;
  margin-bottom: ${(props) => props.theme.space[6]}px;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: ${(props) => props.theme.space[2]}px;
  & > * {
    margin-top: ${(props) => props.theme.space[5]}px;
  }
`;

const MessageInput = styled(Input)`
  flex: 1;
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

const Attachments = styled.div`
  position: absolute;
  bottom: 100%;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const Footer = styled.footer`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  right: ${(props) => props.theme.space[4]}px;
  margin-bottom: ${(props) => props.theme.space[2]}px;
  bottom: 100%;
`;

const Form = styled.form`
  display: contents;
`;

export interface FormValues {
  text: string;
}

export const ChatDetail: React.FC = React.memo(function ChatDetail() {
  const { pid } = useParams<{ pid: string }>();
  const place = useSelector(selectPlaceById(pid));
  const messages = useSelector(selectPlaceMessagesByPID(pid));
  const me = useSelector(selectMe);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const dispatch = useDispatch();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [password, setPassword] = useState('');

  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesBottomRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      text: '',
    },
    validateOnMount: true,
    async onSubmit({ text }) {
      dispatch(publishPlaceMessage({ pid, text, attachments }));

      formik.resetForm();
      formik.validateForm();
      messageInputRef.current?.focus();
      messagesBottomRef.current?.scrollIntoView();
    },
  });

  // Scroll to bottom when open chat
  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView();
  }, [pid]);

  const handleIntersection = useCallback(
    (e) => {
      if (e.isIntersecting && place?.unreadMessages) {
        dispatch(clearUnreadMessages(pid));
      }
    },
    [dispatch, place?.unreadMessages, pid]
  );

  const handleRemoveAvatar = useCallback((idx: number) => {
    if (attachmentRef.current) {
      attachmentRef.current.value = '';
    }
    setAttachments((prev) => prev.filter((_, i) => i != idx));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i != idx));
  }, []);

  const handleChangeAttachment = async () => {
    if (attachmentRef.current?.files) {
      const files = Array.from(attachmentRef.current?.files);
      const previews = await Promise.all(
        Array.from(files).map(async (file, i) => {
          console.log(file.type);
          return await readAsDataURL(file);
        })
      );

      setAttachments((prev) => [...prev, ...files]);
      setAttachmentPreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleClearUnread = useCallback(() => {
    if (place?.unreadMessages) {
      dispatch(clearUnreadMessages(pid));
    }
  }, [dispatch, place?.unreadMessages, pid]);

  const handlePasswordEnter = useCallback(() => {
    dispatch(openProtectedPlace({ password, placeId: pid }));
  }, [dispatch, pid, password]);

  if (!place) {
    return <div>404</div>;
  }

  return (
    <>
      <BaseLayout>
        <Root>
          <PlaceDetailHeader
            name={place.name}
            avatarCid={place.avatarCid}
            onInviteClick={() => {
              setOpen(true);
            }}
            memberCount={23}
            onLeave={() => {
              dispatch(removePlace({ pid: place.id }));
              dispatch(push('/places'));
            }}
          />

          {place.passwordRequired && place.hash === undefined && (
            <>
              <div>password required</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <button onClick={handlePasswordEnter}>enter</button>
            </>
          )}

          <Messages>
            {messages.map((m) => (
              <MessageView
                key={m.id}
                name={m.uid}
                timestamp={m.timestamp}
                text={m.text}
                attachmentCidList={m.attachmentCidList}
                mine={m.uid === me.id}
                userImage={''}
              />
            ))}
            <Observer onChange={handleIntersection}>
              <div ref={messagesBottomRef} />
            </Observer>
          </Messages>

          <Footer>
            {attachmentPreviews ? (
              <Attachments>
                {attachmentPreviews.map((preview, i) => (
                  <PreviewImage
                    key={attachments[i].name}
                    src={preview}
                    onRemove={() => handleRemoveAvatar(i)}
                  />
                ))}
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

            {place.unreadMessages?.length > 0 ? (
              <ToastWrapper>
                <UnreadToast
                  messageCount={place.unreadMessages.length}
                  onClose={handleClearUnread}
                  onClick={() => {
                    messagesBottomRef.current?.scrollIntoView();
                  }}
                />
              </ToastWrapper>
            ) : null}

            <Form onSubmit={formik.handleSubmit}>
              <MessageInput
                innerRef={messageInputRef}
                name="text"
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
                        accept="image/*"
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
            </Form>
          </Footer>
        </Root>
      </BaseLayout>
      <SharePlaceDialog
        open={open}
        url={place.invitationUrl}
        onClose={() => setOpen(false)}
      />
    </>
  );
});
