import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { omitText } from '~/helpers';
import { dummyPlace } from '~/mocks/place';
import { initApp } from '~/state/p2p/p2pSlice';
import { createStore } from '~/test-utils/create-store';
import { createMockFeedAccessor, createMockKVAccessor } from '~/test-utils/db';
import { render, screen, waitFor } from '~/test-utils/ui';
import { ChatDetail } from './';

jest.mock('~/components/ipfs-content', () => ({
  IpfsContent: function IpfsContent() {
    return <div>mocked IpfsContent</div>;
  },
}));

beforeEach(() => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  Element.prototype.scrollIntoView = jest.fn();
});

test('loading place', async () => {
  const placeId = 'place-1';
  const place = dummyPlace(placeId);

  const store = createStore({}, { place: createMockKVAccessor(place) });
  render(
    <MemoryRouter initialEntries={[`/places/place-address/${place.id}`]}>
      <Routes>
        <Route path="/places/:address/:placeId" element={<ChatDetail />} />
      </Routes>
    </MemoryRouter>,
    { store }
  );
  await waitFor(() => screen.getByRole('heading'));
  expect(screen.getByRole('heading')).toHaveTextContent(
    omitText(place.name, 20)
  );
});

test('send message', async () => {
  const placeId = 'place-1';
  const place = dummyPlace(placeId);

  const store = createStore(
    {},
    {
      place: createMockKVAccessor(place),
      message: createMockFeedAccessor(),
      exploreMessage: createMockFeedAccessor(),
      feed: createMockFeedAccessor(),
    }
  );
  store.dispatch(initApp());
  render(
    <MemoryRouter initialEntries={[`/places/place-address/${place.id}`]}>
      <Routes>
        <Route path="/places/:address/:placeId" element={<ChatDetail />} />
      </Routes>
    </MemoryRouter>,
    { store }
  );
  const messageInput = await waitFor(() =>
    screen.getByPlaceholderText('Message...')
  );
  userEvent.type(messageInput, 'hello, world');
  userEvent.click(screen.getByRole('button', { name: 'Send' }));

  await waitFor(() => {
    expect(screen.getByText('hello, world')).toBeInTheDocument();
  });
});
