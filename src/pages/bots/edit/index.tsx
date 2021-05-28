import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import { SelectBox } from '~/components/select-box';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { UploadPhoto } from '~/components/upload-photo';
import { readAsDataURL } from '~/lib/readFile';
import { fetchBot, selectBotById } from '~/state/bots/botsSlice';
import { categoryOptions } from '~/state/places/placesSlice';
import BaseLayout from '~/templates';
import { Button } from '../../../components/button';
import { IconButton } from '../../../components/icon-button';
import { Input } from '../../../components/input';
import { Textarea } from '../../../components/textarea';
import { SvgPlus as PlusIcon } from '../../../icons/Plus';
import { Editor } from './components/editor';

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
  margin-bottom: ${(props) => props.theme.space[15]}px;
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

const tabTitles = ['Editor', 'Testing'];

interface Props {}

interface Example {
  name: string;
  input: string;
  output: string;
}

interface FormValues {
  avatar: File | null;
  category: number;
  name: string;
  description: string;
  document: string;
  code: string;
  examples: Example[];
}

const validationSchema = yup.object({
  avatar: yup.mixed().test('not null', '', (value) => value !== null),
  category: yup.number().required(),
  name: yup.string().required(),
  description: yup.string(),
  document: yup.string(),
  code: yup.string().required(),
  examples: yup.array(),
});

export const BotEditPage: React.FC<Props> = React.memo(function BotEditPage() {
  const { botId } = useParams<{ botId: string }>();
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
      document: '',
      code: '',
      examples: [{ name: '', input: '', output: '' }],
    },
    validationSchema,
    async onSubmit({
      avatar,
      category,
      name,
      description,
      document,
      code,
      examples,
    }) {
      if (avatar) {
        // dispatch(
        //   createNewBot({
        //     avatar,
        //     category,
        //     name,
        //     description,
        //     document,
        //     code,
        //     tests,
        //   })
        // );
      }
    },
  });

  const [errors, setErrors] = useState<typeof formik.errors>({});

  useEffect(() => {
    if (formik.submitCount > 0) {
      setErrors(formik.errors);
    }
  }, [formik.errors, formik.submitCount]);

  useEffect(() => {
    if (!bot) {
      dispatch(fetchBot({ id: botId }));
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
      <form>
        <Group>
          <UploadPhoto
            name="avatar"
            onChange={handleChangeImage}
            previewSrc={avatarPreview}
            disabled={formik.isSubmitting}
            errorMessage={errors.avatar}
          />

          <SelectBox
            id="bot_category"
            name="category"
            options={categoryOptions}
            onChange={(e) =>
              formik.setFieldValue(
                'category',
                parseInt(e.currentTarget.value, 10)
              )
            }
            disabled={formik.isSubmitting}
            errorMessage={errors.category}
          />

          <InputText
            name="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errorMessage={errors.name}
          />
          <StyledTextarea
            name="description"
            placeholder="Add Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            rows={8}
            maxLength={200}
            errorMessage={errors.description}
          />

          <Subtitle>README</Subtitle>

          <Description>
            It could be written in Markdown format. See more about Markdown.
          </Description>
          <StyledTextarea
            name="readme"
            placeholder="Add README"
            value={formik.values.document}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            rows={8}
            maxLength={200}
            errorMessage={errors.description}
          />
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
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                  errorMessage={errors.description}
                />
                <CreateButton type="button" shape="rounded" text="CREATE" />
              </Group>
            </TabPanel>
            <TabPanel>
              <Group>
                <ExampleDescription>
                  Testing is useful to look for latent bugs in your bot. It will
                  be also shown as examples on its detail page.
                </ExampleDescription>
                {formik.values.examples.map((t, index) => (
                  <Item key={index}>
                    <Subtitle>Test {index + 1}</Subtitle>
                    <RemoveButton
                      onClick={handleRemove(index)}
                      icon={<PlusIcon width="24" height="24" />}
                    />
                    <StyledInput
                      required
                      name={`examples.${index}.name`}
                      placeholder="Name"
                      value={t.name}
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                    />
                    <StyledInput
                      required
                      name={`examples.${index}.input`}
                      placeholder="<@self> ping"
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                    />
                    <StyledInput
                      required
                      name={`examples.${index}.output`}
                      placeholder="<@sender> pong"
                      onChange={formik.handleChange}
                      disabled={formik.isSubmitting}
                    />
                  </Item>
                ))}
                <AddLink onClick={handleAdd}>Add Test Case</AddLink>
                <RunTestButton type="button" shape="rounded" text="RUN TEST" />
                <CreateButton type="button" shape="rounded" text="CREATE" />
              </Group>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </form>
    </BaseLayout>
  );
});
