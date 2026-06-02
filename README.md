# Única Organização — Site Institucional

Site institucional da **Única Organização** (CNPJ 34.121.587/0001-09),
Personal Organizer Luana Coelho, em Palmas/TO.

## Estrutura

```
unicaorg/
├── index.html          # Home (com hero em Three.js)
├── servicos.html       # Serviços oferecidos + depoimentos
├── dicas.html          # Dicas, fotos e vídeos
├── contato.html        # Formulário + mapa + WhatsApp
├── css/
│   └── style.css       # Estilos compartilhados (nav, footer, tipografia, temas)
├── js/
│   └── main.js         # Cursor, mobile menu, scroll reveal, formulário
├── media/
│   ├── luana_picture_1.jpg      # Foto da Luana (JPEG progressivo)
│   ├── luana_picture_1.webp     # Versão WebP (menor)
│   └── icons/
│       ├── favicon-32.png       # Favicon 32×32 (abas)
│       ├── favicon.png          # Favicon 192×192 (touch)
│       └── logo.png             # Logo (otimizado)
├── robots.txt
└── sitemap.xml
```

## Configuração do formulário de contato

O formulário em `contato.html` usa o serviço gratuito **Web3Forms**.
Para ativá-lo:

1. Acesse <https://web3forms.com> e gere uma _access key_ informando
   o e-mail de destino (não exige cadastro — a chave chega no e-mail).
2. Em `contato.html`, localize a linha:
   ```html
   <input type="hidden" name="access_key" value="COLE-SUA-ACCESS-KEY-AQUI">
   ```
3. Substitua `COLE-SUA-ACCESS-KEY-AQUI` pela chave recebida.

A partir daí, cada envio chega no e-mail configurado no Web3Forms.
O limite gratuito é de 250 envios/mês (suficiente para a maioria dos
sites institucionais).

## Desenvolvimento local

Como é um site estático, basta abrir o `index.html` no navegador.
Para evitar problemas de CORS com fontes/SVGs, use um servidor local:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Acesse <http://localhost:8000>.

## Deploy

Qualquer hospedagem estática funciona. Sugestões gratuitas:

- **Netlify** — arrastar a pasta na interface, ou conectar ao git
- **Vercel** — `vercel --prod`
- **GitHub Pages** — push para branch `main`/`gh-pages`
- **Cloudflare Pages** — conectar repositório

## Stack

- HTML5 + CSS3 (CSS variables, grid, media queries)
- JavaScript vanilla (sem framework)
- [Three.js r128](https://threejs.org/) — hero animado da home
- Google Fonts: Playfair Display + Rubik
- [Web3Forms](https://web3forms.com/) — backend do formulário

## Identidade visual

Paleta principal (definida em `:root` no `style.css`):

| Cor          | Hex       | Uso                          |
|--------------|-----------|------------------------------|
| Sage         | `#76927d` | Cor primária                 |
| Sage escuro  | `#3b493f` | Texto, fundos escuros        |
| Amarelo      | `#f7de8e` | Destaques, CTAs              |
| Creme        | `#f7f5ee` | Fundo claro                  |

Tipografia: **Playfair Display** (serif, títulos) + **Rubik** (sans, corpo).

## Licença

© 2026 Única Organização, Serviços e Treinamentos LTDA.
Todos os direitos reservados.
