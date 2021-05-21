import { push } from 'connected-react-router';
import { useFormik } from 'formik';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '~/components/button';
import { Input } from '~/components/input';
import { PreviewImage } from '~/components/preview-image';
import { SelectBox } from '~/components/select-box';
import { Textarea } from '~/components/textarea';
import { readAsDataURL } from '~/lib/readFile';
import {
  Category,
  selectStickerById,
} from '~/state/ducks/stickers/stickersSlice';
import BaseLayout from '~/templates';
import { SvgPlus2 as PlusIcon } from '../../../icons/Plus2';

const CreateButton = styled(Button)`
  width: 100%;
  margin-top: ${(props) => props.theme.space[3]}px;
`;

const Form = styled.form`
  padding: ${(props) => props.theme.space[5]}px;
`;

const InputText = styled(Input)`
  margin-top: ${(props) => props.theme.space[5]}px;
`;

const StyledTextarea = styled(Textarea)`
  margin-top: ${(props) => props.theme.space[5]}px;
  margin-bottom: ${(props) => props.theme.space[15]}px;
  font-weight: ${(props) => props.theme.fontWeights.thin};
`;

const Subtitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const Contents = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const InputFile = styled.input`
  width: 124px;
  height: 124px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
`;

const UploadImage = styled.div`
  width: 124px;
  height: 124px;
  position: relative;
  margin: ${(props) =>
    `0 ${props.theme.space[4]}px ${props.theme.space[4]}px 0`};
`;

const StyledPreviewImage = styled(PreviewImage)`
  margin: ${(props) =>
    `0 ${props.theme.space[4]}px ${props.theme.space[4]}px 0`};
`;

interface Props {}

interface FormValues {
  category: Category;
  name: string;
  description: string;
  contents: Blob[];
}

const validationSchema = yup.object({
  category: yup.number().required(),
  name: yup.string().required(),
  description: yup.string(),
  contents: yup.array(),
});

export const StickerEditPage: React.FC<Props> = memo(function StickerNewPage() {
  const { stickerId } = useParams<{ stickerId: string }>();
  const dispatch = useDispatch();
  const sticker = useSelector(selectStickerById(stickerId));
  const [contentPreview, setContentPreview] = useState<string[]>([]);

  if (!sticker) {
    dispatch(push(`/stickers/${stickerId}`));
    return null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      category: sticker.category,
      name: sticker.name,
      description: sticker.description,
      contents: [],
    },
    validationSchema,
    async onSubmit({ category, name, description, contents }) {
      // dispatch(
      //   createNewSticker({
      //     avatar,
      //     category,
      //     name,
      //     description,
      //     document,
      //     code,
      //     tests,
      //   })
      // );
    },
  });

  useEffect(() => {
    const files = sticker.contents.map(async ({ cid }) => {
      const res = await fetch(`/view/${cid}`);
      const file = new File([await res.blob()], cid);
      formik.setFieldValue('contents', files);
      readAsDataURL(file).then((file) => {
        setContentPreview((prev) => [...prev, file]);
      });
    });
  }, [sticker]);

  const contentInputRef = useRef<HTMLInputElement>(null);

  const handleNewContent = useCallback(() => {
    if (contentInputRef.current?.files && contentInputRef.current.files[0]) {
      const file = contentInputRef.current.files[0];

      formik.setFieldValue('contents', [...formik.values.contents, file]);
      readAsDataURL(file).then((file) => {
        setContentPreview((prev) => [...prev, file]);
      });
      contentInputRef.current.value = '';
    }
  }, []);

  const handleRemove = (index: number) => {
    formik.setFieldValue(
      'contents',
      formik.values.contents
        .slice(0, index)
        .concat(formik.values.contents.slice(index + 1))
    );
    setContentPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <BaseLayout
      title="Edit Sticker"
      description="Please fill out a form and submit it."
      backTo={`/stickers/${stickerId}`}
    >
      <Form onSubmit={formik.handleSubmit}>
        <SelectBox
          id="sticker_category"
          name="category"
          options={Object.keys(Category)}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
        />

        <InputText
          name="name"
          placeholder="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
        />
        <StyledTextarea
          name="description"
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          rows={8}
          maxLength={200}
        />

        <Subtitle>Contents</Subtitle>
        <Contents>
          {contentPreview.map((preview, index) => (
            <StyledPreviewImage
              size="lg"
              key={index}
              onRemove={() => handleRemove(index)}
              src={preview}
            />
          ))}
          <UploadImage>
            <PlusIcon />
            <InputFile
              ref={contentInputRef}
              name="contents"
              type="file"
              accept="image/*"
              onChange={handleNewContent}
              disabled={formik.isSubmitting}
            />
          </UploadImage>
        </Contents>
        <CreateButton type="button" shape="rounded" text="UPDATE" />
      </Form>
    </BaseLayout>
  );
});
