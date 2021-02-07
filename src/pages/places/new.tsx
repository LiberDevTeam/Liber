import React from 'react';
import { PageTitle } from '~/components/atoms/page-title';
import styled from 'styled-components';
import BaseLayout from '~/templates';
import { Input } from '~/components/atoms/input';
import { Button } from '~/components/atoms/button';
import { Textarea } from '~/components/atoms/textarea';
import { v4 as uuidv4 } from 'uuid';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { addPlace } from '../../state/ducks/me/meSlice';
import { push } from 'connected-react-router';

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

const SubmitButton = styled(Button)`
  margin-top: ${(props) => props.theme.space[8]}px;
`;

interface FormValues {
  name: string;
  description: string;
}

export const NewPlace: React.FC = React.memo(function NewPlace() {
  const dispatch = useDispatch();
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
    },

    async onSubmit({ name, description }) {
      const id = uuidv4();
      await dispatch(addPlace({ id, name, description }));
      dispatch(push(`/places/${id}`));
    },
  });

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

        <SubmitButton
          shape="square"
          text="Submit"
          variant="solid"
          type="submit"
          disabled={formik.isSubmitting}
        />
      </Form>
    </BaseLayout>
  );
});
