# Apartheid Digital?

**Inclusão digital no Brasil: quem resolve serviços públicos pela internet?**

![Em 2025, 46 em cada 100 usuários de internet com renda familiar acima de 5 salários mínimos resolveram impostos pela internet, contra 4,8 em cada 100 com renda de até 1 salário mínimo.](assets/og-apartheid-digital.png)

Site do Projeto Integrador *Apartheid Digital? Uma análise da desigualdade no uso funcional da internet no Brasil (2023–2025)*, do curso de Ciência de Dados da Fatec Rubens Lara.

| | |
|---|---|
| **Site** | <https://rdgspedro.github.io/inclusao-digital-brasil/> |
| **Código e análise** | <https://github.com/RdgsPedro/apartheid-digital> |
| **Dados** | TIC Domicílios, Cetic.br/NIC.br: <https://cetic.br/pt/pesquisa/domicilios/microdados/> |

## Sobre o projeto

Ter internet não basta para ter inclusão digital. Cada vez mais serviços públicos passam para a internet, e quem não consegue usá-los corre o risco de ficar sem o serviço. O projeto usa os microdados da TIC Domicílios de 2023, 2024 e 2025 para mostrar quem consegue resolver documentos, saúde, educação, trabalho, impostos e outros serviços pela internet, e quem ainda precisa ir a um posto de atendimento.

A pergunta que guia o trabalho:

> Existe diferença na capacidade de resolver serviços públicos pela internet entre grupos de **renda, escolaridade, região e raça**? E em quais dimensões ela é maior?

O nome termina com um ponto de interrogação de propósito: a pergunta fica aberta, e os dados respondem com cuidado.

Este repositório guarda o **site** do projeto. Os notebooks, o tratamento dos microdados e a análise estatística ficam em [RdgsPedro/apartheid-digital](https://github.com/RdgsPedro/apartheid-digital).

## O que os dados mostram

- **Impostos é a área mais desigual.** Em 2025, 46 em cada 100 usuários com renda familiar acima de 5 salários mínimos resolveram ao menos um serviço de impostos pela internet, sem ir a um posto. Entre os de até 1 salário mínimo, foram 4,8 em cada 100, quase 10 vezes menos. A renda pesa duas vezes: quem ganha menos tenta menos e, quando tenta, resolve menos.
- **Tentar e resolver são coisas diferentes.** Saúde é a área mais procurada (36,6% dos usuários tentaram) e a que menos se resolve (22,6% de quem tentou). Em impostos, 61,1% de quem tentou resolveu.
- **Poucas diferenças resistem ao teste mais rigoroso.** Dos 88 testes feitos, 83 pareceriam diferenças reais num teste comum, mas só 8 se confirmam com os testes próprios para pesquisa por amostra.
- **Escolaridade e região são as diferenças mais firmes.** Das 8 confirmadas, 7 são de escolaridade (4) ou de região (3). O tamanho das diferenças é pequeno nas quatro dimensões, e a ordem entre elas é apertada: o ranking é uma tendência, não um pódio.
- **Raça: os dados não confirmam diferenças.** Nenhum teste de raça se confirmou. Isso não prova que não há diferença: mostra que a amostra não basta para afirmar com segurança.
- **O mesmo desenho aparece fora do governo.** Em finanças, a diferença entre ensino superior e até o fundamental é a maior do projeto (54,8 pontos percentuais), o que sugere que a desigualdade não é só do governo digital.

## Dados

- **Fonte:** TIC Domicílios 2023, 2024 e 2025, do Cetic.br (Centro Regional de Estudos para o Desenvolvimento da Sociedade da Informação), ligado ao NIC.br e ao CGI.br.
- **Amostra:** 21.271 entrevistados em 2023, 21.170 em 2024 e 24.535 em 2025. O público das perguntas sobre serviços públicos são os **45.436 usuários de internet com 16 anos ou mais**.
- **Áreas analisadas:** documentos pessoais, saúde pública, educação pública, trabalho e previdência, impostos e taxas, polícia e segurança, transporte e serviços urbanos, e justiça (só em 2025). Finanças entra à parte, para comparar com um serviço que não é do governo.
- **Duas perguntas por área:** *tentou* (usou a internet para procurar informações ou realizar serviços da área nos últimos 12 meses) e *resolveu* (entre quem tentou, realizou ao menos um serviço sem ir a um posto de atendimento).

## Método

1. **Peso amostral:** com o peso oficial da pesquisa, os números valem para o Brasil.
2. **Percentuais por grupo:** para cada área, ano e grupo, o percentual que tentou e o que resolveu.
3. **Margem de erro:** calculada com as 200 réplicas que a própria TIC disponibiliza e conferida com as tabelas oficiais.
4. **Teste das diferenças:** teste de Rao-Scott, feito para pesquisas por amostra, com a correção de Holm, mais rigorosa quando há muitos testes. O tamanho das diferenças é medido pelo V de Cramér.

Ferramentas: Python, pandas, NumPy, Svy, Power BI e GitHub.

## Limitações

- Toda estimativa tem margem de erro, e os grupos pequenos têm margem maior.
- Em 2025, o texto de 4 itens do questionário mudou (documentos, saúde, educação e transporte), então comparar 2025 com os anos anteriores pede cuidado.
- O cadastro de 2025 deixou de fora 7.805 setores de agrupamentos indígenas e 5.591 de quilombolas, o que pesa na comparação por raça.
- A pergunta mede se a pessoa resolveu **ao menos um** serviço da área sem ir a um posto, e não todos os serviços.
- A pergunta de finanças olha os últimos 3 meses; a dos serviços públicos, os últimos 12.

## Estrutura deste repositório

```
inclusao-digital-brasil/
├── index.html                  página única: conteúdo, dados estruturados (JSON-LD) e scripts
├── politica-de-privacidade.html  política de privacidade (LGPD)
├── style.css                   estilos do site
├── consent.js                  aviso de cookies e Google Analytics (só após o aceite)
├── sitemap.xml                 mapa do site para os buscadores
├── README.md
└── assets/
    ├── favicon.png               ícone da aba do navegador
    ├── og-apartheid-digital.png  imagem que aparece ao compartilhar o link
    ├── fonts/                    fonte Poppins (.woff2) e a licença dela
    └── figura-1 … figura-6       gráficos do Power BI, em .webp (em preparação)
```

O site é HTML, CSS e JavaScript puros, sem framework, sem etapa de build e sem dependências externas. A fonte Poppins (licença SIL Open Font License) fica hospedada em `assets/fonts/`, então o navegador não faz nenhum pedido a terceiros para carregar a página. A única exceção é o Google Analytics, que só é carregado depois que a pessoa aceita o aviso de cookies (veja *Privacidade e Analytics*).

## Rodando o site localmente

```bash
git clone https://github.com/RdgsPedro/inclusao-digital-brasil.git
cd inclusao-digital-brasil
python -m http.server 8000
```

Depois, abra <http://localhost:8000>. Também funciona abrir o `index.html` direto no navegador.

## Publicação

O site é publicado com o GitHub Pages: em **Settings → Pages**, fonte *Deploy from a branch*, branch `main`, pasta `/ (root)`. Cada push na `main` atualiza o site em poucos minutos.

## SEO

O site foi montado seguindo uma estratégia de SEO e *link building* para a disciplina de Marketing Digital:

- **Palavra-chave principal:** "inclusão digital", com cauda longa como "exclusão digital no Brasil", "o que é inclusão digital", "apartheid digital" e "TIC Domicílios".
- **Na página:** título com 58 caracteres, meta description com 134, um único H1 e H2 com palavras-chave, FAQ com 7 perguntas, links internos dentro dos textos, imagens com texto alternativo e carregamento preguiçoso, fonte hospedada no próprio site e conteúdo semântico acessível.
- **Para os buscadores:** `canonical`, Open Graph e Twitter Card, dados estruturados em JSON-LD (`WebSite`, `WebPage`, `Dataset`, `FAQPage` e `Person`) e `sitemap.xml`.
- **Antes de lançar:** o `<head>` traz `<meta name="robots" content="noindex, nofollow">`. Remova essa linha no lançamento e envie o `sitemap.xml` no Google Search Console.

## Privacidade e Analytics

A audiência é medida com o **Google Analytics 4**, em conformidade com a LGPD:

- O Google **só é chamado depois que a pessoa clica em "Aceitar"** no aviso de cookies. Sem escolha, ou com "Recusar", o site não abre nenhuma conexão com o Google. Os dois botões têm o mesmo peso visual.
- A escolha fica no navegador (`localStorage`, chave `ad_consent`), vale por 12 meses e pode ser mudada em **Preferências de cookies**, no rodapé. Ao recusar, os cookies `_ga*` são apagados.
- O Google Signals e a personalização de anúncios ficam desligados, e os cookies duram até 12 meses.
- Tudo está em `consent.js`. Para trocar a propriedade do Analytics, mude só a constante `GA_ID` no topo do arquivo.
- Eventos medidos (só com aceite): `clique_microdados`, `clique_github`, `clique_linkedin`, `clique_email`, `clique_externo`, `copiar_referencia`, `abrir_aba`, `abrir_figura`, `faq_aberta` e `ver_secao`, além dos eventos automáticos do GA4 (visualização de página, rolagem e cliques de saída).
- A página [`politica-de-privacidade.html`](politica-de-privacidade.html) explica o que é coletado, a base legal e os direitos. Ela usa `noindex` de propósito, mesmo depois do lançamento.

## Equipe

| Nome | Curso | LinkedIn |
|---|---|---|
| Pedro Rodrigues Almeida | Ciência de Dados, Fatec Rubens Lara | [perfil](https://www.linkedin.com/in/pedro-rdgs-almeida/) |
| Vitor Alexandre dos Santos Silva | Ciência de Dados, Fatec Rubens Lara | [perfil](https://www.linkedin.com/in/vitorrsilva/) |
| Eduardo Pedro Nogueira | Ciência de Dados, Fatec Rubens Lara | [perfil](https://www.linkedin.com/in/eduardo-nogueira-812588216/) |

**Orientação:** Claudia Maria Sodero Salles.

## Como citar

**Este projeto**

> ALMEIDA, Pedro Rodrigues; SILVA, Vitor Alexandre dos Santos; NOGUEIRA, Eduardo Pedro. *Apartheid Digital? Uma análise da desigualdade no uso funcional da internet no Brasil (2023-2025)*. Projeto Integrador (Ciência de Dados), Fatec Rubens Lara, Santos, 2026. Disponível em: https://rdgspedro.github.io/inclusao-digital-brasil/.

**A base de dados**

> COMITÊ GESTOR DA INTERNET NO BRASIL (CGI.br). *Pesquisa sobre o uso das tecnologias de informação e comunicação nos domicílios brasileiros: TIC Domicílios 2023, 2024 e 2025* [Microdados]. São Paulo: CETIC.br/NIC.br, 2023–2025. Disponível em: https://cetic.br/pt/pesquisa/domicilios/microdados/.

## Contato

Dúvidas, sugestões ou interesse em usar os dados: [apartheid.digital@gmail.com](mailto:apartheid.digital@gmail.com).

## Licença e uso dos dados

Os microdados da TIC Domicílios pertencem ao Cetic.br/NIC.br e seguem os termos de uso deles. Este repositório ainda não tem uma licença definida.