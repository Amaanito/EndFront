import { render } from '@testing-library/react';
import { App2} from '../webApp';
import { describe, it, expect, } from 'vitest'; 

describe('App2', () => {
  it('should not render error message when error state is null', () => {
    const { queryByText } = render(<App2 />);
    expect(queryByText(/Kunne ikke hente postnumre./i)).toBeNull();
  });
});
