import React from 'react';
import { render } from '@testing-library/react';
import App2 from './App2';

describe('App2', () => {
  it('should render loading indicator when isLoading is true', () => {
    const { getByTestId } = render(<App2 />);
    expect(getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should not render loading indicator when isLoading is false', () => {
    const { queryByTestId } = render(<App2 />);
    expect(queryByTestId('loading-indicator')).toBeNull();
  });
});
