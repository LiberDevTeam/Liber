import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import { ErrorMessage } from '~/components/error-message';
import { SelectBox } from '~/components/select-box';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { UploadPhoto } from '~/components/upload-photo';
import { readAsDataURL } from '~/lib/readFile';
import {
  categoryOptions,
  fetchBot,
  selectBotById,
  updateBot,
} from '~/state/bots/botsSlice';
import BaseLayout from '~/templates';
import { Button } from '../../../components/button';
import { IconButton } from '../../../components/icon-button';
import { Input } from '../../../components/input';
import { Textarea } from '../../../components/textarea';
import { SvgPlus as PlusIcon } from '../../../icons/Plus';
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
  margin-bottom: ${(props) => props.theme.space[5]}px;
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
  border: ${(props) => props.theme.border.thin(props.theme.colors.primary)};
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

const tabTitles = ['Editor', 'Example'];

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
  price?: number;
  readme: string;
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

export const BotEditPage: React.FC = React.memo(function BotEditPage() {
  const { botId, address } = useParams<{ botId: string; address: string }>();
  const dispatch = useDispatch();
  const bot = useSelector(selectBotById(botId));
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
      avatar,
      category,
      name,
      description,
      readme,
      price,
      sourceCode,
      examples,
    }) {
      if (avatar && price) {
        dispatch(
          updateBot({
            botId,
            address,
            avatar,
            category,
            name,
            description,
            readme,
            price,
            sourceCode,
            examples,
          })
        );
      }
    },
    validateOnChange: false,
  });

  useEffect(() => {
    if (!bot) {
      dispatch(fetchBot({ botId, address }));
    }
  }, [botId]);

  useEffect(() => {
    if (bot) {
      fetch(`/view/${bot.avatar}`)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], bot.name);
          formik.setFieldValue('avatar', file);
        });
      formik.setFieldValue('category', bot.category);
      formik.setFieldValue('name', bot.name);
      formik.setFieldValue('description', bot.description);
      formik.setFieldValue('price', bot.price);
      formik.setFieldValue('readme', bot.readme);
      formik.setFieldValue('sourceCode', bot.sourceCode);
      formik.setFieldValue('examples', bot.examples);
    }
  }, [bot]);

  useEffect(() => {
    if (formik.values.avatar) {
      readAsDataURL(formik.values.avatar).then((file) => {
        setAvatarPreview(file);
      });
      return;
    }

    setAvatarPreview(null);
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
      title="Edit Bot"
      description="Please fill out a form and submit it."
      backTo={`/bots/${botId}`}
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
              value={formik.values.category}
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
              placeholder="Add README"
              value={formik.values.readme}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              rows={8}
              maxLength={200}
              errorMessage={formik.errors.description}
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
                  errorMessage={formik.errors.description}
                />
                <CreateButton type="submit" shape="rounded" text="UPDATE" />
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
                {formik.values.examples.map((example, index) => (
                  <Item key={index}>
                    <Subtitle>Case {index + 1}</Subtitle>
                    <RemoveButton
                      onClick={handleRemove(index)}
                      icon={<PlusIcon width="24" height="24" />}
                    />
                    <StyledInput
                      name={`examples.${index}.title`}
                      placeholder="Title"
                      value={example.title}
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                      errorMessage={
                        (formik.errors.examples?.[index] as Example)?.title
                      }
                    />
                    <StyledInput
                      name={`examples.${index}.input`}
                      placeholder="<@self> ping"
                      value={example.input}
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                      errorMessage={
                        (formik.errors.examples?.[index] as Example)?.input
                      }
                    />
                    <StyledInput
                      name={`examples.${index}.output`}
                      placeholder="<@sender> pong"
                      value={example.output}
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                      errorMessage={
                        (formik.errors.examples?.[index] as Example)?.output
                      }
                    />
                  </Item>
                ))}
                <AddLink onClick={handleAdd}>Add Test Case</AddLink>
                <RunTestButton type="button" shape="rounded" text="RUN TEST" />
                <CreateButton type="submit" shape="rounded" text="UPDATE" />
              </Group>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Form>
    </BaseLayout>
  );
});
