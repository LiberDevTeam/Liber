import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '~/components/button';
import { Checkbox as BaseCheckbox } from '~/components/checkbox';
import { Input } from '~/components/input';
import { SelectBox } from '~/components/select-box';
import { Textarea } from '~/components/textarea';
import { UploadPhoto } from '~/components/upload-photo';
import { readAsDataURL } from '~/lib/readFile';
import { createNewPlace } from '~/state/p2p/p2pSlice';
import { categoryOptions } from '~/state/places/placesSlice';
import BaseLayout from '~/templates';

const PAGE_TITLE = 'New Chat';

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
  isPrivate: boolean;
  setPassword: boolean;
  password: string;
  readOnly: boolean;
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

export const NewPlace: React.FC = React.memo(function NewPlace() {
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { t } = useTranslation(['newPlaces', 'categories']);
  const formik = useFormik<FormValues>({
    initialValues: {
      avatar: null,
      category: null,
      name: '',
      description: '',
      setPassword: false,
      isPrivate: false,
      readOnly: false,
      password: '',
    },
    validationSchema,
    async onSubmit({
      avatar,
      category,
      name,
      description,
      isPrivate,
      setPassword,
      password,
      readOnly,
    }) {
      // TODO: category 0 is will be false
      if (avatar && category) {
        await dispatch(
          createNewPlace({
            name,
            description,
            isPrivate,
            avatar,
            password: setPassword ? password : '',
            category,
            readOnly,
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
      description={t('newPlaces:Please fill out a form and submit it')}
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
          placeholder={t('newPlaces:Name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          errorMessage={formik.errors.name}
        />
        <InputDescription
          name="description"
          placeholder={t('newPlaces:Description')}
          value={formik.values.description}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          rows={8}
          maxLength={200}
          errorMessage={formik.errors.description}
        />

        <Subtitle>Other Options</Subtitle>

        <OptionGroup>
          <FlagLabel>
            <Checkbox
              name="isPrivate"
              checked={formik.values.isPrivate}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errorMessage={formik.errors.isPrivate}
            />
            Make Private?
          </FlagLabel>
          <Description>
            If checked, your new place won’t be indexed in the Liber Search
            Engine.
          </Description>
        </OptionGroup>

        <OptionGroup>
          <FlagLabel>
            <Checkbox
              name="setPassword"
              checked={formik.values.setPassword}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
            Set Password?
          </FlagLabel>
          <Description>
            You can change this flag also after this started
          </Description>
          <InputPassword
            name="password"
            type="password"
            placeholder={t('newPlaces:Password')}
            value={formik.values.password}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errorMessage={formik.errors.password}
          />
        </OptionGroup>

        <OptionGroup>
          <FlagLabel>
            <Checkbox
              name="readOnly"
              checked={formik.values.readOnly}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
            {t('newPlaces:Read Only?')}
          </FlagLabel>
          <Description>
            If checked, only the people who has a privileged role can post a
            message in the place. You can change this flag after created
          </Description>
        </OptionGroup>

        <SubmitButton
          shape="rounded"
          text={t('newPlaces:Start')}
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
