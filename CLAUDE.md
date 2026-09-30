@AGENTS.md

# Mundi Languages — regras do projeto

## Idioma (obrigatório)

- **Sempre responda ao usuário em português do Brasil (pt-BR)** — explicações, resumos, perguntas, mensagens de status e documentação em `docs/`.
- **Código sempre em inglês**: nomes de arquivos, pastas, variáveis, funções, componentes, tipos, interfaces, models, schemas Zod, rotas de API internas, chaves de objetos, comentários no código e mensagens de commit.
- **Textos da interface (UI) em português**, pois o público do site é lusófono. Exceções: nomes de cursos que já são em inglês (ex.: "English for Careers") e depoimentos originais em inglês.
- URLs públicas do site seguem os caminhos em português do site atual (ex.: `/cursos-de-ingles/`) — não traduzir.

## Especificação

A especificação completa está em `../PROMPT-MUNDI-LANGUAGES.md`. Leia antes de qualquer tarefa grande.

## Regras de conteúdo

- **Conteúdo é sagrado.** Todo texto do Apêndice A da especificação deve existir no site. Pode reorganizar e criar microcopy nova (títulos, CTAs, labels), mas não apagar nem reescrever o sentido dos textos originais.
- Só aplicar as correções ortográficas listadas na seção 10 da especificação.
- **Nunca inventar fatos** (número de alunos, anos de mercado, preços, certificações). Quando um dado faltar, marcar com `TODO(cliente)` e ocultar o componente até a confirmação.
- Depoimentos são falas de terceiros: nunca alterar o texto (exceto as correções da seção 10).
- Todo o conteúdo estruturado fica em `content/` (`content/*.ts` e `content/blog/*.mdx`). Rode `pnpm check:content` após editar.

## Stack e convenções

- Next.js 16 (App Router, `src/`), TypeScript strict, Tailwind CSS v4, pnpm.
- Antes de usar APIs do Next, consulte `node_modules/next/dist/docs/` (há breaking changes em relação à versão 15: `params` assíncronos, `proxy` em vez de `middleware`, etc.).
- Animações: GSAP + ScrollTrigger (scroll), Framer Motion (`motion/react`) para micro-interações, Lenis para smooth scroll. Animar apenas `transform` e `opacity`. Sempre respeitar `prefers-reduced-motion`.
- Um único CTA de conversão em `accent-sunrise`; CTA secundário em outline na cor primária.
- `trailingSlash: true` — todo link interno termina com `/`.
- Ao final de cada fase: `pnpm lint`, `pnpm typecheck` e `pnpm build` precisam passar.
