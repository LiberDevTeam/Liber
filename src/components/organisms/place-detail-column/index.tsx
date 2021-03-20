import {
  AddCircle as AttachFileIcon,
  Send as SendIcon,
} from '@material-ui/icons';
import { push } from 'connected-react-router';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Input } from '~/components/atoms/input';
import { MessageView } from '~/components/molecules/message-view';
import { SharePlaceDialog } from '~/components/molecules/share-place-dialog';
import { leftPlace } from '~/state/actionCreater';
import {
  openProtectedPlace,
  publishPlaceMessage,
  unsubscribeIpfsNode,
} from '~/state/ducks/p2p/p2pSlice';
import {
  clearUnreadMessages,
  Place,
  selectPlaceMessagesByPID,
} from '~/state/ducks/places/placesSlice';
import { IconButton } from '../../atoms/icon-button';
import { PlaceDetailHeader } from '../../molecules/place-detail-header';
import Observer from '@researchgate/react-intersection-observer';
import { UnreadToast } from '~/components/molecules/unread-toast';
import { PreviewImage } from '~/components/molecules/preview-image';
import readFile from '~/lib/readFile';

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
    margin-left: ${(props) => props.theme.space[6]}px;
    margin-top: ${(props) => props.theme.space[6]}px;
  }
`;

const UploadFileButtonGroup = styled.div`
  position: relative;
  &:active {
    opacity: 0.8;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const StyledIconButton = styled(IconButton)`
  color: ${(props) => props.theme.colors.primary};
  margin-left: ${(props) => props.theme.space[2]}px;

  & > svg {
    font-size: ${(props) => props.theme.fontSizes['4xl']};
  }

  &:disabled {
    color: ${(props) => props.theme.colors.disabled};
  }
`;

const Footer = styled.footer`
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

export type PlaceDetailColumnProps = {
  place: Place;
};

export const PlaceDetailColumn: React.FC<PlaceDetailColumnProps> = React.memo(
  function PlaceDetailColumn({ place }) {
    const messages = useSelector(selectPlaceMessagesByPID(place.id));

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

    const handleRemoveAvatarImage = useCallback((idx: number) => {
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
            return await readFile(file);
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
            place={place}
            onInviteClick={() => setOpen(true)}
            onLeave={() => {
              dispatch(
                leftPlace({ pid: place.id, messageIds: place.messageIds })
              );
              dispatch(unsubscribeIpfsNode({ pid: place.id }));
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
                authorId={m.authorId}
                timestamp={m.postedAt}
                text={m.text}
                attachments={m.attachments}
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
                      onRemove={() => handleRemoveAvatarImage(i)}
                    />
                  ))
                : null}
              <Input
                innerRef={messageInputRef}
                name="text"
                placeholder="Message..."
                value={formik.values.text}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
              />
              <UploadFileButtonGroup>
                <StyledIconButton
                  icon={<AttachFileIcon />}
                  title="Attach file"
                  disabled={formik.isSubmitting}
                  type="button"
                />
                <InputFile
                  ref={attachmentRef}
                  name="attachment"
                  type="file"
                  accept="image/*"
                  onChange={handleChangeAttachment}
                />
              </UploadFileButtonGroup>
              <StyledIconButton
                icon={<SendIcon />}
                title="Send"
                type="submit"
                disabled={
                  formik.values.text === '' && attachmentPreviews.length === 0
                }
              />
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
