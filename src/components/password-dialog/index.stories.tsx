import { Story } from '@storybook/react/types-6-0';
import { Provider } from 'react-redux';
import { dummyPlace } from '../../mocks/place';
import { createStore } from '../../test-utils/create-store';
import { PasswordDialog, PasswordDialogProps } from './';

export default {
  component: PasswordDialog,
  title: 'components/PasswordDialog',
};

const place = dummyPlace('place-1');
const store = createStore({
  places: { entities: { [place.id]: place }, ids: [place.id] },
});

const Template: Story<PasswordDialogProps> = (args) => (
  <Provider store={store}>
    <PasswordDialog {...args} />
  </Provider>
);
export const Default = Template.bind({});
Default.args = {
  pid: place.id,
};
