import { render, screen } from '@testing-library/react'

import Button from '../index'

describe('Button', () => {
    it('renders correctly with children', () => {
        const buttonText = 'Click Me';
        render(<Button>{buttonText}</Button>);

        const button = screen.getByRole('button', { name: buttonText });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(buttonText);
    });
})
