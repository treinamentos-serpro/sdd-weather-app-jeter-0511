# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação de previsão do tempo. O briefing estabelece que usuários devem poder buscar cidades, consultar o clima atual, ver a previsão de cinco dias, alternar entre Celsius e Fahrenheit e usar a aplicação em dispositivos móveis. Foram definidas decisões iniciais sobre fonte de dados, intervalo da previsão, unidade padrão, autenticação, persistência de servidor e idioma. Público prioritário, conteúdo detalhado das previsões e critérios mensuráveis de qualidade ainda precisam ser definidos.

## Personas (hipóteses)

As personas abaixo são hipóteses iniciais derivadas do briefing, não resultados de pesquisa com usuários. As métricas propostas precisam ser validadas.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso (proposta) |
| --- | --- | --- | --- |
| **Planejadora de viagem** | Consultar o clima de uma cidade de destino e usar a previsão de cinco dias para planejar atividades. | Pesquisa com mais atenção em desktop antes da viagem; consulta também pelo celular durante a viagem. | Encontra a cidade correta e consulta a previsão de cinco dias em uma única tentativa, sem precisar refazer a busca. |
| **Pessoa decidindo a rotina do dia** | Ver rapidamente o clima atual antes de sair de casa. | Uso breve e recorrente, principalmente em celular. | Localiza a cidade e vê o clima atual em até 30 segundos, sem ajuda. |
| **Pessoa que prefere Fahrenheit** | Consultar o clima usando uma unidade de temperatura que já compreende. | Pode usar celular ou desktop; alterna a unidade durante a consulta. | Consegue mudar para Fahrenheit e confirmar que os valores exibidos seguem a unidade escolhida. |

## Requisitos Funcionais

- **RF1 — Buscar cidades:** permitir que o usuário pesquise cidades.
- **RF2 — Exibir clima atual:** apresentar o clima atual da cidade selecionada.
- **RF3 — Exibir previsão:** apresentar a previsão do tempo para cinco dias.
- **RF4 — Alternar unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit.

## Requisitos Não-Funcionais

- **RNF1 — Uso em dispositivos móveis:** a aplicação deve poder ser usada em dispositivos móveis. Tamanhos de tela e navegadores suportados precisam ser definidos.
- **RNF2 — Usabilidade:** busca, consulta e alternância de unidade devem ser compreensíveis e utilizáveis. Critérios de usabilidade ainda precisam ser acordados.
- **RNF3 — Desempenho:** consultas e exibição dos dados devem ocorrer em tempo aceitável; metas de tempo e condições de rede não foram especificadas.
- **RNF4 — Acessibilidade:** requisitos de navegação por teclado, leitores de tela e contraste devem ser definidos para garantir o uso por pessoas com diferentes necessidades.
- **RNF5 — Resiliência:** o comportamento diante de falhas de rede ou indisponibilidade dos dados deve ser definido para que o usuário receba feedback adequado.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| O serviço de dados meteorológicos ficar indisponível ou limitar consultas | Média | Alto | Definir uma fonte de dados adequada, tratar falhas e limites, e comunicar indisponibilidade ao usuário. |
| A busca retornar cidades com nomes iguais ou localização incorreta | Média | Alto | Exibir informações de localização suficientes para distinguir resultados e permitir confirmação antes da consulta. |
| Dados meteorológicos estarem desatualizados ou divergirem do esperado | Média | Alto | Definir fonte e frequência de atualização, e informar o horário dos dados quando disponível. |
| Falha de rede impedir a consulta | Média | Médio | Exibir um estado de erro compreensível e oferecer nova tentativa. |
| Interface não funcionar bem em diferentes dispositivos móveis | Média | Médio | Definir dispositivos e larguras suportados e validar a interface nesses cenários. |
| Valores incorretos serem apresentados após alternar entre Celsius e Fahrenheit | Baixa | Alto | Definir o comportamento de conversão e validá-lo com testes para ambas as unidades. |

## Perguntas em Aberto (Open Questions)

| Pergunta | Impacto se não for respondida |
| --- | --- |
| Quem é o público prioritário e qual problema deve ser resolvido primeiro: planejar os próximos dias, decidir o que fazer agora ou outro? | Sem foco, prioridades de conteúdo e decisões de UX podem atender a necessidades incompatíveis. |
| Como será medido o sucesso do produto? | Sem métricas, não será possível avaliar adoção, utilidade ou se a solução atende ao objetivo do negócio. |
| Quais países, regiões e localidades poderão ser pesquisados? | Afeta cobertura geográfica, fonte de dados, formatos regionais e expectativas dos usuários. |
| A busca aceita nomes parciais, acentos e localidades em diferentes idiomas? Quantos resultados apresenta? | Afeta a experiência de busca, os critérios de ordenação e a implementação do geocoding. |
| Como distinguir cidades homônimas ou resultados próximos? Quais informações de contexto serão exibidas? | O usuário pode selecionar a localização errada e receber uma previsão irrelevante. |
| Quais informações compõem o “clima atual”, além da temperatura? | Afeta a seleção dos dados, o layout e a utilidade da consulta. |
| Como a previsão de hoje e dos quatro dias seguintes será apresentada: em intervalos diários ou horários? | Afeta a quantidade de dados, o layout e a utilidade da previsão para diferentes decisões. |
| Quais informações devem aparecer na previsão e em que unidades, além de Celsius/Fahrenheit? | Afeta o contrato com a fonte de dados, o layout e a compreensão de valores como vento e precipitação. |
| Quais são os limites de uso, cobertura e condições da licença do Open-Meteo para este produto? | Pode afetar disponibilidade, conformidade com os termos de uso e viabilidade da aplicação. |
| Com que frequência os dados devem ser atualizados e qual idade máxima é aceitável? | Sem essa definição, dados desatualizados podem ser apresentados como atuais e não há critério para cache ou atualização. |
| A unidade escolhida pelo usuário deve ser lembrada entre visitas? | Afeta consistência da experiência e determina se uma preferência deve ser armazenada localmente. |
| A alternância de unidade altera somente a apresentação ou também solicita novos dados? Como serão tratados arredondamento e precisão? | Afeta consistência dos valores, desempenho e integração com a fonte de dados. |
| A aplicação deve solicitar geolocalização ou depender exclusivamente da busca? Como tratar recusa de permissão? | Afeta o fluxo inicial, permissões, privacidade e comportamento para quem não compartilha a localização. |
| Haverá suporte a idiomas além de pt-BR? Quais formatos de data/hora e convenções regionais serão usados? | Afeta textos, horários locais, datas e formatação dos dados meteorológicos. |
| O que deve ocorrer quando a busca não retorna resultados, a rede falha ou o serviço não responde? Deve haver nova tentativa? | Afeta a capacidade de recuperação e se o usuário consegue concluir a consulta. |
| A aplicação precisa funcionar offline ou manter dados em cache? Por quanto tempo os dados podem ser reutilizados? | Afeta disponibilidade percebida, atualidade das informações, armazenamento e complexidade de implementação. |
| Quais dispositivos, larguras de tela, orientações e navegadores devem ser suportados? | Sem um alvo definido, não é possível estabelecer nem verificar compatibilidade e responsividade. |
| Quais metas de desempenho, disponibilidade e volume de uso são esperadas? | Sem limites mensuráveis, não é possível dimensionar a solução nem verificar se ela atende às expectativas. |
| Quais requisitos de acessibilidade e critérios de conformidade devem ser atendidos? | Pessoas com necessidades diferentes podem não conseguir usar a aplicação, e a equipe não terá critérios objetivos de validação. |
| Quais dados do usuário serão coletados ou armazenados? Há requisitos de consentimento, retenção ou exclusão? | Pode haver coleta desnecessária de dados pessoais, riscos de privacidade e retrabalho para adequação legal. |
| Histórico de buscas ou cidades favoritas devem ser armazenados localmente ou sincronizados entre dispositivos? | Afeta escopo, persistência, privacidade e esforço de implementação; sincronização exigiria rever a decisão de não persistir dados no servidor. |
| Alertas de tempo severo ou avisos de segurança fazem parte do produto? | A ausência de alertas pode deixar necessidades importantes sem atendimento; incluí-los altera escopo e requisitos de confiabilidade. |

## Decisões

| Decisão | Justificativa | Perguntas em aberto resolvidas |
| --- | --- | --- |
| **Fonte de dados:** Open-Meteo, sem API key. | Evita exigir credenciais de API e simplifica a configuração inicial e a distribuição do app. | Define qual fonte será consultada e responde se é necessária uma chave de API. Limites de uso, cobertura e licença continuam em aberto. |
| **Período da previsão:** hoje e os quatro dias seguintes. | Dá um significado preciso ao requisito “previsão de cinco dias”. | Define se o período inclui hoje. A granularidade diária ou horária ainda precisa ser decidida. |
| **Unidade padrão:** Celsius. | Define uma apresentação inicial consistente para a interface em pt-BR. | Define qual unidade aparece inicialmente. Persistência da escolha do usuário e comportamento da alternância continuam em aberto. |
| **Autenticação e persistência de servidor:** não haverá autenticação nem dados persistidos no servidor. | Mantém a primeira versão simples e sem contas de usuário ou sincronização baseada em servidor. | Descarta login e persistência de servidor no escopo inicial. Histórico, favoritos e preferências armazenados localmente continuam em aberto. |
| **Idioma da interface:** pt-BR. | Alinha a experiência inicial ao idioma definido para o treinamento e seu público. | Define o idioma inicial da interface. Suporte a outros idiomas e formatos regionais adicionais continuam em aberto. |

## Suposições (Assumptions)

- “Celsius e Fahrenheit” refere-se à unidade de temperatura apresentada ao usuário.
- A busca de cidade é o meio pelo qual o usuário escolhe a localização para a consulta; uso de geolocalização não foi solicitado no briefing.
- A aplicação necessita de acesso à internet para consultar o Open-Meteo; comportamento offline e cache ainda precisam ser definidos.
- O requisito para dispositivos móveis indica que a interface deve se adaptar a telas móveis; o nível de suporte ainda precisa ser acordado.