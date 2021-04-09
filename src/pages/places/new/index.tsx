import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { readAsDataURL } from '~/lib/readFile';
import { createNewPlace } from '~/state/ducks/p2p/p2pSlice';
import BaseLayout from '~/templates';
import { Button } from '../../../components/button';
import { Input } from '../../../components/input';
import { PreviewImage } from '../../../components/preview-image';
import { Textarea } from '../../../components/textarea';
import { categories } from '../../../state/ducks/places/placesSlice';

const PAGE_TITLE = 'New Chat';

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
  avatar: File | null;
  password?: string;
  category: number;
}

const validationSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  isPrivate: yup.bool(),
  avatar: yup.mixed().test('not null', '', (value) => value !== null),
  password: yup.string(),
  category: yup.number().required(),
});

export const NewPlace: React.FC = React.memo(function NewPlace() {
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(['newPlaces', 'categories']);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      isPrivate: false,
      avatar: null,
      category: 0,
    },
    validationSchema,
    async onSubmit({
      name,
      description,
      isPrivate,
      avatar,
      password,
      category,
    }) {
      if (avatar) {
        dispatch(
          createNewPlace({
            name,
            description,
            isPrivate,
            avatar,
            password,
            category,
          })
        );
      }
    },
  });

  useEffect(() => {
    if (formik.values.avatar) {
      readAsDataURL(formik.values.avatar).then((file) => {
        setAvatarPreview(file);
      });
    }
  }, [formik.values.avatar]);

  const handleChangeImage = async () => {
    if (avatarInputRef.current?.files && avatarInputRef.current.files[0]) {
      formik.setFieldValue('avatar', avatarInputRef.current.files[0]);
    }
  };

  const handleRemoveAvatar = useCallback(() => {
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
    setAvatarPreview(null);
    formik.setFieldValue('avatar', null);
  }, [formik]);

  return (
    <BaseLayout
      title={PAGE_TITLE}
      backTo="/places"
      description={t('newPlaces:Please fill out a form and submit it')}
    >
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
          <PreviewImage src={avatarPreview} onRemove={handleRemoveAvatar} />
        ) : null}
        <UploadFileButtonGroup>
          <Button
            text={t('newPlaces:Select Thumbnail Image')}
            shape="square"
            type="button"
          />
          <InputFile
            ref={avatarInputRef}
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleChangeImage}
          />
        </UploadFileButtonGroup>

        <select id="category" name="category">
          {categories.map((value, index) => (
            <option key={value} value={index}>
              {t(`categories:${value}`)}
            </option>
          ))}
        </select>

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
          text={t('newPlaces:Start')}
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
