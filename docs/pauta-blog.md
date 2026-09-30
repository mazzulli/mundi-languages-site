# Pauta do blog — posts para as palavras-chave principais

> Spec §8.4: pauta apenas (não escrever os posts agora). Os volumes de busca **não foram validados**: conferir no Google Keyword Planner e no Search Console do site atual antes de priorizar. Cada post deve linkar para a página do curso indicada e receber o CTA contextual correspondente (`src/lib/blog/posts.ts` → `CTA_BY_POST`).

## Prioridade 1 — páginas de curso com mais intenção de compra

| # | Título proposto | Palavra-chave foco | Página de destino (link interno + CTA) | Categoria |
|---|---|---|---|---|
| 1 | Curso de inglês online funciona? Como escolher o formato certo para você | curso de inglês online | `/cursos-de-ingles/` | Learners |
| 2 | Aulas particulares de idiomas online: o que esperar da primeira aula | aulas particulares de idiomas | `/comofunciona/` | Learners |
| 3 | Inglês corporativo: como montar um programa para a sua equipe | inglês corporativo | `/empresas-e-profissionais/` | Teachers & Learners |
| 4 | Inglês in company x online: vantagens para empresas | inglês in company | `/empresas-e-profissionais/` | Teachers & Learners |
| 5 | Teste de nível de inglês: como funciona e por que fazer antes de começar | teste de nível de inglês | `/teste-o-seu-ingles-3/` | Learners |
| 6 | Português para estrangeiros: por onde começar | aulas de português para estrangeiros | `/cursos-de-portugues/` | Learners |

## Prioridade 2 — objetivos específicos (cauda longa)

| # | Título proposto | Palavra-chave foco | Página de destino | Categoria |
|---|---|---|---|---|
| 7 | IELTS, TOEFL ou Cambridge: qual exame de inglês escolher? | preparatório IELTS / TOEFL / Cambridge | `/cursos-de-ingles/` | Learners |
| 8 | Inglês para carreira: 10 situações do trabalho para treinar | inglês para carreira | `/cursos-de-ingles/#english-for-careers` | Learners |
| 9 | Conversação em espanhol: como perder o medo de falar | conversação em espanhol | `/cursos-de-espanhol/` | Learners |
| 10 | Português corporativo: comunicação no trabalho para estrangeiros | português corporativo | `/cursos-de-portugues/` | Teachers & Learners |
| 11 | Curso de francês online: da cultura à conversação | curso de francês online | `/cursos-de-frances/` | Learners |
| 12 | Curso de italiano online para viagens e trabalho | curso de italiano online | `/cursos-de-italiano/` | Learners |
| 13 | Curso de alemão online: primeiros passos | curso de alemão online | `/cursos-de-alemao/` | Learners |

## Prioridade 3 — professores de idiomas

| # | Título proposto | Palavra-chave foco | Página de destino | Categoria |
|---|---|---|---|---|
| 14 | Formação de professores de inglês: o que um bom programa deve ter | formação de professores de inglês | `/solucoes-para-professores/` | Teachers & Learners |
| 15 | Proficiência para professores: FCE, CAE ou CPE? | proficiência para professores | `/solucoes-para-professores/` | Teachers & Learners |
| 16 | Business English para professores: como ensinar inglês para negócios | Business English para professores | `/solucoes-para-professores/` | Teachers & Learners |

## Regras para quando os posts forem escritos

- Fatos, números e depoimentos: só com confirmação da cliente (nada inventado).
- Um H1 (título) e subtítulos H2/H3 — o sumário automático aparece a partir de 2 subtítulos.
- Imagem de capa com `alt` descritivo; meta description de 140–160 caracteres.
- Linkar 2–3 posts relacionados e a página do curso; a seção "Do blog" das páginas de curso é preenchida automaticamente pelo mapa de CTAs.
