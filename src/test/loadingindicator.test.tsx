import { describe, it } from 'vitest';
import { render,screen } from '@testing-library/react';
import {App2} from '../webApp';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';



describe('App2', () => {
  it('renders loading indicator when isLoading is true', () => {
    render(
      <MemoryRouter>
        <App2 />
      </MemoryRouter>
    );
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});