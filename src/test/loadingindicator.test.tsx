import { describe, it, expect, } from 'vitest';
import { render } from '@testing-library/react';
import {App2} from '../webApp';
import '@testing-library/jest-dom'

describe('App2', () => {
  it('should render loading indicator when isLoading is true', () => {
    const { getByTestId } = render(<App2/>);
    expect(getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
