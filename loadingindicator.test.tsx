import { describe, it, expect, } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {App2} from './src/webShop';
import React from 'react';


describe('App2', () => {
  it('should render loading indicator when isLoading is true', () => {
    const { getByTestId } = render(<App2/>);
    expect(getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
