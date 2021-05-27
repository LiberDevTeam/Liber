import { push } from 'connected-react-router';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '~/components/button';
import { Input as BaseInput } from '~/components/input';
import { UploadPhoto } from '~/components/upload-photo';
import { readAsDataURL } from '~/lib/readFile';
import { selectMe, updateProfile } from '~/state/me/meSlice';
import { selectIpfsContentByCid } from '~/state/p2p/ipfsContentsSlice';
import BaseLayout from '~/templates';

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
  username: string;
}

export const ProfileEditPage: React.FC = () => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const avatar = useSelector(selectIpfsContentByCid(me.avatarCid));
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    (avatar && avatar.dataUrl) || null
  );
  const formik = useFormik<FormValues>({
    initialValues: {
      avatar: (avatar && avatar.file) || null,
      username: me.username || '',
    },
    validationSchema,
    async onSubmit({ avatar, username }) {
      dispatch(
        updateProfile({
          avatar,
          username,
        })
      );
      dispatch(push('/profile'));
    },
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

  const handleChange = useCallback((file: File | null) => {
    formik.setFieldValue('avatar', file);
  }, []);

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
          name="username"
          placeholder="Input Your Name"
          value={formik.values.username}
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
