import { push } from 'connected-react-router';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { Select } from '~/components/select';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { UploadPhoto } from '~/components/upload-photo';
import { useQuery } from '~/lib/queryParams';
import { readAsDataURL } from '~/lib/readFile';
import { categories } from '~/state/ducks/places/placesSlice';
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

const TAB_EDITOR = 'editor';
const TAB_TESTING = 'testing';
const TAB_LIST = [TAB_EDITOR, TAB_TESTING];
const TAB_TITLE = {
  [TAB_EDITOR]: 'Editor',
  [TAB_TESTING]: 'Testing',
};

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

export const BotNewPage: React.FC<Props> = React.memo(function BotNewPage({}) {
  const { tab = TAB_EDITOR } = useQuery<{ tab: string }>();
  const dispatch = useDispatch();
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

  const handleSelect = useCallback((index: number) => {
    dispatch(push(`/bots/new?tab=${TAB_LIST[index]}`));
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
      backTo="/bots?tab=listing"
    >
      <form>
        <Group>
          <UploadPhoto
            name="avatar"
            onChange={handleChangeImage}
            previewSrc={avatarPreview}
            disabled={formik.isSubmitting}
          />

          <Select id="bot_category" name="category" options={categories} />

          <InputText
            name="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
          />
          <StyledTextarea
            name="description"
            placeholder="Add Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            rows={8}
            maxLength={200}
          />

          <Subtitle>Document</Subtitle>

          <Description>
            It could be written in Markdown format. See more about Markdown.
          </Description>
          <StyledTextarea
            name="document"
            placeholder="Add Documentation"
            value={formik.values.document}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            rows={8}
            maxLength={200}
          />
        </Group>

        <Tabs
          tabList={TAB_LIST}
          tabTitle={TAB_TITLE}
          selectedTab={tab}
          onSelect={handleSelect}
        >
          <TabPanels>
            <TabPanel hide={tab !== TAB_EDITOR}>
              <Group>
                <Editor
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                />
                <CreateButton type="button" shape="rounded" text="CREATE" />
              </Group>
            </TabPanel>
            <TabPanel hide={tab !== TAB_TESTING}>
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
