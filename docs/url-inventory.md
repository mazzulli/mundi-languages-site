# Inventário de URLs — mundilanguages.com

> Fase 0 · fonte: `sitemap_index.xml` (Rank Math) → `post-sitemap.xml`, `page-sitemap.xml`, `category-sitemap.xml`, rastreado em 29/09/2026. Todas as URLs abaixo responderam **HTTP 200**.
> Decisões (29/09/2026): manter URLs dos testes · redirecionar páginas extras · mercado principal **pt-BR**.
> Legenda do destino: **rota** = página no site novo com o mesmo caminho · **301** = redirecionamento permanente · **decidir** = pendente com a cliente (enquanto isso, a opção indicada é aplicada).

## Páginas previstas na especificação

| URL | Destino | Observação |
|---|---|---|
| `/` | rota | Home |
| `/empresas-e-profissionais/` | rota | |
| `/cursos-de-ingles/` | rota | |
| `/cursos-de-portugues/` | rota | |
| `/cursos-de-espanhol/` | rota | |
| `/cursos-de-frances/` | rota | |
| `/cursos-de-italiano/` | rota | |
| `/cursos-de-alemao/` | rota | |
| `/solucoes-para-professores/` | rota | |
| `/comofunciona/` | rota | |
| `/contato/` | rota | **Conteúdo extraído** (ver abaixo) — a proteção anti-bot não bloqueou |
| `/agendamento/` | rota | Formulário nativo (Fase 5) |
| `/teachers-needs-analysis/` | rota | Google Form `1FAIpQLSfutETQN0nt3BDHY_MEPrTFQoF_6RiT8SNAd7QRObm8OCZBYg`, H2 "Agende uma consulta gratuita" |
| `/professores-parceiros/` | rota | Google Form `1FAIpQLScpXgvVXyfQJW2Rm1s5lvk-Q6zZNB_T_R9nhZ6oymy3p71zZQ` |
| `/teste-o-seu-ingles-3/` | rota | Form `1FAIpQLSfkmOUrktxS3zauSbl4630mxL_LUox7f33crQUSJ8G-QDj_Uw` |
| `/take-a-portuguese-level-test/` | rota | Form `1FAIpQLSedCvriWRLkl69wpjg0VbHgX621OltzyhYmdAa_22Cz_N5Esw` |
| `/teste-o-seu-espanhol/` | rota | Form `1FAIpQLScTUkOMjhqNoaByINoPURr001fhiAr04UKZqTPM2goF1348Og` |
| `/teste-o-seu-frances/` | rota | Form `1FAIpQLSd24zKwCl38VJdTms32vLXuqNWzt9UzN8uhUUTmdUYeApb7Zg` |
| `/teste-o-seu-italiano/` | rota | Form `1FAIpQLSd1H78G5RZpVJFJ3fSqEPVYQfUBc9JlSXqBTrnhcnkFHGNkFA` |
| `/blog/`, `/blog/page/2/` | rota | paginação preservada |
| `/category/learners/`, `/category/teachers-learners/` | rota | |
| `/author/lighthouselanguages/` | 301 → `/sobre/` | |
| 14 posts na raiz (`/{slug}/`) | rota | ver lista abaixo |

**Testes de nível — decidido (29/09/2026):** as URLs antigas continuam canônicas. O hub `/teste-de-nivel/` aponta para elas.

## Páginas encontradas no sitemap e **fora** da especificação

| URL | Conteúdo encontrado | Destino proposto |
|---|---|---|
| `/sobre/` | "Olá! Eu sou a Karine Kakakis / Prazer em conhecê-los!" + seções "Missão e Valores" e "Equipe" preenchidas com **texto de template repetido** (cards de Inglês para Profissionais/Soft Skills). | **rota** — página `/sobre/` nova (já prevista na especificação). Aproveitar "Prazer em conhecê-los!"; missão, valores, equipe e bio = `TODO(cliente)` |
| `/link-in-bio/` | Página usada na **bio do Instagram**: ícones sociais + 3 grupos: "POPULAR COURSES • Mais Procurados" (3 Google Forms), "MORE SOLUTIONS • Mais Soluções" (6 páginas de idioma), "LEVEL TESTS • Testes de Nível" (5 testes). | **rota** — recriar (é link externo ativo). Forms adicionais: `1FAIpQLSdpDYeaMqS74nkOHUbn09mdDYasd352is0T3SkQtssk3aA7hA`, `1FAIpQLSdNduNqffA0xm-BrzLWhEpJRJ1BOrdRjtqWnHzxs4iLidFXlg`, `1FAIpQLSf-iIzcHSaCmQugIwXjAmz5uc-lTXJc8ukn30YlF5odU_GLqw` |
| `/black-friday/` | Campanha sazonal com preços (Plano Inicial / Plano Destrava, em € e R$) e depoimentos. | **301 → `/`** (decidido) |
| `/solucoes/` | "Conteúdos Gratuitos para Professores" — e-books e modelos com **descrições trocadas/placeholder**. | **301 → `/solucoes-para-professores/`** (decidido) |
| `/conteudos-gratuitos-instrutores/` | "Conteúdos Gratuitos para Estudantes" — 6 e-books (English for Interviews, Soft Skills…). | **301 → `/blog/`** (decidido) |
| `/dashboard/`, `/student-registration/`, `/instructor-registration/` | Páginas do plugin Tutor LMS (sem conteúdo público). | **301 → `/`** (o ambiente virtual é o Canvas) |
| `/cart/`, `/checkout/` | Páginas do WooCommerce vazias. | **301 → `/`** |

## URLs técnicas do WordPress (não estão no sitemap)

| URL | Destino |
|---|---|
| `/feed/`, `/comments/feed/`, `/{post}/feed/` | 301 → `/blog/` |
| `/sitemap_index.xml`, `/post-sitemap.xml`, `/page-sitemap.xml`, `/category-sitemap.xml`, `/wp-sitemap.xml` | 301 → `/sitemap.xml` |
| `/wp-content/uploads/*` | 301 → `/images/legacy/*` (imagens indexadas no Google Imagens) |
| `/wp-admin/*`, `/wp-login.php` | 410 / 404 |

## Posts (14)

| Slug | Última modificação (sitemap) |
|---|---|
| `precisando-se-preparar-para-entrevistas-em-ingles` | 2024-03-19 |
| `ano-do-coelho-de-agua-tradicoes-para-um-ano-de-sorte` | 2024-03-19 |
| `como-usar-a-tecnica-star-para-entrevistas` | 2022-08-23 |
| `7-competencias-importantes-para-desenvolver-o-trabalho-em-equipe` | 2022-06-08 |
| `design-thinking-na-educacao-empatia-desafio-descoberta-e-compartilhamento` | 2022-06-08 |
| `6-maneiras-de-gamificar-suas-aulas-de-idiomas` | 2022-05-22 |
| `soft-skills-hard-skills-o-que-mais-importa-no-mundo-do-trabalho-hoje` | 2022-05-22 |
| `sexta-feira-santa-sabado-de-aleluia-domingo-de-pascoa-em-ingles` | 2022-05-22 |
| `9-expressoes-que-voce-precisa-aprender-neste-ramada` | 2022-05-22 |
| `gamification-vs-game-based-learning` | 2022-05-22 |
| `8-expressoes-importantes-para-celebrar-todas-as-mulheres` | 2022-05-22 |
| `8-maneiras-de-utilizar-metodologias-ativas-e-ter-alunos-e-profissionais-mais-engajados` | 2022-05-22 |
| `8-maneiras-de-dar-aos-alunos-mais-controle-sobre-seus-resultados-de-aprendizagem` | 2022-05-22 |
| `portokali-por-que-em-algumas-linguas-portugal-significa-laranja` | 2022-05-22 |

## Conteúdo extraído de `/contato/` (antes marcado como indisponível)

- title: "Contato - Mundi Languages" · description: "Envie-nos uma mensagem"
- H2: **Ainda tem alguma dúvida?** · CTA: FALE COMIGO PARA SABER MAIS → WhatsApp
- Subtítulo: **Envie-nos uma mensagem**
- Card `2024/12/69.jpg` · **Horário de Atendimento** — Segunda a Sexta: 8h – 18h (Horário de Lisboa) · QUERO SABER MAIS → WhatsApp
- Card `2024/12/70.jpg` · **E-mail** — info@lighthouselanguages.com
- Card `2024/12/71.jpg` · **WhatsApp** — +351927372627

## Observações de SEO do site atual

- JSON-LD do Rank Math declara a organização como **"Lighthouse Languages"** com logo em `lighthouselanguages.com` — corrigir para Mundi Languages.
- `og:locale` e `inLanguage` = `en_US`.
- `/teachers-needs-analysis/` e testes com meta description "Loading…".
