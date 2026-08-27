# Mar das Coisas · Scrollytelling Territorial (Documental / GitHub Pages)

Narrativa cartográfica e multimídia em *scrollytelling* para a documentação aberta do encontro **Mar das Coisas 2026** em Ubatuba, articulando arte, ciência cidadã, tecnologias livres e águas.

---

## 🌊 Estrutura do Projeto

Este repositório foi concebido para publicação estática e gratuita no **GitHub Pages**, inspirado no modelo do **[Documental.xyz](https://documental.xyz)** e baseado em **MapLibre GL JS + Scrollama.js**:

* **`index.html`**: Estrutura principal da aplicação web responsiva.
* **`config.js`**: Arquivo central de configuração da narrativa, contendo as coordenadas, textos, mídias e alinhamentos de cada capítulo.
* **`assets/data/locations.geojson`**: Dados georreferenciados com pontos de interesse (Base IOUSP/LACO, Praia do Lamberto, Rio Acaraú, Rio Tavares, Rio Grande, Casa de Saúde Cultura Viva) e trajetos fluviais.
* **`assets/images/`**: Imagens e fac-símiles de campo otimizados para web (CC BY-SA 4.0).
* **`assets/css/style.css`**: Design moderno com cartões semi-transparentes (*glassmorphism*), navegação lateral e tipografia limpa.
* **`assets/js/app.js`**: Motor de scrollytelling, transições de câmera no mapa, alternância para satélite e modal de zoom de imagens.

---

## 🚀 Como Visualizar Localmente

Você pode rodar um servidor HTTP simples na pasta do projeto:

```bash
cd /home/felipe/public_html/projetos/mardascoisas-documental
python3 -m http.server 8080
```

Abra no navegador em: `http://localhost:8080`

---

## 📦 Como Publicar no GitHub Pages

1. Crie um novo repositório no GitHub (ou adicione uma branch `gh-pages`):
   ```bash
   cd /home/felipe/public_html/projetos/mardascoisas-documental
   git init
   git add .
   git commit -m "feat: initial scrollytelling release for Mar das Coisas"
   git remote add origin git@github.com:mardascoisas/documental.git
   git branch -M main
   git push -u origin main
   ```
2. No GitHub, acesse **Settings > Pages** e defina o branch `main` (ou pasta raiz `/`) como fonte de publicação.
3. O site estará disponível publicamente no endereço `https://mardascoisas.github.io/documental/`.

---

## ✏️ Como Editar e Adicionar Capítulos

Para adicionar ou editar pontos da narrativa, basta modificar o arquivo [`config.js`](config.js):

```javascript
{
    id: "meu-capitulo",
    alignment: "left", // "left", "right" ou "center"
    title: "Título do Capítulo",
    badge: "Dia / Tema",
    location: {
        center: [-45.1172, -23.5018], // [Longitude, Latitude]
        zoom: 15.5,
        pitch: 45.0,
        bearing: 30.0
    },
    image: "assets/images/minha-foto.jpg",
    imageCaption: "Legenda da foto / Crédito",
    description: "<p>Texto formatado em HTML...</p>"
}
```

---

## 🔗 Referências & Mídias

* **Acervo de Vídeos (CC BY-SA 4.0):** [Internet Archive](https://archive.org/details/mar-das-coisas-2026-ubatuba-doutor-f)
* **Enciclopédia & Wiki Completa:** [fonte.wiki](https://fonte.wiki/projetos/mardascoisas)
* **Plataforma Documental:** [documental.xyz](https://documental.xyz)
