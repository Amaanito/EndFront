import { render } from '@testing-library/react';
import { App2} from '../webApp';
import { describe, it, expect, } from 'vitest'; 
import { MemoryRouter } from 'react-router-dom';

describe('App2', () => {
  it('should not render error message when error state is null', () => {
    const { queryByText } = render(
      <MemoryRouter>
        <App2 />
      </MemoryRouter>
    );
    expect(queryByText(/Kunne ikke hente postnumre./i)).toBeNull();
  });
});