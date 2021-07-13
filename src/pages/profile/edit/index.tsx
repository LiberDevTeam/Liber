import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '~/components/button';
import { Input as BaseInput } from '~/components/input';
import { UploadPhoto } from '~/components/upload-photo';
import { history } from '~/history';
import { selectMe, updateProfile } from '~/state/me/meSlice';
import BaseLayout from '~/templates';
import { fetchIPFSContent } from '~/utils/fetch-file-by-cid';

const Label = styled.h2`
  font-weight: ${(props) => props.theme.fontWeights.normal};
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

const Form = styled.form`
  padding: 0 ${(props) => props.theme.space[5]}px;
`;

const Input = styled(BaseInput)`
  margin-bottom: ${(props) => props.theme.space[9]}px;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
`;

const validationSchema = yup.object({});

export interface FormValues {
  avatar: File | null;
  name: string;
}

export const ProfileEditPage: React.FC = () => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      avatar: null,
      name: me.name || '',
    },
    validationSchema,
    async onSubmit({ avatar, name }) {
      dispatch(
        updateProfile({
          avatar,
          name,
        })
      );
      history.push('/profile');
    },
  });

  useEffect(() => {
    if (me.avatarCid) {
      fetchIPFSContent(me.avatarCid).then((file) => {
        formik.setFieldValue('avatar', file);
      });
    }
  }, [me.avatarCid, formik]);

  useEffect(() => {
    if (formik.values.avatar) {
      setAvatarPreview(URL.createObjectURL(formik.values.avatar));
    } else {
      setAvatarPreview(null);
    }
  }, [formik.values.avatar]);

  const handleChange = useCallback(
    (file: File | null) => {
      formik.setFieldValue('avatar', file);
      if (file) {
        setAvatarPreview(URL.createObjectURL(file));
      }
    },
    [formik]
  );

  return (
    <BaseLayout
      backTo="/profile"
      title="Edit Profile"
      description="Edit your personal info"
    >
      <Form onSubmit={formik.handleSubmit}>
        <UploadPhoto
          name="avatar"
          onChange={handleChange}
          previewSrc={avatarPreview}
          disabled={formik.isSubmitting}
        />
        <Label>Name</Label>
        <Input
          name="name"
          placeholder="Input Your Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
        />
        <SubmitButton
          height={50}
          shape="rounded"
          text="UPDATE"
          variant="solid"
          type="submit"
        />
      </Form>
    </BaseLayout>
  );
};
