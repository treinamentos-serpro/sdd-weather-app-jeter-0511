import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('Estados da consulta meteorológica', () => {
  it('anuncia o carregamento com role status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando o clima');
  });

  it('apresenta a mensagem de erro e permite tentar novamente por clique', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Falha de rede" onRetry={onRetry} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Falha de rede');
    await user.click(within(alert).getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('permite tentar novamente pelo teclado', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Tempo esgotado" onRetry={onRetry} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('mostra o título e a dica do estado vazio', () => {
    render(<EmptyState title="Nenhuma cidade encontrada" hint="Verifique a grafia." />);

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
    expect(screen.getByText('Verifique a grafia.')).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('aceita um estado vazio sem dica', () => {
    render(<EmptyState title="Busque uma cidade" />);

    expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeVisible();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});