import Observer from '@researchgate/react-intersection-observer';
import { immutable as arrayUniq } from 'array-unique';
import { push } from 'connected-react-router';
import { BaseEmoji, Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { useFormik } from 'formik';
import { lighten } from 'polished';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { IconButton } from '~/components/icon-button';
import { Input } from '~/components/input';
import { MessageView } from '~/components/message-view';
import { PasswordDialog } from '~/components/password-dialog';
import { PreviewImage } from '~/components/preview-image';
import { SharePlaceDialog } from '~/components/share-place-dialog';
import { UnreadToast } from '~/components/unread-toast';
import { UserMenu } from '~/components/user-menu';
import { invitationUrl } from '~/helpers';
import { SvgAttach as AttachIcon } from '~/icons/Attach';
import { SvgNavigation as SendIcon } from '~/icons/Navigation';
import { SvgSmilingFace as StickerIcon } from '~/icons/SmilingFace';
import { readAsDataURL } from '~/lib/readFile';
import { LoadingPage } from '~/pages/loading';
import { selectMe } from '~/state/me/meSlice';
import { publishPlaceMessage } from '~/state/p2p/p2pSlice';
import {
  banUser,
  clearUnreadMessages,
  joinPlace,
  removePlace,
  selectPlaceById,
  selectPlaceMessagesByPlaceId,
} from '~/state/places/placesSlice';
import { loadUsers } from '~/state/users/usersSlice';
import BaseLayout from '~/templates';
import { theme } from '~/theme';
import { PlaceDetailHeader } from './components/place-detail-header';

const Root = styled.div`
  padding: ${(props) =>
    `${props.theme.space[14]}px 0 ${props.theme.space[22]}px`};
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
  padding: ${(props) =>
    `0 ${props.theme.space[3]}px 0 ${props.theme.space[2]}px`};
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
  padding-top: ${(props) => props.theme.space[2]}px;
  display: flex;
  overflow-x: auto;
  align-items: center;
  width: 100%;
  background: white;
`;

const Attachment = styled(PreviewImage)`
  margin: 9px ${(props) => props.theme.space[3]}px
    ${(props) => props.theme.space[2]}px;
`;

const Footer = styled.footer`
  position: fixed;
  background: ${(props) => props.theme.colors.white};
  right: 0;
  left: 0;
  bottom: 0;
  padding: ${(props) =>
    `${props.theme.space[2]}px 0 ${props.theme.space[5]}px`};
  border-top: ${(props) => props.theme.border.grayLight.light};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.space[3]}px;
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
  const { placeId, address } = useParams<{
    placeId: string;
    address: string;
  }>();
  const place = useSelector(selectPlaceById(placeId));
  const messages = useSelector(selectPlaceMessagesByPlaceId(placeId));
  const userIds = arrayUniq(messages.map((m) => m.uid));
  const me = useSelector(selectMe);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const dispatch = useDispatch();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<
    (string | Icon)[]
  >([]);

  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesBottomRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(joinPlace({ placeId, address }));
  }, [placeId, address]);

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

  useEffect(() => {
    dispatch(
      loadUsers({
        userIds,
      })
    );
  }, [dispatch, JSON.stringify(userIds)]);

  // Scroll to bottom when open chat
  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView();
  }, [placeId]);

  const handleIntersection = useCallback(
    (e) => {
      if (e.isIntersecting && place?.unreadMessages) {
        dispatch(clearUnreadMessages(placeId));
      }
    },
    [dispatch, place?.unreadMessages, placeId]
  );

  const handleRemoveAvatar = useCallback((idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i != idx));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i != idx));
  }, []);

  const handleBanUser = useCallback(
    (userId: string) => {
      if (place?.id) {
        dispatch(banUser({ userId, placeId: place.id }));
      }
    },
    [dispatch, place?.id]
  );

  const handleChangeAttachment = async () => {
    if (attachmentRef.current?.files) {
      const files = Array.from(attachmentRef.current.files);
      const previews = await Promise.all(
        Array.from(files).map(async (file, i) => {
          if (file.type.match(/video\/.*/)) {
            return '/img/play-button.svg';
          } else if (file.type.match(/audio\/.*/)) {
            return '/img/play-button.svg';
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

  const handleClearUnread = useCallback(() => {
    if (place?.unreadMessages) {
      dispatch(clearUnreadMessages(placeId));
    }
  }, [dispatch, place?.unreadMessages, placeId]);

  if (!place) {
    return <LoadingPage text="Connecting to place..." />;
  }

  return (
    <>
      <BaseLayout>
        <Root>
          <PlaceDetailHeader
            placeId={place.id}
            address={place.keyValAddress}
            name={place.name}
            avatarCid={place.avatarCid}
            onInviteClick={() => {
              setOpen(true);
            }}
            memberCount={23}
            description={place.description}
            onLeave={() => {
              dispatch(removePlace({ placeId: place.id }));
              dispatch(push('/places'));
            }}
          />

          {place.passwordRequired && place.hash === undefined && (
            <PasswordDialog
              placeId={place.id}
              onClose={() => {
                dispatch(removePlace({ placeId: place.id }));
                dispatch(push('/places'));
              }}
            />
          )}

          <Messages>
            {messages.map((m) => (
              <MessageView
                id={m.id}
                uid={m.uid}
                key={m.id}
                timestamp={m.timestamp}
                text={m.text}
                attachmentCidList={m.attachmentCidList}
                mine={m.uid === me.id}
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
                  <Attachment
                    key={`${i}${attachments[i].name}`}
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
              <Controls>
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
            </Form>
          </Footer>
        </Root>
      </BaseLayout>
      <SharePlaceDialog
        open={open}
        url={invitationUrl(place.id, place.keyValAddress)}
        onClose={() => setOpen(false)}
      />
      <UserMenu onBan={handleBanUser} />
    </>
  );
});
