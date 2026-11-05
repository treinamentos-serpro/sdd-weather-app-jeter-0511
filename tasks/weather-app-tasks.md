# Backlog de Tarefas — Weather App

Tarefas derivadas de `plans/weather-app-plan.md`. Siga as dependências; tarefas independentes podem ser paralelizadas. Os IDs identificam as tarefas; a sequência recomendada de entrega está organizada em fatias verticais abaixo.

## Requisitos Funcionais → Tarefas

| Requisito da spec | Tarefas de implementação | Tarefas de validação |
| --- | --- | --- |
| FR-1 — Pesquisar e selecionar cidades | T-01, T-04, T-06, T-08, T-13 | T-17, T-19–T-20, T-24–T-27 |
| FR-2 — Consultar o clima atual | T-01, T-03, T-05, T-07, T-10, T-13 | T-16, T-18, T-20–T-21, T-24–T-28 |
| FR-3 — Consultar previsão de cinco dias | T-01, T-03, T-05, T-07, T-11, T-14 | T-16, T-18, T-20, T-22, T-24–T-28 |
| FR-4 — Alternar unidade de temperatura | T-01, T-02, T-07, T-10–T-12, T-14 | T-15, T-21–T-26 |

Todos os requisitos funcionais têm tarefas de implementação e validação associadas.

## Prioridade e tamanho

**Prioridade:** P0 desbloqueia a primeira fatia demonstrável; P1 completa o escopo funcional e sua cobertura de aceite antes da entrega; P2 é hardening após o fluxo principal. Tarefas P2 ligadas a NFRs continuam sendo gates antes de produção.

**Tamanho:** P é uma mudança pequena e localizada; M envolve comportamento integrado ou até dois arquivos principais; G envolve uma matriz ampla de validação ou trabalho transversal.

| Tarefa | Prioridade | Tamanho |
| --- | --- | --- |
| T-01 | P0 | P |
| T-02 | P0 | P |
| T-03 | P0 | M |
| T-04 | P0 | M |
| T-05 | P0 | M |
| T-06 | P0 | M |
| T-07 | P0 | M |
| T-08 | P0 | M |
| T-09 | P0 | P |
| T-10 | P0 | M |
| T-11 | P1 | M |
| T-12 | P1 | P |
| T-13 | P0 | M |
| T-14 | P1 | M |
| T-15 | P1 | P |
| T-16 | P1 | P |
| T-17 | P0 | M |
| T-18 | P1 | M |
| T-19 | P0 | M |
| T-20 | P0 | P |
| T-21 | P1 | M |
| T-22 | P1 | P |
| T-23 | P1 | M |
| T-24 | P0 | M |
| T-25 | P1 | M |
| T-26 | P0 | M |
| T-27 | P1 | M |
| T-28 | P1 | M |
| T-29 | P1 | M |
| T-30 | P2 | M |
| T-31 | P2 | G |
| T-32 | P0 | P |

## Fatias verticais

| Ordem | Fatia entregue | Tarefas | Resultado visível |
| --- | --- | --- | --- |
| 1 — P0 | Buscar cidade, selecionar resultado e consultar clima atual em Celsius | T-01–T-10, T-13 | Busca funcional, seleção explícita e condições atuais visíveis; serve como primeira demonstração utilizável. |
| 2 — P1 | Completar a previsão de cinco dias e alternância de unidade | T-11, T-12, T-14 | Forecast diário, tratamento parcial e alternância Celsius/Fahrenheit sem nova consulta. |
| 3 — P0/P1 | Verificar comportamento por camada e fluxo principal integrado | T-15–T-29 | Conversões, serviços, UI, hook, integração e E2E principal/edge cases cobertos. |
| 4 — P1/P2 | Fechar hardening e gates de produção | T-30–T-32 | Desempenho, acessibilidade, compatibilidade e comandos finais validados antes do lançamento. |

## Entrega 1 — Tipos

### T-01 — Definir os tipos de domínio

- **Descrição:** Declarar os modelos compartilhados do app e o contrato de erro do serviço.
- **Critérios de aceite:**
  - Existem `TemperatureUnit`, `City`, `CurrentWeather`, `DailyForecast`, `WeatherSnapshot`, `WeatherErrorKind` e `WeatherError` conforme Data Model do plano.
  - Temperaturas no domínio são Celsius; campos meteorológicos opcionais ausentes não usam zero.
  - `WeatherSnapshot.current` aceita `null` e `days` contém de zero a cinco previsões.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`
- **Tipo:** Data

## Entrega 2 — Funções puras

### T-02 — Implementar conversão de temperatura

- **Descrição:** Criar conversões puras e arredondamento conforme FR-4.
- **Critérios de aceite:**
  - Conversões seguem as fórmulas Celsius/Fahrenheit da spec.
  - Valores são arredondados ao inteiro mais próximo; empates vão para longe de zero, inclusive negativos.
  - As funções não alteram a entrada nem dependem de rede ou estado React.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`
- **Tipo:** Data

### T-03 — Implementar formatação e descrições WMO

- **Descrição:** Criar funções puras para data/hora local e códigos meteorológicos.
- **Critérios de aceite:**
  - Datas e horários são formatados em pt-BR usando fuso horário recebido como argumento.
  - Códigos WMO cobertos pela tabela do plano retornam descrição pt-BR; um código não mapeado retorna `Condição desconhecida`.
  - As funções não acessam rede, estado React ou relógio global.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/format.ts`, `src/lib/weatherCodes.ts`
- **Tipo:** Data

## Entrega 3 — Services

### T-04 — Implementar geocoding

- **Descrição:** Criar a chamada de busca e mapear resultados para `City`.
- **Critérios de aceite:**
  - Envia consulta codificada com `count=5`, `language=pt` e `format=json`.
  - Preserva a ordem e mapeia nome, coordenadas, região e país quando fornecidos.
  - Resposta 2xx sem resultados retorna lista vazia; falha HTTP, rede ou JSON retorna erro tipado.
  - A chamada expira em 10 s e não há retry automático (AC-1.1–AC-1.6).
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/weatherService.ts`
- **Tipo:** Data

### T-05 — Implementar consulta de forecast

- **Descrição:** Solicitar e mapear clima atual e previsão diária da cidade selecionada.
- **Critérios de aceite:**
  - Solicita os campos `current` e `daily` do plano, Celsius, km/h, `timezone=auto` e cinco dias.
  - Mapeia a resposta para `WeatherSnapshot`, valida coordenadas/unidades e preserva campos ausentes.
  - Combina `current.time` com o fuso da resposta e associa arrays diários por índice.
  - Falha HTTP, rede ou JSON retorna erro tipado; timeout é 10 s, sem retry automático (FR-2/FR-3).
- **Dependências:** T-01, T-04.
- **Arquivos prováveis:** `src/services/weatherService.ts`
- **Tipo:** Data

## Entrega 4 — Hook e estado

### T-06 — Orquestrar busca e seleção no hook

- **Descrição:** Implementar estados e ações de input, geocoding, resultados e seleção explícita.
- **Critérios de aceite:**
  - Busca inicia em `idle` e usa `loading`, `success`, `empty` e `error` nos resultados correspondentes.
  - Input vazio/só espaços não chama service; geocoding 2xx com zero resultados termina em `empty`.
  - Resultados preservam ordem; somente seleção explícita define `selectedCity` e permite forecast.
  - Retry é manual e desabilitado durante chamada (AC-1.2–AC-1.6).
- **Dependências:** T-01, T-04.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`
- **Tipo:** Data

### T-07 — Orquestrar forecast e unidade no hook

- **Descrição:** Implementar snapshot, dados parciais/antigos, concorrência e unidade da sessão.
- **Critérios de aceite:**
  - Forecast inicia após seleção; erros não são representados como dados vazios.
  - Snapshot mantém clima atual válido quando a previsão está indisponível e vice-versa.
  - Dados atuais com idade superior a duas horas são marcados como antigos; não ocorre atualização automática.
  - Só uma chamada fica pendente e respostas obsoletas não substituem a seleção atual.
  - Unidade começa em Celsius, mantém-se entre buscas na sessão e mudar unidade não chama service (AC-2.4–AC-2.6, AC-3.5, AC-4.1–AC-4.6).
- **Dependências:** T-02, T-05, T-06.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`
- **Tipo:** Data

## Entrega 5 — Componentes de UI

### T-08 — Implementar busca e estado vazio

- **Descrição:** Criar o campo de busca controlado e a apresentação de resultados vazios.
- **Critérios de aceite:**
  - Digitação não dispara rede; submit vazio/só espaços é bloqueado.
  - Resultados exibem cidade e região/país quando disponíveis, mantêm a ordem e podem ser selecionados explicitamente.
  - Zero resultados exibe estado vazio, distinto do erro; seleção é operável por teclado (AC-1.1–AC-1.5, NFR-3).
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`, `src/components/states/EmptyState.tsx`
- **Tipo:** UI

### T-09 — Implementar estados visuais de loading e erro

- **Descrição:** Criar componentes reutilizáveis de carregamento e erro com retry opcional.
- **Critérios de aceite:**
  - Loading renderiza elemento `role="status"` com texto não vazio.
  - Erro renderiza `role="alert"`, distinto do estado vazio.
  - Botão de retry aparece somente com callback, invoca-o uma vez por ativação e pode ser acionado por teclado.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`, `src/components/states/ErrorState.tsx`
- **Tipo:** UI

### T-10 — Implementar apresentação do clima atual

- **Descrição:** Exibir clima atual, horário, campos ausentes e indicador de dados antigos.
- **Critérios de aceite:**
  - Exibe cidade, temperatura e horário local; campos opcionais retornados exibem unidades correspondentes.
  - Campo opcional ausente mostra indisponibilidade, nunca `0`; sem temperatura, a seção atual mostra indisponibilidade.
  - Dados com idade até duas horas não recebem marcador de desatualização; dados com idade superior recebem (AC-2.1, AC-2.4–AC-2.6).
- **Dependências:** T-01, T-02, T-03, T-09.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`
- **Tipo:** UI

### T-11 — Implementar apresentação da previsão

- **Descrição:** Criar lista de dias e cartão de previsão diária.
- **Critérios de aceite:**
  - Cinco dias são exibidos em ordem de data local; cada cartão mostra data e valores retornados com unidades.
  - Para um a quatro dias, o texto é `Previsão parcial: X de 5 dias`, com X igual à quantidade exibida; para zero dias, a seção informa indisponibilidade.
  - Campo ausente não é renderizado como zero nem recebe substituto (AC-3.1–AC-3.5).
- **Dependências:** T-01, T-03, T-09.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`
- **Tipo:** UI

### T-12 — Implementar controle de unidade

- **Descrição:** Criar controle acessível que atualiza a unidade de apresentação por callback.
- **Critérios de aceite:** O controle apresenta Celsius e Fahrenheit, recebe a unidade atual, dispara o callback com a selecionada e pode ser operado por teclado; não inicia chamadas de rede (AC-4.1–AC-4.4).
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`
- **Tipo:** UI

## Entrega 6 — Integração em fatias

### T-13 — Integrar busca e clima atual no App

- **Descrição:** Compor a primeira fatia visível: busca, seleção de cidade e clima atual em Celsius.
- **Critérios de aceite:**
  - Fluxo conecta input → resultados → seleção → clima atual.
  - Loading, vazio e erro da busca, além do loading/erro/sucesso do clima atual, são exibidos sem `fetch` nos componentes.
  - Cidade selecionada, temperatura atual e horário local são visíveis; a unidade inicial é Celsius.
- **Dependências:** T-06, T-07, T-08, T-09, T-10.
- **Arquivos prováveis:** `src/App.tsx`
- **Tipo:** UI

### T-14 — Completar App com previsão e unidade

- **Descrição:** Estender a primeira fatia para exibir previsão diária e alternância Celsius/Fahrenheit.
- **Critérios de aceite:**
  - A tela integrada apresenta cinco dias ou o estado parcial/indisponível definido para a previsão.
  - Alternar unidade atualiza clima atual e previsão sem nova chamada e sem trocar cidade/datas (FR-3/FR-4, AC-3.1–AC-3.5, AC-4.1–AC-4.6).
- **Dependências:** T-11, T-12, T-13.
- **Arquivos prováveis:** `src/App.tsx`
- **Tipo:** UI

## Entrega 7 — Testes

### T-15 — Testar conversão de temperatura

- **Descrição:** Cobrir conversões e regra de arredondamento em Vitest.
- **Critérios de aceite:** Vitest verifica `0 °C → 32 °F`, `100 °C → 212 °F`, `32 °F → 0 °C`, `212 °F → 100 °C`, empates `20,5 → 21` e `-0,5 → -1`, e que a entrada não é mutada (FR-4, AC-4.2, AC-4.3, AC-4.6).
- **Dependências:** T-02.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`
- **Tipo:** Test

### T-16 — Testar formatação e códigos WMO

- **Descrição:** Testar funções de data/hora e códigos sem depender de relógio global.
- **Critérios de aceite:** Vitest verifica datas/horários usando fuso fixo, uma descrição conhecida, o fallback `Condição desconhecida` e entradas ausentes/inválidas sem lançar exceção (FR-2/FR-3, NFR-5).
- **Dependências:** T-03.
- **Arquivos prováveis:** `tests/unit/format.test.ts`, `tests/unit/weatherCodes.test.ts`
- **Tipo:** Test

### T-17 — Testar serviço de geocoding

- **Descrição:** Validar o endpoint de busca com `fetch` mockado.
- **Critérios de aceite:** Vitest verifica URL/parâmetros, ordem, máximo de cinco resultados, mapeamento de cidade, zero resultados, erro HTTP/rede/JSON e timeout de 10 s. Consultas parciais `são` e `SÃO` são codificadas sem perda de caracteres e podem mapear a resposta `São Paulo` (FR-1, AC-1.1–AC-1.6).
- **Dependências:** T-04.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`
- **Tipo:** Test

### T-18 — Testar serviço de forecast

- **Descrição:** Validar o endpoint de forecast e seu mapeamento com `fetch` mockado.
- **Critérios de aceite:** Vitest verifica parâmetros, clima atual, cinco dias, unidades/fuso, campos ausentes, arrays parciais e erros HTTP/rede/JSON/timeout de 10 s (FR-2/FR-3, AC-2.1–AC-3.5).
- **Dependências:** T-05, T-17.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`
- **Tipo:** Test

### T-19 — Testar busca e estado vazio

- **Descrição:** Cobrir interação de busca e zero resultados.
- **Critérios de aceite:** Testing Library verifica texto controlado, submit, bloqueio de input vazio, seleção, ordem dos resultados e mensagem vazia. Para dois resultados `São Paulo` com regiões/países diferentes, verifica que os valores distintos de região e país de ambos são renderizados (FR-1, AC-1.1–AC-1.5).
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`, `tests/unit/EmptyState.test.tsx`
- **Tipo:** Test

### T-20 — Testar loading e erro reutilizáveis

- **Descrição:** Cobrir feedback de carregamento, erro e retry manual.
- **Critérios de aceite:** Testing Library verifica roles `status`/`alert`, texto não vazio, retry ausente sem callback e chamada única após ativação (AC-1.6, AC-2.3, AC-3.4, NFR-3–NFR-4).
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/unit/LoadingState.test.tsx`, `tests/unit/ErrorState.test.tsx`
- **Tipo:** Test

### T-21 — Testar apresentação do clima atual

- **Descrição:** Verificar dados presentes/ausentes e marcador de desatualização.
- **Critérios de aceite:** Testing Library cobre sucesso, campo indisponível, clima sem temperatura, idade exatamente 2 h e acima de 2 h, unidades e acessibilidade (FR-2, AC-2.1–AC-2.6).
- **Dependências:** T-10.
- **Arquivos prováveis:** `tests/unit/CurrentWeather.test.tsx`
- **Tipo:** Test

### T-22 — Testar apresentação da previsão

- **Descrição:** Verificar cartões, lista, datas e contagem parcial.
- **Critérios de aceite:** Testing Library cobre cinco dias, um a quatro dias, zero dias, campos ausentes e unidades (FR-3, AC-3.1–AC-3.5).
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/unit/ForecastList.test.tsx`, `tests/unit/ForecastCard.test.tsx`
- **Tipo:** Test

### T-23 — Testar controle de unidade

- **Descrição:** Verificar valor selecionado, callback e teclado.
- **Critérios de aceite:** Testing Library verifica seleção de cada unidade, callback com valor esperado e ausência de dependência de rede (FR-4, AC-4.1–AC-4.4).
- **Dependências:** T-12.
- **Arquivos prováveis:** `tests/unit/UnitToggle.test.tsx`
- **Tipo:** Test

### T-24 — Testar estados e orquestração do hook

- **Descrição:** Testar o hook com service mockado e timers controlados.
- **Critérios de aceite:** Vitest cobre cada estado de busca/forecast, retry manual, input vazio, seleção, request único, resposta obsoleta e dados parciais. Com relógio controlado, dados atuais passam de válidos a desatualizados ao ultrapassar duas horas enquanto o hook permanece montado (AC-2.6). Verifica unidade inicial Celsius, manutenção de Fahrenheit ao selecionar outra cidade e que mudar unidade não chama service novamente (AC-4.1, AC-4.4).
- **Dependências:** T-06, T-07.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`
- **Tipo:** Test

### T-25 — Testar integração do App

- **Descrição:** Verificar a composição com hook real e service mockado.
- **Critérios de aceite:** Testing Library cobre a primeira fatia de busca/clima atual e a tela completa com forecast/unidade; alternar unidade preserva cidade/datas sem nova chamada forecast (FR-1–FR-4, AC-1.1–AC-4.6).
- **Dependências:** T-13, T-14, T-24.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`
- **Tipo:** Test

### T-26 — Automatizar fluxo E2E principal

- **Descrição:** Testar o caminho feliz em desktop e mobile com endpoints mockados.
- **Critérios de aceite:** Playwright cobre busca, seleção, clima atual, cinco dias e alternância sem request novo. Verifica Celsius inicial, mantém Fahrenheit ao pesquisar outra cidade e volta a Celsius após recarregar (AC-4.1, AC-4.4–AC-4.5). Executa o fluxo em viewport 375×812 sem rolagem horizontal; dados são determinísticos e não dependem da rede pública (US-1–US-5, NFR-1).
- **Dependências:** T-25.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-27 — Automatizar busca vazia e falhas E2E

- **Descrição:** Cobrir resultados vazios, erros de serviço, timeout e retry manual.
- **Critérios de aceite:** Playwright distingue busca sem resultados de falha/timeout, confirma input vazio sem request e verifica retry explícito sem repetição automática (AC-1.2–AC-1.3, AC-1.6, AC-2.3, AC-3.4, NFR-4).
- **Dependências:** T-26.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-28 — Automatizar respostas parciais E2E

- **Descrição:** Verificar previsão parcial, campos ausentes e dados atuais desatualizados.
- **Critérios de aceite:** Playwright confirma aviso `X de 5 dias`, ausência de valores inventados e indicação de dados antigos sem ocultar dados válidos (AC-2.5–AC-2.6, AC-3.2, AC-3.5).
- **Dependências:** T-26.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-29 — Validar viewports mobile e teclado

- **Descrição:** Verificar responsividade e operabilidade por teclado nos fluxos principais.
- **Critérios de aceite:** Em 320×720 e 375×812, Playwright confirma `scrollWidth <= clientWidth`; em 768, 1024, 1440 e 1920 px confirma ausência de rolagem horizontal. Os controles principais são alcançáveis e acionáveis por teclado (NFR-1, NFR-3).
- **Dependências:** T-26, T-27, T-28.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

## Entrega 8 — Hardening

### T-30 — Medir desempenho

- **Descrição:** Medir os tempos de busca e forecast nas condições de rede definidas pela spec.
- **Critérios de aceite:** Com RTT de 100 ms, banda de 10 Mbps e respostas do provedor em até 1 s, medir pelo menos 100 execuções de cada fluxo; p95 da busca é ≤ 3 s e p95 do forecast é ≤ 5 s (NFR-2).
- **Dependências:** T-29.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-31 — Validar acessibilidade e compatibilidade

- **Descrição:** Verificar conformidade WCAG e matriz de navegadores definida na spec.
- **Critérios de aceite:**
  - Auditoria dos fluxos principais não encontra violações WCAG 2.2 AA nos critérios aplicáveis de teclado, foco, nomes acessíveis, mensagens de estado e uso de cor.
  - Fluxos principais passam nas duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari; também em Chrome para Android e Safari para iOS. Registrar navegador/versão e falhas (NFR-1, NFR-3).
- **Dependências:** T-29.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`, `playwright.config.ts`
- **Tipo:** Test

### T-32 — Executar gates do projeto

- **Descrição:** Rodar os comandos de qualidade configurados no repositório antes da entrega.
- **Critérios de aceite:** cada comando (`pnpm lint`, `pnpm build`, `pnpm test`, `pnpm test:e2e`) termina com código de saída `0`.
- **Dependências:** T-30, T-31.
- **Arquivos prováveis:** Nenhum; tarefa de execução dos gates.
- **Tipo:** Test

## Infraestrutura

Não há tarefa Infra prevista: pnpm, Vite, Vitest, Playwright e Biome já estão configurados, e o plano não inclui backend nem serviço adicional.