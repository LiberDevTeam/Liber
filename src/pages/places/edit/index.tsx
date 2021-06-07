import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '~/components/button';
import { Checkbox as BaseCheckbox } from '~/components/checkbox';
import { Input } from '~/components/input';
import { SelectBox } from '~/components/select-box';
import { Textarea } from '~/components/textarea';
import { UploadPhoto } from '~/components/upload-photo';
import { readAsDataURL } from '~/lib/readFile';
import {
  categoryOptions,
  selectPlaceById,
  updatePlace,
} from '~/state/places/placesSlice';
import BaseLayout from '~/templates';

const PAGE_TITLE = 'Edit Chat';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0 ${(props) => props.theme.space[5]}px
    ${(props) => props.theme.space[5]}px;
`;

const StyledUploadPhoto = styled(UploadPhoto)`
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const InputText = styled(Input)`
  margin-top: ${(props) => props.theme.space[2]}px;
`;

const InputPassword = styled(Input)`
  margin-top: ${(props) => props.theme.space[4]}px;
`;

const InputDescription = styled(Textarea)`
  margin-top: ${(props) => props.theme.space[5]}px;
  margin-bottom: ${(props) => props.theme.space[15]}px;
  font-weight: ${(props) => props.theme.fontWeights.thin};
`;

const SubmitButton = styled(Button)`
  margin-top: ${(props) => props.theme.space[4]}px;
`;

const Subtitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const OptionGroup = styled.div`
  margin-bottom: ${(props) => props.theme.space[4]}px;
  padding-bottom: ${(props) => props.theme.space[4]}px;
  border-bottom: ${(props) =>
    props.theme.border.thin(props.theme.colors.gray3)};
`;

const FlagLabel = styled.label`
  align-items: center;
  display: flex;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  margin-bottom: ${(props) => props.theme.space[1]}px;
`;

const Description = styled.div`
  margin-left: ${(props) => props.theme.space[8]}px;
  color: ${(props) => props.theme.colors.secondaryText};
  font-weight: ${(props) => props.theme.fontWeights.thin};
`;

const Checkbox = styled(BaseCheckbox)`
  margin-right: ${(props) => props.theme.space[3]}px;
`;

interface FormValues {
  avatar: File | null;
  category: number | null;
  name: string;
  description: string;
}

const validationSchema = yup.object({
  name: yup.string().required().min(1).max(50),
  description: yup.string().required().min(5).max(200),
  isPrivate: yup.bool(),
  avatar: yup.mixed().required(),
  setPassword: yup.bool(),
  password: yup.string().when('setPassword', {
    is: true,
    then: (s) => s.required().max(50),
  }),
  category: yup.number().required(),
});

export const EditPlace: React.FC = React.memo(function EditPlace() {
  const dispatch = useDispatch();
  const { placeId, address } =
    useParams<{ placeId: string; address: string }>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { t } = useTranslation(['editPlaces', 'categories']);
  const place = useSelector(selectPlaceById(placeId));
  const formik = useFormik<FormValues>({
    initialValues: {
      avatar: null,
      category: place?.category ?? null,
      name: place?.name ?? '',
      description: place?.description ?? '',
    },
    validationSchema,
    async onSubmit({ avatar, category, name, description }) {
      if (avatar && category) {
        dispatch(
          await updatePlace({
            placeId,
            address,
            name,
            description,
            avatar,
            category,
          })
        );
      }
    },
    validateOnChange: false,
  });

  useEffect(() => {
    if (formik.values.avatar) {
      readAsDataURL(formik.values.avatar).then((file) => {
        setAvatarPreview(file);
      });
    } else {
      setAvatarPreview(null);
    }
  }, [formik.values.avatar]);

  useEffect(() => {
    if (place) {
      fetch(`/view/${place.avatarCid}`)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], place.name);
          formik.setFieldValue('avatar', file);
          readAsDataURL(file).then((file) => {
            setAvatarPreview(file);
          });
        });
    }
  }, [place]);

  const handleChangeImage = useCallback(
    (file: File | null) => {
      formik.setFieldValue('avatar', file);
    },
    [formik.setFieldValue]
  );

  return (
    <BaseLayout
      title={PAGE_TITLE}
      backTo="/places"
      description={t('editPlaces:Please fill out a form and submit it')}
    >
      <Form onSubmit={formik.handleSubmit}>
        <StyledUploadPhoto
          name="avatar"
          onChange={handleChangeImage}
          previewSrc={avatarPreview}
          disabled={formik.isSubmitting}
          errorMessage={formik.errors.avatar}
        />

        <SelectBox
          id="chat_category"
          name="category"
          options={categoryOptions}
          onChange={(e) =>
            formik.setFieldValue(
              'category',
              parseInt(e.currentTarget.value, 10)
            )
          }
          disabled={formik.isSubmitting}
          errorMessage={formik.errors.category}
        />

        <InputText
          name="name"
          placeholder={t('editPlaces:Name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          errorMessage={formik.errors.name}
        />
        <InputDescription
          name="description"
          placeholder={t('editPlaces:Description')}
          value={formik.values.description}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          rows={8}
          maxLength={200}
          errorMessage={formik.errors.description}
        />

        <Subtitle>Other Options</Subtitle>

        <SubmitButton
          shape="rounded"
          text={t('editPlaces:Start')}
          variant="solid"
          type="submit"
          height={50}
          // Show loading indicator
          disabled={formik.isSubmitting}
        />
      </Form>
    </BaseLayout>
  );
});
