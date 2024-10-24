import { useFormik } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '~/components/button';
import { ErrorMessage } from '~/components/error-message';
import { Input } from '~/components/input';
import { PreviewImage } from '~/components/preview-image';
import { SelectBox } from '~/components/select-box';
import { Textarea } from '~/components/textarea';
import { SvgPlus2 as PlusIcon } from '~/icons/Plus2';
import { readAsDataURL } from '~/lib/readFile';
import {
  categoryOptions,
  createNewSticker,
} from '~/state/stickers/stickersSlice';
import BaseLayout from '~/templates';

const CreateButton = styled(Button)`
  width: 100%;
  margin-top: ${(props) => props.theme.space[3]}px;
`;

const Form = styled.form`
  padding: ${(props) => props.theme.space[5]}px;
`;

const Section = styled.section`
  margin-bottom: ${(props) => props.theme.space[12]}px;
`;

const PriceInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const InputText = styled(Input)`
  margin-top: ${(props) => props.theme.space[5]}px;
`;

const StyledTextarea = styled(Textarea)`
  margin-top: ${(props) => props.theme.space[5]}px;
  font-weight: ${(props) => props.theme.fontWeights.thin};
`;

const Subtitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const Contents = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const StyledErrorMessage = styled(ErrorMessage)`
  margin-top: ${(props) => props.theme.space[2]}px;
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const Term = styled.span`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  font-size: ${(props) => props.theme.fontSizes.md};
  margin-left: ${(props) => props.theme.space[5]}px;
`;

interface FormValues {
  category?: number;
  name: string;
  description: string;
  price: number;
  contents: File[];
}

const validationSchema = yup.object({
  category: yup.string().required(),
  name: yup.string().max(50).required(),
  description: yup.string().max(200).min(20).required(),
  price: yup.number().moreThan(0).required(),
  contents: yup.array().min(1).required(),
});

export const StickerNewPage: React.FC = React.memo(function StickerNewPage() {
  const dispatch = useDispatch();
  const [contentPreview, setContentPreview] = useState<string[]>([]);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      contents: [],
      price: 0,
    },
    validationSchema,
    async onSubmit({ category, name, description, contents, price }) {
      category &&
        dispatch(
          createNewSticker({
            category,
            name,
            description,
            contents,
            price: 0,
          })
        );
    },
    validateOnChange: false,
  });

  const contentInputRef = useRef<HTMLInputElement>(null);

  const handleNewContent = useCallback(() => {
    if (contentInputRef.current?.files && contentInputRef.current.files[0]) {
      const file = contentInputRef.current.files[0];

      formik.setFieldValue(`contents`, [...formik.values.contents, file]);
      readAsDataURL(file).then((file) => {
        setContentPreview((prev) => [...prev, file]);
      });
      contentInputRef.current.value = '';
    }
  }, [formik.values.contents]);

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
      title="Create New Sticker"
      description="Please fill out a form and submit it."
      backTo="/stickers"
    >
      <Form onSubmit={formik.handleSubmit}>
        <Section>
          <SelectBox
            id="sticker_category"
            name="category"
            options={categoryOptions}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errorMessage={formik.errors.category}
          />

          <InputText
            name="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errorMessage={formik.errors.name}
          />

          <StyledTextarea
            name="description"
            placeholder="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            rows={8}
            maxLength={200}
            minLength={20}
            errorMessage={formik.errors.description}
          />
        </Section>

        <Section>
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
          {formik.errors.contents && (
            <StyledErrorMessage>{formik.errors.contents}</StyledErrorMessage>
          )}
        </Section>
        <CreateButton type="submit" shape="rounded" text="CREATE" />
      </Form>
    </BaseLayout>
  );
});
