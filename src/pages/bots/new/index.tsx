import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '~/components/button';
import { ErrorMessage } from '~/components/error-message';
import { IconButton } from '~/components/icon-button';
import { Input } from '~/components/input';
import { SelectBox } from '~/components/select-box';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { Textarea } from '~/components/textarea';
import { UploadPhoto } from '~/components/upload-photo';
import { SvgPlus as PlusIcon } from '~/icons/Plus';
import { readAsDataURL } from '~/lib/readFile';
import { categoryOptions, createNewBot } from '~/state/bots/botsSlice';
import BaseLayout from '~/templates';
import { Editor } from './components/editor';

const Form = styled.form`
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const ExampleDescription = styled.p`
  color: ${(props) => props.theme.colors.secondaryText};
  font-weight: ${(props) => props.theme.fontWeights.light};
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const StyledInput = styled(Input)`
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const Item = styled.div`
  position: relative;
`;

const RemoveButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  border-radius: ${(props) => props.theme.radii.round};
  background-color: ${(props) => props.theme.colors.red};
  color: ${(props) => props.theme.colors.white};
`;

const AddLink = styled.a`
  width: 100%;
  text-align: center;
  margin: ${(props) => `${props.theme.space[8]}px 0 ${props.theme.space[4]}px`};
  display: block;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.primary};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
`;

const RunTestButton = styled(Button)`
  color: ${(props) => props.theme.colors.primary};
  border: ${(props) => props.theme.border.primary.thin};
  background: ${(props) => props.theme.colors.white};
  width: 100%;
  margin-bottom: ${(props) => props.theme.space[4]}px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const CreateButton = styled(Button)`
  width: 100%;
`;

const Group = styled.div`
  padding: 0 ${(props) => props.theme.space[5]}px;
`;

const InputText = styled(Input)`
  margin-top: ${(props) => props.theme.space[5]}px;
`;

const StyledTextarea = styled(Textarea)`
  margin-top: ${(props) => props.theme.space[5]}px;
  margin-bottom: ${(props) => props.theme.space[5]}px;
  font-weight: ${(props) => props.theme.fontWeights.thin};
`;

const Subtitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.secondaryText};
  font-weight: ${(props) => props.theme.fontWeights.light};
`;

const Section = styled.section`
  margin-bottom: ${(props) => props.theme.space[10]}px;
`;

const Term = styled.span`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  font-size: ${(props) => props.theme.fontSizes.md};
  margin-left: ${(props) => props.theme.space[5]}px;
`;

const PriceInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const tabTitles = ['Editor', 'Testing'];

interface Example {
  title: string;
  input: string;
  output: string;
}

interface FormValues {
  avatar: File | null;
  category: number;
  name: string;
  description: string;
  readme: string;
  price?: number;
  sourceCode: string;
  examples: Example[];
}

const validationSchema = yup.object({
  avatar: yup.mixed().test('not null', '', (value) => value !== null),
  category: yup.number().moreThan(0).required(),
  name: yup.string().max(50).required(),
  description: yup.string().max(200).min(20).required(),
  readme: yup.string().max(1000).min(20).required(),
  price: yup.number().moreThan(0).required(),
  sourceCode: yup.string().max(1000).required(),
  examples: yup
    .array()
    .min(1)
    .required()
    .of(
      yup.object().shape({
        title: yup.string().required(),
        input: yup.string().required(),
        output: yup.string().required(),
      })
    ),
});

export const BotNewPage: React.FC = React.memo(function BotNewPage() {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const formik = useFormik<FormValues>({
    initialValues: {
      avatar: null,
      category: 0,
      name: '',
      description: '',
      readme: '',
      sourceCode: '',
      examples: [{ title: '', input: '', output: '' }],
    },
    validationSchema,
    async onSubmit({
      category,
      name,
      description,
      avatar,
      price,
      readme,
      sourceCode,
      examples,
    }) {
      if (avatar && price) {
        dispatch(
          createNewBot({
            avatar,
            category,
            name,
            description,
            price,
            readme,
            sourceCode,
            examples,
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

  const handleChangeImage = useCallback((file: File | null) => {
    formik.setFieldValue('avatar', file);
  }, []);

  const handleRemove = (index: number) => () =>
    formik.setFieldValue(
      'examples',
      formik.values.examples
        .slice(0, index)
        .concat(formik.values.examples.slice(index + 1))
    );

  const handleAdd = () =>
    formik.setFieldValue('examples', [
      ...formik.values.examples,
      { name: '', input: '', output: '' },
    ]);

  return (
    <BaseLayout
      title="Create New Bot"
      description="Please fill out a form and submit it."
      backTo="/bots"
    >
      <Form onSubmit={formik.handleSubmit}>
        <Group>
          <UploadPhoto
            name="avatar"
            onChange={handleChangeImage}
            previewSrc={avatarPreview}
            disabled={formik.isSubmitting}
            errorMessage={formik.errors.avatar}
          />

          <Section>
            <SelectBox
              id="bot_category"
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
              placeholder="Add Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              rows={8}
              maxLength={200}
              errorMessage={formik.errors.description}
            />
          </Section>

          <Section>
            <Subtitle>Price</Subtitle>
            <PriceInner>
              <Input
                type="number"
                name="price"
                placeholder="999999"
                value={formik.values.price}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                errorMessage={formik.errors.price}
              />
              <Term>ETH</Term>
            </PriceInner>
          </Section>

          <Section>
            <Subtitle>README</Subtitle>
            <Description>
              It could be written in Markdown format. See more about Markdown.
            </Description>
            <StyledTextarea
              name="readme"
              placeholder="# Usage"
              value={formik.values.readme}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              rows={8}
              maxLength={1000}
              errorMessage={formik.errors.readme}
            />
          </Section>
        </Group>

        <Tabs
          titles={tabTitles}
          selectedIndex={selectedIndex}
          onSelect={(index: number) => setSelectedIndex(index)}
        >
          <TabPanels>
            <TabPanel>
              <Group>
                <Editor
                  value={formik.values.sourceCode}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                  errorMessage={formik.errors.sourceCode}
                />
                <CreateButton type="submit" shape="rounded" text="CREATE" />
              </Group>
            </TabPanel>
            <TabPanel>
              <Group>
                <ExampleDescription>
                  Testing is useful to look for latent bugs in your bot. It will
                  be also shown as examples on its detail page.
                </ExampleDescription>
                <ErrorMessage>
                  {typeof formik.errors.examples === 'string' &&
                    formik.errors.examples}
                </ErrorMessage>
                {formik.values.examples.map((t, index) => (
                  <Item key={index}>
                    <Subtitle>Test {index + 1}</Subtitle>
                    <RemoveButton
                      onClick={handleRemove(index)}
                      icon={<PlusIcon width="24" height="24" />}
                    />
                    <StyledInput
                      name={`examples.${index}.title`}
                      placeholder="Title"
                      value={t.title}
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                      errorMessage={
                        (formik.errors.examples?.[index] as Example)?.title
                      }
                    />
                    <StyledInput
                      name={`examples.${index}.input`}
                      placeholder="<@self> ping"
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                      errorMessage={
                        (formik.errors.examples?.[index] as Example)?.input
                      }
                    />
                    <StyledInput
                      name={`examples.${index}.output`}
                      placeholder="<@sender> pong"
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                      errorMessage={
                        (formik.errors.examples?.[index] as Example)?.output
                      }
                    />
                    {formik.errors.examples && <ErrorMessage>{}</ErrorMessage>}
                  </Item>
                ))}
                <AddLink onClick={handleAdd}>Add Test Case</AddLink>
                <RunTestButton type="button" shape="rounded" text="RUN TEST" />
                <CreateButton type="submit" shape="rounded" text="CREATE" />
              </Group>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Form>
    </BaseLayout>
  );
});
