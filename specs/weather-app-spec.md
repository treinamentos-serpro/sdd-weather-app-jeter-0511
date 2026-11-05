# Especificação de Produto — Aplicação de Previsão do Tempo

## Overview

A aplicação permite pesquisar uma cidade e consultar suas condições meteorológicas atuais e a previsão diária de hoje até quatro dias adiante. A primeira versão é em português do Brasil (pt-BR), usa Celsius inicialmente e permite alternar para Fahrenheit. A cidade deve ser escolhida nos resultados da busca; não há localização automática.

**Objetivos da primeira versão**

- Permitir encontrar e selecionar uma cidade para consultar o tempo.
- Apresentar condições atuais e a previsão de hoje e dos quatro dias seguintes.
- Permitir alternar a unidade de temperatura entre Celsius e Fahrenheit.
- Comunicar estados de carregamento, ausência de resultados, dados parciais e falhas de consulta.

**Público inicial**

As personas são hipóteses ainda não validadas: uma pessoa que planeja uma viagem, alguém que consulta o tempo antes de sair e alguém que prefere Fahrenheit. O público prioritário permanece em aberto.

**Decisões de produto**

- Fonte de dados: Open-Meteo, sem chave de API.
- Cobertura de busca: localidades retornadas pelo serviço, sem promessa de cobertura universal.
- Previsão: cinco dias locais consecutivos, de hoje a hoje + 4, conforme o fuso horário da cidade.
- Unidade inicial de temperatura: Celsius.
- Idioma inicial: pt-BR.
- Resultados de busca: no máximo cinco, na ordem retornada pelo serviço.
- Nova tentativa: somente por ação explícita da pessoa; sem repetição automática.
- A unidade selecionada vale até a página ser recarregada; não é persistida.
- Sem autenticação e sem persistência de dados no servidor.

## Functional Requirements

**FR-1 — Pesquisar e selecionar cidades**

O sistema deve aceitar nomes completos ou parciais com pelo menos um caractere não branco, sem diferenciar maiúsculas de minúsculas e incluindo letras acentuadas e Unicode, e apresentar até cinco resultados na ordem recebida do serviço. Cada resultado deve mostrar o nome da cidade e, quando fornecidos, região administrativa e país. A consulta vazia não deve ser enviada. Só uma cidade selecionada pode iniciar a consulta meteorológica.

**FR-2 — Consultar o clima atual**

Após a seleção de uma cidade, o sistema deve apresentar temperatura, sensação térmica, condição meteorológica, umidade relativa e velocidade do vento, além do nome da cidade e do horário local dos dados. Exibir unidades: °C ou °F para temperatura, % para umidade e km/h para vento. A resposta só pode ser chamada de atual se o horário informado pelo serviço não tiver mais de duas horas; dados mais antigos devem ser marcados como desatualizados.

**FR-3 — Consultar previsão de cinco dias**

Após a seleção de uma cidade, o sistema deve apresentar uma previsão por dia para hoje e os quatro dias seguintes no fuso horário da cidade. Cada dia deve identificar a data local e apresentar temperaturas mínima e máxima, condição meteorológica e probabilidade de precipitação. A previsão deve identificar a cidade consultada.

**FR-4 — Alternar unidade de temperatura**

O sistema deve permitir alternar entre Celsius e Fahrenheit e atualizar todos os valores de temperatura exibidos no clima atual e na previsão. A conversão deve usar °F = (°C × 9/5) + 32 e °C = (°F - 32) × 5/9, arredondando ao inteiro mais próximo; valores exatamente no meio são arredondados para longe de zero. A alternância não deve trocar a cidade, as datas nem disparar nova consulta meteorológica. Celsius é o padrão ao abrir ou recarregar a página.

## User Stories

- **US-1 (FR-1):** Como planejadora de viagem, quero pesquisar e selecionar a cidade de destino para consultar o tempo da localidade correta.
- **US-2 (FR-3):** Como planejadora de viagem, quero consultar a previsão de hoje e dos quatro dias seguintes para organizar atividades durante a viagem.
- **US-3 (FR-2):** Como pessoa decidindo a rotina do dia, quero ver as condições atuais da minha cidade para decidir o que fazer antes de sair.
- **US-4 (FR-4):** Como pessoa que prefere Fahrenheit, quero alternar a unidade de temperatura para interpretar os valores na unidade que conheço.
- **US-5 (FR-4):** Como pessoa que prefere Fahrenheit, quero ver as temperaturas atuais e previstas na unidade escolhida sem perder a cidade consultada para acompanhar o clima com facilidade.

## Acceptance Criteria

Cada critério usa as palavras-chave Given/When/Then para explicitar pré-condição, ação e resultado esperado.

**Para FR-1 / US-1 — Pesquisar e selecionar cidades**

- **AC-1.1:** Given que a pessoa informa uma consulta não vazia e o serviço retorna mais de cinco localidades, When os resultados são exibidos, Then são mostrados no máximo cinco, na mesma ordem recebida, com nome da cidade e região/país quando esses dados estiverem disponíveis.
- **AC-1.2:** Given que o campo de busca está vazio ou contém apenas espaços, When a pessoa tenta pesquisar, Then a consulta não é enviada e a interface solicita o nome de uma cidade.
- **AC-1.3:** Given que o serviço de geocoding conclui uma busca sem localidades, When a resposta é exibida, Then a interface informa que nenhum resultado foi encontrado e nenhuma consulta meteorológica é enviada.
- **AC-1.4:** Given que o serviço retorna uma localidade para uma consulta parcial ou com diferenças de maiúsculas/minúsculas e acentos, When os resultados são exibidos, Then a localidade pode ser selecionada e seu nome é apresentado com os caracteres retornados pelo serviço.
- **AC-1.5:** Given que há resultados de busca, When a pessoa seleciona um deles, Then o nome da localidade selecionada é exibido e somente essa seleção inicia a consulta meteorológica.
- **AC-1.6:** Given que a busca falha ou excede dez segundos, When a falha ou timeout ocorre, Then a interface exibe um erro distinto do estado sem resultados e oferece uma ação de nova tentativa, sem repetir a consulta automaticamente.

**Para FR-2 / US-3 — Consultar o clima atual**

- **AC-2.1:** Given que a resposta da cidade selecionada contém dados com até duas horas, When a consulta termina, Then são exibidos cidade, temperatura e horário local; sensação térmica, condição, umidade e velocidade do vento também são exibidas quando retornadas, e cada campo ausente é identificado como indisponível. Temperaturas usam °C ou °F, umidade usa % e vento usa km/h.
- **AC-2.2:** Given que a consulta do clima atual está pendente, When os dados ainda não chegaram, Then a interface apresenta um estado de carregamento.
- **AC-2.3:** Given que a consulta do clima atual falha ou excede dez segundos, When a falha ou timeout ocorre, Then a interface apresenta um erro, não exibe a resposta como atual e oferece nova tentativa manual.
- **AC-2.4:** Given que o horário dos dados recebidos tem mais de duas horas, When a resposta é exibida, Then os dados são identificados como desatualizados e não são rotulados como atuais.
- **AC-2.5:** Given que a resposta não contém temperatura, When o clima atual é exibido, Then a interface informa que o clima atual está indisponível e não inventa um valor; campos disponíveis podem continuar visíveis.
- **AC-2.6:** Given que dados atuais válidos estão visíveis e a página permanece aberta, When o horário desses dados ultrapassa duas horas de idade, Then a interface os marca como desatualizados sem apresentá-los como atuais.

**Para FR-3 / US-2 — Consultar previsão de cinco dias**

- **AC-3.1:** Given que a previsão da cidade selecionada contém cinco dias, When os dados são exibidos, Then aparecem exatamente as datas locais de hoje a hoje + 4, em ordem consecutiva.
- **AC-3.2:** Given que um dia de previsão tem dados disponíveis, When esse dia é exibido, Then ele mostra a data local e cada valor retornado entre mínima, máxima, condição e probabilidade de precipitação com sua unidade; cada campo ausente é identificado como indisponível.
- **AC-3.3:** Given que a consulta da previsão está pendente, When os dados ainda não chegaram, Then a interface apresenta um estado de carregamento.
- **AC-3.4:** Given que a consulta da previsão falha ou excede dez segundos, When a falha ou timeout ocorre, Then a interface apresenta um erro e oferece nova tentativa manual, sem repetição automática.
- **AC-3.5:** Given que a resposta contém de um a quatro dias válidos, When a previsão é exibida, Then somente esses dias são mostrados e a interface informa “Previsão parcial: X de 5 dias”; não afirma que os cinco dias foram carregados.

**Para FR-4 / US-4 e US-5 — Alternar unidade de temperatura**

- **AC-4.1:** Given que a página foi aberta ou recarregada, When há temperaturas disponíveis, Then todos os valores são exibidos em Celsius.
- **AC-4.2:** Given que os dados incluem 0 °C e 100 °C no clima atual e na previsão, When a pessoa seleciona Fahrenheit, Then os valores correspondentes são 32 °F e 212 °F.
- **AC-4.3:** Given que os dados incluem 32 °F e 212 °F, When a pessoa seleciona Celsius, Then os valores correspondentes são 0 °C e 100 °C.
- **AC-4.4:** Given que uma cidade e sua previsão estão exibidas, When a pessoa alterna a unidade, Then a cidade e as datas permanecem inalteradas e nenhuma nova consulta meteorológica é enviada.
- **AC-4.5:** Given que a pessoa selecionou Fahrenheit, When pesquisa outra cidade na mesma página, Then a unidade continua Fahrenheit; após recarregar a página, a unidade volta a Celsius.
- **AC-4.6:** Given que uma temperatura convertida resulta exatamente em 20,5 °C ou -0,5 °C, When a interface exibe Celsius, Then os valores são arredondados para 21 °C e -1 °C, respectivamente.

## Non-Functional Requirements

- **NFR-1 — Compatibilidade e responsividade:** os fluxos essenciais devem funcionar entre 320 e 1920 CSS px, sem rolagem horizontal. Validar em 320, 375, 768, 1024, 1440 e 1920 px, nas duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari; em dispositivos móveis, incluir Chrome para Android e Safari para iOS.
- **NFR-2 — Desempenho:** sob RTT de 100 ms, banda de 10 Mbps e respostas do provedor em até um segundo, p95 do envio da busca até resultados visíveis deve ser no máximo 3 s; para dados meteorológicos, no máximo 5 s. Toda chamada ao provedor deve expirar em 10 s.
- **NFR-3 — Acessibilidade:** atender WCAG 2.2 nível AA. Todos os fluxos devem ser operáveis por teclado, ter foco visível, nomes acessíveis em controles e mensagens de estado anunciáveis por leitor de tela; informação não pode depender somente de cor.
- **NFR-4 — Resiliência:** distinguir ausência de resultados de falha do serviço. Não repetir chamadas automaticamente; oferecer nova tentativa após falha, permitir uma chamada por vez e desabilitar o controle de nova tentativa enquanto ela estiver pendente.
- **NFR-5 — Idioma e formatos:** todos os textos e mensagens devem estar em pt-BR. Datas e horários são formatados em pt-BR, mas representam a data/hora local da cidade consultada.
- **NFR-6 — Privacidade:** não exigir conta, coletar localização do dispositivo ou persistir buscas e preferências após recarregar a página. A consulta de cidade é enviada ao Open-Meteo para obter resultados e dados meteorológicos.

## Traceability Matrix

| User Story | Requisito funcional | Acceptance Criteria | NFRs relevantes |
| --- | --- | --- | --- |
| US-1 — Pesquisar e selecionar cidade | FR-1 | AC-1.1–AC-1.6 | NFR-1, NFR-2, NFR-3, NFR-4, NFR-5, NFR-6 |
| US-2 — Consultar previsão de cinco dias | FR-3 | AC-3.1–AC-3.5 | NFR-1, NFR-2, NFR-3, NFR-4, NFR-5, NFR-6 |
| US-3 — Consultar clima atual | FR-2 | AC-2.1–AC-2.6 | NFR-1, NFR-2, NFR-3, NFR-4, NFR-5, NFR-6 |
| US-4 — Alternar unidade de temperatura | FR-4 | AC-4.1–AC-4.3, AC-4.6 | NFR-1, NFR-3, NFR-5, NFR-6 |
| US-5 — Manter contexto ao trocar unidade e cidade | FR-4 | AC-4.4–AC-4.5 | NFR-1, NFR-3, NFR-5, NFR-6 |

NFR-1 a NFR-6 são requisitos transversais; a matriz destaca os que afetam diretamente os cenários de cada história.

## Edge Cases

- **Cidade inexistente ou geocoding sem resultados:** mostrar “Nenhuma cidade encontrada”, não selecionar outra localidade e não solicitar dados meteorológicos.
- **Input vazio ou só com espaços:** não enviar a busca; informar que o nome da cidade é obrigatório.
- **Acentos e caracteres Unicode:** enviar como texto de pesquisa, sem interpretar o conteúdo como comando; exibir os caracteres devolvidos pelo serviço. Sem correspondências, usar o estado sem resultados.
- **Cidades homônimas:** exibir região e país quando fornecidos pelo serviço; exigir seleção explícita, sem escolher o primeiro resultado automaticamente.
- **Falha de API:** apresentar erro distinto do estado sem resultados, não exibir dados inválidos como atuais e permitir nova tentativa manual.
- **Timeout:** após 10 s sem resposta, encerrar a chamada, apresentar erro de tempo esgotado e permitir nova tentativa manual; não repetir automaticamente.
- **Resposta parcial:** para a previsão, mostrar os dias válidos e “Previsão parcial: X de 5 dias”; para campos ausentes, indicar indisponibilidade sem inventar valores. Sem dias válidos, mostrar erro de previsão indisponível.
- **Dados atuais antigos:** acima de duas horas, mostrar os dados como desatualizados, com o horário informado pelo serviço, e não rotulá-los como atuais.
- **Alternância durante consulta:** manter cidade e datas; aplicar a unidade escolhida quando os dados chegarem. Não enviar uma segunda consulta apenas pela mudança de unidade.

## Assumptions

- A aplicação necessita de conexão com a internet; funcionamento offline não faz parte da primeira versão.
- A cobertura geográfica depende das localidades disponíveis no Open-Meteo; não se promete cobertura universal.
- As personas descritas no discovery são hipóteses, não resultados de pesquisa com usuários.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| O serviço meteorológico ficar indisponível, limitar consultas ou não cobrir uma localidade. | Média | Alto | Comunicar falhas sem confundi-las com busca vazia; confirmar cobertura, limites e condições de uso antes do lançamento. |
| A busca levar à seleção de uma cidade homônima ou localização incorreta. | Média | Alto | Exibir contexto geográfico nos resultados e validar o fluxo de seleção. |
| Dados com mais de duas horas serem entendidos como atuais. | Média | Alto | Exibir horário local e marcar respostas fora do limite como desatualizadas. |
| Falha de rede impedir a consulta. | Média | Médio | Aplicar timeout de 10 s, apresentar erro distinto de ausência de resultados e permitir nova tentativa manual. |
| Valores incorretos após alternar entre Celsius e Fahrenheit. | Baixa | Alto | Usar as fórmulas e o arredondamento definidos em FR-4; testar clima atual, mínimas e máximas. |

## Out of Scope

- Autenticação, contas de usuário e dados persistidos no servidor.
- Geolocalização automática ou solicitação de permissão de localização.
- Histórico de buscas, cidades favoritas ou sincronização entre dispositivos.
- Alertas de tempo severo ou notificações.
- Funcionamento offline e garantia de consulta a dados em cache.
- Idiomas diferentes de pt-BR na primeira versão.
- Garantia de cobertura universal, disponibilidade do provedor ou funcionamento quando o serviço estiver indisponível.

## Open Questions

| Pergunta | Impacto se não for respondida |
| --- | --- |
| Qual persona e problema devem ser prioridade, e qual métrica de negócio define sucesso? | Sem validação, não é possível priorizar melhorias nem avaliar o impacto do produto. |
| Quais países ou regiões são prioritários e a cobertura do Open-Meteo atende a esses mercados? | A busca pode não cobrir as localidades esperadas pelo público; confirmar como gate de lançamento. |
| Quais são os limites de uso, termos de licença e requisitos de atribuição do Open-Meteo para o uso pretendido? | Pode bloquear o lançamento ou exigir ajustes de produto e atribuição; confirmar como gate de lançamento. |