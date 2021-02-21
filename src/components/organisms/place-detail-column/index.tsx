import {
  AddCircle as AttacheFileIcon,
  Send as SendIcon,
} from '@material-ui/icons';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Input } from '~/components/atoms/input';
import { MessageView } from '~/components/molecules/message-view';
import { SharePlaceDialog } from '~/components/molecules/share-place-dialog';
import { Message } from '~/state/ducks/places/messagesSlice';
import { Place } from '~/state/ducks/places/placesSlice';
import { IconButton } from '../../atoms/icon-button';
import { PlaceDetailHeader } from '../../molecules/place-detail-header';

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

const validationSchema = Yup.object().shape({
  text: Yup.string().required(),
});

export interface FormValues {
  text: string;
}

export type PlaceDetailColumnProps = {
  place: Place;
  messages: Message[];
  onSubmit: (values: { text: string; file?: File }) => void;
};

export const PlaceDetailColumn: React.FC<PlaceDetailColumnProps> = React.memo(
  function PlaceDetailColumn({ place, messages, onSubmit }) {
    const [files, setFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);
    const formik = useFormik<FormValues>({
      initialValues: {
        text: '',
      },
      validationSchema,
      validateOnMount: true,
      async onSubmit({ text }) {
        // TODO: support multiple files
        onSubmit({ text, file: files[0] });
        formik.resetForm();
        formik.validateForm();
      },
    });

    const handleAttacheFile = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        setFiles([e.currentTarget.files[0]]);
      }
    };

    return (
      <>
        <Root>
          <PlaceDetailHeader
            place={place}
            onInviteClick={() => setOpen(true)}
            onLeave={() => {
              console.log('onLeave');
            }}
          />

          <Messages>
            {messages.map((m) => (
              <MessageView
                key={m.id}
                authorId={m.authorId}
                timestamp={m.postedAt}
                text={m.text}
              />
            ))}
          </Messages>

          <Footer>
            <Form onSubmit={formik.handleSubmit}>
              <Input
                name="text"
                placeholder="Message..."
                value={formik.values.text}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
              />
              <UploadFileButtonGroup>
                <StyledIconButton
                  icon={<AttacheFileIcon />}
                  title="Attache file"
                  disabled={formik.isSubmitting}
                  type="button"
                />
                <InputFile
                  name="avatarImage"
                  type="file"
                  accept="image/*"
                  onChange={handleAttacheFile}
                />
              </UploadFileButtonGroup>
              <StyledIconButton
                icon={<SendIcon />}
                title="Send"
                type="submit"
                disabled={formik.isSubmitting || formik.isValid === false}
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
