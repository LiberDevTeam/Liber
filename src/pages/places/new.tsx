import React, { useState } from 'react';
import { PageTitle } from '~/components/atoms/page-title';
import styled from 'styled-components';
import BaseLayout from '~/templates';
import { Input } from '~/components/atoms/input';
import { Button } from '~/components/atoms/button';
import { Textarea } from '~/components/atoms/textarea';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { createNewPlace } from '~/state/ducks/p2p/p2pSlice';

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

const InputName = styled(Input)`
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
const PreviewImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: ${(props) => props.theme.radii.medium}px;
`;

const SubmitButton = styled(Button)`
  margin-top: ${(props) => props.theme.space[8]}px;
`;

const readFile = (file: Blob) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        resolve(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });

interface FormValues {
  name: string;
  description: string;
  isPrivate: boolean;
}

export const NewPlace: React.FC = React.memo(function NewPlace() {
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      isPrivate: false,
    },

    async onSubmit({ name, description, isPrivate }) {
      dispatch(
        createNewPlace({
          name,
          description,
          isPrivate,
          avatarImage: avatarImage!,
        })
      );
    },
  });

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setAvatarImage(e.currentTarget.files[0]);
      const file = await readFile(e.currentTarget.files[0]);
      setAvatarPreview(file);
    }
  };

  return (
    <BaseLayout>
      <PageTitle>{PAGE_TITLE}</PageTitle>
      <Description>Please fill out a form and submit it.</Description>

      <Form onSubmit={formik.handleSubmit}>
        <InputName
          name="name"
          placeholder="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
        />
        <InputDescription
          name="description"
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
        />

        {avatarPreview ? <PreviewImage src={avatarPreview} /> : null}
        <UploadFileButtonGroup>
          <Button text="Select Thumbnail Image" shape="square" type="button" />
          <InputFile
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
            Make private
          </label>
        </PrivateFlagGroup>

        <SubmitButton
          shape="square"
          text="Submit"
          variant="solid"
          type="submit"
          disabled={formik.isSubmitting || formik.isValid === false}
        />
      </Form>
    </BaseLayout>
  );
});
