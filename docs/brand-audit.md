# Auditoria de marca — Mundi Languages

> Fase 0 · extraído em 29/09/2026 de https://mundilanguages.com
> Scripts: `pnpm fetch:legacy` (assets) e `pnpm brand:colors` (cores do logo).

## 1. Fontes consultadas

| Fonte | Resultado |
|---|---|
| Kit global do Elementor (`post-695.css`) | **Valores padrão do Elementor, não da marca**: `--e-global-color-primary #6EC1E4`, `secondary #54595F`, `text #7A7A7A`, `accent #05B1F9`. Não usados visualmente — descartados. |
| CSS da Home (`post-9.css?ver=1790263947`) | Retorna **404** (cache do Elementor desatualizado). |
| Paleta global do tema Blocksy (`uploads/blocksy/css/global.css`) | **Paleta real da marca** (ver abaixo). |
| Estilos computados na página (Playwright) | H2 da Home `#678275`, H2 das internas `#4A5B62`, parágrafos `#678275`, botões `#69727D` com texto branco. |
| Logo horizontal (node-vibrant + contagem de pixels com sharp) | 3 cores dominantes: `#4A5B62`, `#4A625A`, `#94A79B`. |
| Tema do Google Form "Levantamento de Necessidades" | `#A5C7C2` — praticamente igual à `palette-color-1` do Blocksy (`#A3B8B5`). **Confirmado como cor da marca.** |

## 2. Paleta da marca (fonte da verdade)

### Logo
| Papel | Hex | Onde aparece |
|---|---|---|
| Ardósia (wordmark "MUNDI LANGUAGES") | `#4A5B62` | letras do logo, títulos das páginas internas |
| Sálvia profunda (faixa escura do globo) | `#4A625A` | globo |
| Sálvia clara (faixa clara do globo) | `#94A79B` | globo |

### Tema Blocksy (`--theme-palette-color-*`)
| Token | Hex | Uso atual |
|---|---|---|
| palette-1 | `#A3B8B5` | fundo de botões, destaques |
| palette-2 | `#EBF5F2` | fundos claros |
| palette-3 | `#678275` | títulos da Home, texto de corpo, hover |
| palette-4 | `#4A5B62` | títulos, texto forte |
| palette-5 | `#E7EBEE` | bordas |
| palette-6 | `#F3F5F7` | fundos neutros |
| palette-7 | `#FBFBFC` | fundo |
| palette-8 | `#FFFFFF` | branco |

Outras cores observadas: botões Elementor `#69727D` (cinza-ardósia), hover de botões `#5D5BD4` (violeta — resquício do tema, pouco usado).

## 3. Tipografia atual

- **Poppins** (Google Fonts) em todo o site: títulos 600–700, corpo 300–400, botões 500.
- **Wordmark do logo**: serifa clássica de caixa-alta, alto contraste e serifas triangulares (família semelhante a Marcellus/Trajan) + "LANGUAGES" em sans geométrica fina com tracking largo. O arquivo-fonte do logo não está disponível — `TODO(cliente)`: confirmar as fontes do logo com a designer (Mundi Studio).

## 4. Decisões para o site novo

### Âncoras da marca (mantidas)
```
--brand-primary:   #4A625A  /* sálvia profunda do globo — cor principal */
--brand-secondary: #4A5B62  /* ardósia do wordmark */
--brand-sage:      #94A79B  /* sálvia clara do globo */
--mist:            #EBF5F2  /* palette-2 do tema, derivado da família #A5C7C2 */
--brand-tint:      #A5C7C2  /* cor do formulário / palette-1 */
```
A escala `primary-50…950` é gerada em OKLCH a partir de `#4A625A` (ver `src/app/globals.css`).

### Ampliação (novos tons)
- `ink-950 #0B1220` / `ink-900 #111A2E` — seções escuras de impacto (hero, CTA final).
- `paper #FAF8F4` — off-white quente para leitura.
- `accent-sunrise` — coral-âmbar em OKLCH, **única cor de conversão** do site. Texto dos botões em `ink-950` para garantir contraste AA (validado em `pnpm check:contrast`).
- `accent-aurora` — gradiente mesh sálvia → verde-água → violeta suave (o violeta retoma o `#5D5BD4` do tema de forma sutil).

### Tipografia
- **Títulos: Fraunces** (serifa editorial variável) — dialoga com o wordmark serifado do logo e dá o toque editorial pedido.
- **Corpo: Plus Jakarta Sans** — geométrica como a Poppins atual e o "LANGUAGES" do logo, com melhor legibilidade em textos longos.

## 5. Prints de referência

| Arquivo | Descrição |
|---|---|
| `brand-audit/home-desktop.png` | Home atual, 1440×900 |
| `brand-audit/home-mobile.png` | Home atual, 390×844 |
| `brand-audit/cursos-de-ingles-desktop.png` | Cursos de Inglês |
| `brand-audit/comofunciona-desktop.png` | Como Funciona |

## 6. Assets baixados

65 imagens em `public/images/legacy/<ano>/<mês>/` (logos, fotos de cursos, passos, depoimentos, ícones de contato, capa do blog e cartões da página Link in Bio). Capas e imagens internas dos posts serão baixadas na Fase 6.
