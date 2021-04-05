import { push } from 'connected-react-router';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Input } from '~/components/input';
import { MessageView } from '~/components/messageView';
import { removePlace } from '~/state/ducks/places/placesSlice';
import {
  openProtectedPlace,
  publishPlaceMessage,
} from '~/state/ducks/p2p/p2pSlice';
import {
  clearUnreadMessages,
  Place,
  selectPlaceMessagesByPID,
} from '~/state/ducks/places/placesSlice';
import { IconButton } from '../iconButton';
import { PlaceDetailHeader } from '../placeDetailHeader';
import Observer from '@researchgate/react-intersection-observer';
import { UnreadToast } from '~/components/unreadToast';
import { PreviewImage } from '~/components/previewImage';
import { readAsDataURL } from '~/lib/readFile';
import { selectMe } from '../../state/ducks/me/meSlice';
import { SvgSmilingFace as StickerIcon } from '../../icons/SmilingFace';
import { SvgAttach as AttachIcon } from '../../icons/Attach';
import { SvgNavigation as SendIcon } from '../../icons/Navigation';
import { theme } from '~/theme';
import { SharePlaceDialog } from '../share-place-dialog';
import { lighten } from 'polished';

const Root = styled.div`
  display: flex;
  height: 100%;
  flex-flow: column;
  justify-content: space-between;
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
  flex-grow: 1;
  overflow-y: auto;
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

const Footer = styled.footer`
  flex: 1;
  display: flex;
  position: relative;
  bottom: 0;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.space[4]}px;
  padding-bottom: ${(props) => props.theme.space[1]}px;
`;

const Form = styled.form`
  display: contents;
`;

export interface FormValues {
  text: string;
}

export interface PlaceDetailColumnProps {
  place: Place;
}

export const PlaceDetailColumn: React.FC<PlaceDetailColumnProps> = React.memo(
  function PlaceDetailColumn({ place }) {
    const messages = useSelector(selectPlaceMessagesByPID(place.id));
    const me = useSelector(selectMe);

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
        dispatch(publishPlaceMessage({ pid: place.id, text, attachments }));

        formik.resetForm();
        formik.validateForm();
        messageInputRef.current?.focus();
        messagesBottomRef.current?.scrollIntoView();
      },
    });

    // Scroll to bottom when open chat
    useEffect(() => {
      messagesBottomRef.current?.scrollIntoView();
    }, [place.id]);

    const handleIntersection = useCallback(
      (e) => {
        if (e.isIntersecting && place?.unreadMessages) {
          dispatch(clearUnreadMessages(place.id));
        }
      },
      [dispatch, place?.unreadMessages, place.id]
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
        dispatch(clearUnreadMessages(place.id));
      }
    }, [dispatch, place?.unreadMessages, place.id]);

    const handlePasswordEnter = useCallback(() => {
      dispatch(openProtectedPlace({ password, placeId: place.id }));
    }, [dispatch, place.id, password]);

    return (
      <>
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
                name={m.authorId}
                timestamp={m.postedAt}
                text={m.text}
                attachmentCidList={m.attachmentCidList}
                mine={m.authorId === me.id}
                userImage={''}
              />
            ))}
            <Observer onChange={handleIntersection}>
              <div ref={messagesBottomRef} />
            </Observer>
          </Messages>

          <Footer>
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
              {attachmentPreviews
                ? attachmentPreviews.map((preview, i) => (
                    <PreviewImage
                      key={attachments[i].name}
                      src={preview}
                      onRemove={() => handleRemoveAvatar(i)}
                    />
                  ))
                : null}
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
                      onClick={() => null}
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
        <SharePlaceDialog
          open={open}
          url={place.invitationUrl}
          onClose={() => setOpen(false)}
        />
      </>
    );
  }
);
