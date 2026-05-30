# Referência de design (Stitch)

Export do Stitch atualizado em **maio/2026** (`stitch_aprenda_aqui_gamified_platform-2.zip`).

## Como usar

1. **Tokens e diretrizes:** `stitch_aprenda_aqui_gamified_platform/aprenda_aqui/DESIGN.md`
2. **Layout por tela:** `code.html` em cada pasta (HTML + Tailwind do export)
3. **Preview visual:** `screen.png` na mesma pasta
4. **Landing (HTML grande):** preferir `aprenda_aqui_landing_page/code.stripped.html` (sem base64 embutido)

## Telas disponíveis

| Pasta | Descrição |
|-------|-----------|
| `aprenda_aqui_landing_page` | Landing pública |
| `login_aprenda_aqui` | Login / cadastro |
| `dashboard_do_aluno` | Dashboard |
| `interface_de_li_o` | Lição (quiz) |
| `interface_de_li_o_editor_de_c_digo` | Lição com editor de código |
| `ranking_ligas` | Ranking e ligas |
| `perfil_e_conquistas` | Perfil e conquistas |
| `comunidade_e_amigos` | Comunidade |
| `loja_de_itens_aprenda_aqui` | Loja (gemas) |
| `modal_de_sucesso_de_compra` | Modal pós-compra na loja |
| `configura_es_aprenda_aqui` | Configurações |
| `faq_central_de_ajuda` | FAQ / ajuda |
| `aprenda_aqui_logo` | Logo |
| `html_icon`, `css_icon`, `js_icon`, `python_icon` | Ícones de trilhas |
| `playful_3d_mascot_character_...` | Mascote (asset) |

Documento de produto: `stitch_aprenda_aqui_gamified_platform/prd_aprenda_aqui.md`

## Implementação no app

O código vivo fica em `apps/web/`. Use esta pasta só como referência visual e de tokens — não copiar HTML inteiro sem adaptar aos componentes existentes.
