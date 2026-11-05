import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('não dispara busca com input vazio', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    fireEvent.submit(screen.getByRole('search'));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('expõe uma busca acessível e envia o termo sem espaços externos', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/buscar cidade/i), '  Lisboa  ');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));
    expect(onSearch).toHaveBeenCalledWith('Lisboa');
  });

  it('desabilita o campo e não busca enquanto disabled', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole('textbox', { name: /buscar cidade/i });

    await user.type(input, 'Lisboa');
    rerender(<SearchBar onSearch={onSearch} disabled />);

    expect(input).toBeDisabled();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeDisabled();
    fireEvent.submit(screen.getByRole('search'));
    expect(onSearch).not.toHaveBeenCalled();
  });
});
