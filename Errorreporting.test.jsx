import React from 'react';
import { render } from '@testing-library/react';
import App2 from './App2';

describe('App2', () => {
  it('should render error message when error state is not null', () => {
    const errorMessage = 'Kunne ikke hente postnumre.';
    const { getByText } = render(<App2 />);
    expect(getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not render error message when error state is null', () => {
    const { queryByText } = render(<App2 />);
    expect(queryByText(/Kunne ikke hente postnumre./i)).toBeNull();
  });
});
