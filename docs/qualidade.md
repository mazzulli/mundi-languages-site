# Qualidade — acessibilidade, performance e testes (Fase 8)

> Medições de 30/09/2026 no build de produção local (`pnpm build && pnpm start -p 3100`).

## Como rodar

| Comando | O que faz |
|---|---|
| `pnpm test:e2e` | Toda a suíte Playwright (desktop + mobile), incluindo axe e SEO. Precisa de build. |
| `pnpm lighthouse [url-base]` | Lighthouse mobile nas páginas principais; relatórios em `.lighthouse/`. |
| `pnpm vitals [execuções]` | Mediana de FCP/LCP/CLS/JS com perfil 4G lento + CPU 4x (Playwright). |
| `npx @lhci/cli autorun` | Lighthouse CI com as metas da spec (`lighthouserc.json`) — usar no preview/CI. |

## Acessibilidade (WCAG 2.2 AA)

- **axe-core** em 23 páginas × 2 viewports, com regras WCAG 2.0/2.1/2.2 A+AA, boas práticas e a regra experimental de *Label in Name* (2.5.3): **0 violações** (`tests/e2e/a11y.spec.ts`).
- **Lighthouse Acessibilidade: 100** nas 9 páginas medidas.
- Fluxos de teclado e leitor de tela testados (`tests/e2e/keyboard.spec.ts`): link "Pular para o conteúdo", foco visível, mega menu Soluções (abre com Enter, Esc devolve o foco), menu mobile (diálogo com foco preso), carrossel (botões, pausa, contador anunciado só quando pausado), erros de formulário ligados aos campos (`aria-invalid` + `aria-describedby`, foco no primeiro erro), `prefers-reduced-motion` (sem autoplay, sem smooth scroll, conteúdo visível sem animação) e botão do WhatsApp.

Correções feitas nesta fase:

| Problema | Correção |
|---|---|
| Carrossel de depoimentos rolável sem acesso por teclado antes do Embla carregar | Área focável (setas do teclado) no modo nativo |
| Contador do carrossel anunciado a cada 6 s durante a rotação | `aria-live` desligado enquanto gira, "polite" quando pausado (padrão WAI-ARIA) |
| Números das etapas de Como Funciona com contraste 2,3:1 | Cor `sunrise-deep` (4,9:1) |
| Botão "Fale com a Karine" com nome acessível diferente do texto visível (2.5.3) | Rótulo alinhado ao texto |
| Barra fixa de ações (mobile) fora de landmark | `<aside aria-label="Ações rápidas">` |
| CTAs do post com o mesmo rótulo (meio, fim, lateral) | Rótulos distintos |
| Esqueleto de carregamento do formulário com `aria-label` sem papel | `role="status"` + texto para leitor de tela |

## Performance

### Medição real (mediana de 5 execuções, 4G lento + CPU 4x, `pnpm vitals`)

| Página | FCP | LCP | CLS | JS transferido |
|---|---|---|---|---|
| Home | 2,00 s | 2,00 s | 0 | 172 KB |
| Cursos de Inglês | 1,66 s | 1,66 s | 0 | 174 KB |
| Empresas | 1,8–2,2 s | 1,8–2,2 s | 0 | 176 KB |
| Como Funciona | 1,45 s | 1,45 s | 0 | 175 KB |
| Agendamento | 1,14 s | 1,14 s | 0 | 288 KB |
| Blog | 1,48 s | 1,65 s | 0 | 174 KB |
| Contato | 1,42 s | 1,42 s | 0 | 277 KB |

Nesta máquina as medições variam ±0,3 s entre execuções. Metas da spec: LCP < 2,0 s, CLS < 0,05, JS da Home ≤ 180 KB — CLS e JS atendidos; LCP no limite na Home/Empresas.

Correções feitas nesta fase:

- **Contato:** LCP de 4,0 s → 1,4 s — a foto do primeiro card (primeira tela no celular) estava com carregamento tardio e escondida pelo reveal.
- **Reveal no scroll** passou de componente React para script inline que roda no `DOMContentLoaded`: o conteúdo da primeira tela não espera mais o JS hidratar (e um componente saiu do bundle).
- Menos larguras nos `srcset` das imagens (HTML e payload menores) e o logo escuro deixou de ser pré-carregado.
- Testado e **descartado**: `content-visibility: auto` nas seções da Home (sem ganho medido).

### Lighthouse local (mobile)

| Página | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| Home | 63–68 | 100 | 100 | 100 |
| Cursos de Inglês | 88–89 | 100 | 100 | 100 |
| Empresas | 88 | 100 | 100 | 100 |
| Professores | 82–87 | 100 | 100 | 100 |
| Como Funciona | 82–83 | 100 | 100 | 100 |
| Agendamento | 79 | 100 | 100 | 100 |
| Blog | 84 | 100 | 100 | 100 |
| Post (STAR) | 65–89 | 100 | 100 | 100 |
| Contato | 70–81 | 100 | 100 | 100 |

**A nota de Performance local não é confiável nesta máquina Windows:** o TBT oscila (o mesmo post foi de 130 ms para 820 ms sem mudança de código) e o LCP simulado (3,6–4,6 s) fica bem acima do medido no navegador com o mesmo perfil de rede/CPU (1,4–2,0 s). O critério "Lighthouse ≥ 95 em Performance" **ainda não está comprovado** e deve ser validado com o **PageSpeed Insights no preview publicado (Fase 9)** — se ficar abaixo, os próximos candidatos são o peso do formulário (RHF + Zod, ~110 KB a mais no Agendamento/Contato) e o tamanho do HTML da Home (~54 KB comprimidos).
