import { render, screen } from '@testing-library/react';
import Logo from '../logo';

describe('Logo Component', () => {
  test('renders logo without text', () => {
    render(<Logo />);
    // The SVG should be present
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    
    // The text shouldn't be visible by default
    const logoText = screen.queryByText('harmoniq');
    expect(logoText).not.toBeInTheDocument();
  });
  
  test('renders logo with text when showText is true', () => {
    render(<Logo showText={true} />);
    // The text should be visible
    const logoText = screen.getByText('harmoniq');
    expect(logoText).toBeInTheDocument();
  });
  
  test('applies custom className', () => {
    render(<Logo className="custom-class" />);
    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });
  
  test('renders in different sizes', () => {
    const { rerender } = render(<Logo size="small" />);
    let container = document.querySelector('.relative');
    expect(container).toHaveStyle({ height: '24px', width: '24px' });
    
    rerender(<Logo size="medium" />);
    container = document.querySelector('.relative');
    expect(container).toHaveStyle({ height: '32px', width: '32px' });
    
    rerender(<Logo size="large" />);
    container = document.querySelector('.relative');
    expect(container).toHaveStyle({ height: '48px', width: '48px' });
  });
});