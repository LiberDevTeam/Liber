import React from 'react';
import { render, screen, waitFor } from '~/test-utils/ui';
import { Message } from './';

describe('decamoji', () => {
  test('one emoji will be decamoji', async () => {
    render(<Message mine={false} contents={['😋']} timestamp={10000} />, {});

    await waitFor(() => {
      expect(screen.getByTestId('decamoji')).toBeInTheDocument();
    });
  });

  test('multiple emoji is not will be decamoji', async () => {
    render(<Message mine={false} contents={['😋😋']} timestamp={10000} />, {});

    const message = screen.queryByTestId('decamoji');
    expect(message).toBeNull();
  });
});
