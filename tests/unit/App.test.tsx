import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  it('renderiza a marca e o estado inicial vazio', () => {
    render(<App initialStatus="idle" />);
    expect(screen.getByText('WeatherView')).toBeInTheDocument();
    expect(screen.getByText(/busque uma cidade para começar/i)).toBeInTheDocument();
  });

  it('mostra a barra de busca e o alternador de unidade', () => {
    render(<App />);
    expect(screen.getByLabelText(/buscar cidade/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /unidade de temperatura/i })).toBeInTheDocument();
  });

  it('exibe o mock e converte temperaturas sem acessar a rede', async () => {
    render(<App />);
    const current = screen.getByRole('region', { name: 'Clima atual' });
    expect(within(current).getByText('24°')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    await userEvent.click(screen.getByRole('button', { name: '°F' }));
    expect(within(current).getByText('75°')).toBeInTheDocument();
  });

  it('mostra carregamento e busca vazia para uma cidade sem fixture', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText(/buscar cidade/i), 'Lisboa');
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText(/nenhuma cidade encontrada para "Lisboa"/i)).toBeInTheDocument();
  });

  it('permite recuperar o preview de erro com o mock', async () => {
    render(<App initialStatus="error" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(await screen.findByRole('region', { name: 'Clima atual' })).toBeInTheDocument();
  });
});
