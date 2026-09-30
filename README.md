# Mundi Languages — site

Reconstrução do site https://mundilanguages.com (antes em WordPress + Elementor) em Next.js.
Especificação completa: `../PROMPT-MUNDI-LANGUAGES.md`.

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · GSAP + ScrollTrigger · Motion (Framer Motion) · Lenis · React Three Fiber (globo) · React Hook Form + Zod · Resend · pnpm.

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento em http://localhost:3000 |
| `pnpm build` / `pnpm start` | Build de produção e execução (deploy no Coolify com Nixpacks) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Gera os tipos de rota do Next e roda `tsc --noEmit` |
| `pnpm check` | lint + typecheck + check:content + build (rodar ao final de cada fase) |
| `pnpm check:content` | Garante que 100% do Apêndice A da spec existe no site (`--verbose` lista os CTAs legados) |
| `pnpm check:contrast` | Valida contraste WCAG AA de todos os pares de tokens |
| `pnpm images:manifest` | Gera dimensões e blur das imagens legadas (`content/generated/image-manifest.json`) |
| `pnpm fetch:legacy` | Baixa as imagens do site antigo para `public/images/legacy/` |
| `pnpm brand:colors` | Extrai as cores dominantes do logo |
| `pnpm brand:assets` | Gera logos recortados e ícones do app |

## Estrutura

```
content/            Conteúdo estruturado (fonte da verdade dos textos do site)
docs/               Auditoria de marca, inventário de URLs, pautas
public/brand/       Logos otimizados
public/images/legacy/  Imagens originais do WordPress (estrutura ano/mês)
scripts/            Scripts de migração e validação
src/app/            Rotas (App Router)
src/components/     layout/, motion/, ui/, icons/, sections/
src/lib/            Utilitários (GSAP, WhatsApp, cn)
```

## Convenções

- Respostas e documentação em pt-BR; código, nomes e comentários em inglês (ver `CLAUDE.md`).
- URLs com barra final (`trailingSlash: true`), idênticas às do WordPress.
- Um único CTA de conversão (`bg-sunrise`); secundário em outline na cor primária.
- Toda animação respeita `prefers-reduced-motion`.
- Dados não confirmados pela cliente ficam marcados com `TODO(cliente)`.
