import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PageTitle } from '~/components/atoms/page-title';
import styled from 'styled-components';
import BaseLayout from '~/templates';
import { Input } from '~/components/atoms/input';
import { Button } from '~/components/atoms/button';
import { Textarea } from '~/components/atoms/textarea';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { createNewPlace } from '~/state/ducks/p2p/p2pSlice';
import { PreviewImage } from '~/components/molecules/preview-image';
import readFile from '~/lib/readFile';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const PAGE_TITLE = 'Create new place';

const Description = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  word-break: break-all;
  margin-top: ${(props) => props.theme.space[7]}px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputText = styled(Input)`
  margin-top: ${(props) => props.theme.space[8]}px;
`;
const InputDescription = styled(Textarea)`
  margin-top: ${(props) => props.theme.space[5]}px;
`;
const PrivateFlagGroup = styled.div`
  margin-top: ${(props) => props.theme.space[5]}px;
`;

const InputFile = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
`;
const UploadFileButtonGroup = styled.div`
  position: relative;
  &:active {
    opacity: 0.8;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: ${(props) => props.theme.space[8]}px;
`;

interface FormValues {
  name: string;
  description: string;
  isPrivate: boolean;
  avatarImage: File | null;
  password?: string;
}

const validationSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  isPrivate: yup.bool(),
  avatarImage: yup.mixed().test('not null', '', (value) => value !== null),
  password: yup.string(),
});

export const NewPlace: React.FC = React.memo(function NewPlace() {
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(['newPlaces']);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      isPrivate: false,
      avatarImage: null,
    },
    validationSchema,
    async onSubmit({ name, description, isPrivate, avatarImage, password }) {
      if (avatarImage) {
        dispatch(
          createNewPlace({
            name,
            description,
            isPrivate,
            avatarImage,
            password,
          })
        );
      }
    },
  });

  useEffect(() => {
    if (formik.values.avatarImage) {
      readFile(formik.values.avatarImage).then((file) => {
        setAvatarPreview(file);
      });
    }
  }, [formik.values.avatarImage]);

  const handleChangeImage = async () => {
    if (avatarInputRef.current?.files && avatarInputRef.current.files[0]) {
      formik.setFieldValue('avatarImage', avatarInputRef.current.files[0]);
    }
  };

  const handleRemoveAvatarImage = useCallback(() => {
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
    setAvatarPreview(null);
    formik.setFieldValue('avatarImage', null);
  }, [formik]);

  return (
    <BaseLayout>
      <PageTitle>{PAGE_TITLE}</PageTitle>
      <Description>
        {t('newPlaces:Please fill out a form and submit it')}
      </Description>

      <Form onSubmit={formik.handleSubmit}>
        <InputText
          name="name"
          placeholder={t('newPlaces:Name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
        />
        <InputDescription
          name="description"
          placeholder={t('newPlaces:Description')}
          value={formik.values.description}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
        />
        <InputText
          name="password"
          type="password"
          placeholder={t('newPlaces:Password')}
          value={formik.values.password}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
        />

        {avatarPreview ? (
          <PreviewImage
            src={avatarPreview}
            onRemove={handleRemoveAvatarImage}
          />
        ) : null}
        <UploadFileButtonGroup>
          <Button
            text={t('newPlaces:Select Thumbnail Image')}
            shape="square"
            type="button"
          />
          <InputFile
            ref={avatarInputRef}
            name="avatarImage"
            type="file"
            accept="image/*"
            onChange={handleChangeImage}
          />
        </UploadFileButtonGroup>

        <PrivateFlagGroup role="group">
          <label>
            <input
              name="isPrivate"
              type="checkbox"
              checked={formik.values.isPrivate}
              onChange={formik.handleChange}
            />
            {t('newPlaces:Make private')}
          </label>
        </PrivateFlagGroup>

        <SubmitButton
          shape="square"
          text={t('newPlaces:Submit')}
          variant="solid"
          type="submit"
          disabled={
            formik.isSubmitting ||
            formik.isValid === false ||
            formik.dirty === false
          }
        />
      </Form>
    </BaseLayout>
  );
});
