var config = {
    style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    satelliteStyle: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    accessToken: "", // Optional Mapbox token. If empty, MapLibre uses open Carto/OSM vector tiles and ESRI satellite.
    showMarkers: true,
    markerColor: "#0ea5e9",
    theme: "dark",
    use3dTerrain: false,
    title: "MAR DAS COISAS",
    subtitle: "Arte, Ciência Cidadã, Tecnologias Livres e Águas em Ubatuba",
    byline: "Tropixel · LACO / IOUSP · Ubatuba Ciências Culturas (/U.CC/) · Redes do Território",
    date: "30 de julho a 1º de agosto de 2026 · Ubatuba, SP",
    footer: "Documentação aberta publicada sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).",
    archiveUrl: "https://archive.org/details/mar-das-coisas-2026-ubatuba-doutor-f",
    wikiUrl: "https://fonte.wiki/projetos/mardascoisas",
    chapters: [
        {
            id: "intro-capa",
            alignment: "center",
            hidden: false,
            title: "Mar das Coisas",
            badge: "Abertura & Território",
            location: {
                center: [-45.0750, -23.4550],
                zoom: 11.8,
                pitch: 30.0,
                bearing: 0.0
            },
            mapAnimation: "flyTo",
            image: "assets/images/katia_20260731_140034.jpg",
            imageCaption: "Enseada do Flamengo e costa de Ubatuba durante o encontro. Foto: Katia Zirnberger / CC BY-SA 4.0",
            description: `<p>O <strong>Mar das Coisas 2026</strong> reuniu em Ubatuba pesquisadores, artistas, educadores, ativistas socioambientais e comunidades costeiras entre 30 de julho e 1º de agosto de 2026. O encontro articulou ecologias marinhas, monitoramento comunitário de águas, bioacústica, fabricação livre e memórias territoriais.</p>
            <p>Esta narrativa cartográfica em <em>scrollytelling</em> percorre os três dias de imersão: das bancadas e tanques do laboratório oceanográfico às margens dos rios e manguezais urbanos, culminando na construção coletiva da <em>Carta-Manifesto Mar das Coisas</em>.</p>`
        },
        {
            id: "dia-30-laco",
            alignment: "left",
            hidden: false,
            title: "30/07 · Chegada e Laboratórios no LACO",
            badge: "Dia 1 · Base Oceanográfica",
            location: {
                center: [-45.118891, -23.499909],
                zoom: 15.8,
                pitch: 52.0,
                bearing: 38.0
            },
            mapAnimation: "flyTo",
            image: "assets/images/f_20260730_20260730_094051.jpg",
            imageCaption: "Chegada à Base de Pesquisa Clarimundo de Jesus (IOUSP), Praia do Lamberto. Foto: Doutor F / CC BY-SA 4.0",
            videoArchiveId: "20260730_121757",
            description: `<p>Instalação na <strong>Base de Pesquisa Clarimundo de Jesus</strong> do Instituto Oceanográfico da USP (IOUSP), na Praia do Lamberto. As atividades iniciaram no <strong>LACO (Laboratório de Arte e Ciência Oceânica)</strong> com a abertura institucional conduzida por Fabiane M. Borges (LACO/USP), Alexander Turra (Cátedra UNESCO), Rubens Lopes (LAPS) e Felipe S. Fonseca (/U.CC/).</p>
            <div class="callout-box">
                <strong>Visita e Debates:</strong>
                <ul>
                    <li>Visita guiada aos laboratórios e ao LAPS (Sistemas Planctônicos).</li>
                    <li>Mesa <em>Água, Resíduos e Contaminação: Experiências no Território</em> com APAMLN, Instituto Argonauta, RecriaMar e GERCO/SMA.</li>
                    <li>Mergulho de descontaminação e cartografia inicial dos efluentes e resíduos na costa.</li>
                </ul>
            </div>`
        },
        {
            id: "dia-31-cartas",
            alignment: "right",
            hidden: false,
            title: "31/07 · Cartas Climáticas & Materialidades da Água",
            badge: "Dia 2 · Criação & Especulação",
            location: {
                center: [-45.118639, -23.500000],
                zoom: 16.6,
                pitch: 42.0,
                bearing: -25.0
            },
            mapAnimation: "flyTo",
            image: "assets/images/f_20260731_20260731_105944.jpg",
            imageCaption: "Roda ao ar livre com o baralho de cartas de ficção e futuros climáticos. Foto: Doutor F / CC BY-SA 4.0",
            description: `<p>O segundo dia combinou fabulação especulativa à beira-mar e debates conceituais no LACO.</p>
            <p>Pela manhã, <strong>Fabiane M. Borges</strong> conduziu a dinâmica das <em>Cartas Climáticas</em>. Em pequenos grupos sob a sombra das árvores na enseada, participantes elaboraram narrativas, mitologias e cenários futuros cruzando dados ambientais e memórias caiçaras.</p>
            <p>À tarde, apresentações sobre <em>Arte, Ciência e Infraestruturas Hídricas</em> com Malu Hatoum (UFF), Mariana Vilela, Teresa Dillon (Repair Acts / Univ. de Southampton) e Diana Zatz debateram tecnologias de reparo, contaminações invisíveis e materialidades da água.</p>`
        },
        {
            id: "dia-01-rios",
            alignment: "left",
            hidden: false,
            title: "01/08 (Manhã) · Cartografia dos Rios e Manguezais",
            badge: "Dia 3 · Saída de Campo",
            location: {
                center: [-45.0710, -23.4415],
                zoom: 14.9,
                pitch: 58.0,
                bearing: 50.0
            },
            mapAnimation: "flyTo",
            image: "assets/images/f_bacia_acarau_20260801_103455.jpg",
            imageCaption: "Observação na foz do Rio Acaraú e encontro estuarino. Foto: Doutor F / CC BY-SA 4.0",
            description: `<p>Expedição auto-organizada pelas bacias hidrográficas urbanas de Ubatuba, percorrendo os rios <strong>Acaraú</strong>, <strong>Tavares</strong> e <strong>Rio Grande</strong>.</p>
            <p>O grupo documentou pontos de estrangulamento de drenagem, canalizações urbanas, descarte de resíduos, matas ciliares remanescentes e zonas de transição entre o rio e o manguezal.</p>
            <p>Durante a caminhada, transmissões espontâneas da <em>Rádio Mar das Coisas</em> capturaram depoimentos e impressões dos participantes em tempo real.</p>`
        },
        {
            id: "dia-01-bioacustica",
            alignment: "right",
            hidden: false,
            title: "Bioacústica Cidadã: Merlin Bird ID",
            badge: "Ciência Comunitária",
            location: {
                center: [-45.0685, -23.4370],
                zoom: 16.2,
                pitch: 45.0,
                bearing: 15.0
            },
            mapAnimation: "flyTo",
            image: "assets/images/katia_screenshot_20260801_131747_merlin_bird_id.jpg",
            imageCaption: "Identificação bioacústica em tempo real via Merlin Bird ID. Captura: Katia Zirnberger / CC BY-SA 4.0",
            description: `<p>A escuta atenta do território foi complementada pelo monitoramento bioacústico através do aplicativo livre <em>Merlin Bird ID</em> (Cornell Lab / Ciência Comunitária).</p>
            <p>As gravações registraram espécies da avifauna costeira e da mata de restinga ao longo dos canais fluviais, demonstrando como ferramentas digitais abertas podem ser apropriadas para inventários ecológicos participativos.</p>`
        },
        {
            id: "dia-01-barcas",
            alignment: "left",
            hidden: false,
            title: "01/08 (Tarde) · Oficina BARCAS Regenerativas",
            badge: "Metodologia & Matrizes",
            location: {
                center: [-45.0780, -23.4380],
                zoom: 16.4,
                pitch: 40.0,
                bearing: -12.0
            },
            mapAnimation: "flyTo",
            image: "assets/images/f_barcas_20260801_160707.jpg",
            imageCaption: "Construção de matrizes de regeneração na Casa de Saúde Cultura Viva. Foto: Doutor F / CC BY-SA 4.0",
            description: `<p>À tarde, os participantes reuniram-se na <strong>Casa de Saúde Cultura Viva</strong> para a oficina facilitada por <strong>Floriana Breyer</strong> (Biodiversas Lab).</p>
            <p>Através da metodologia <strong>BARCAS</strong> (<em>Bússola Exploradora da Regeneração Cultural, Ambiental e Social</em>), foram mapeadas matrizes territoriais de vulnerabilidade e potencialidade, articulando propostas de cooperação entre projetos locais e redes de pesquisa.</p>`
        },
        {
            id: "caderno-anotacoes",
            alignment: "right",
            hidden: false,
            title: "Caderno de Bordo & Fac-símiles",
            badge: "Memória Manuscrita",
            location: {
                center: [-45.0850, -23.4520],
                zoom: 13.8,
                pitch: 35.0,
                bearing: 5.0
            },
            mapAnimation: "flyTo",
            image: "assets/images/f_caderno_1.jpg",
            imageCaption: "Fac-símile do caderno de campo: esquemas, dados de gestão e anotações. Foto: Doutor F / CC BY-SA 4.0",
            description: `<p>A memória gráfica do encontro foi registrada em um caderno de bordo manuscrito contendo esquemas de governança hídrica, fluxos de resíduos, resumos das mesas e sínteses das dinâmicas.</p>
            <div class="notebook-gallery">
                <a href="assets/images/f_caderno_1.jpg" target="_blank"><img src="assets/images/f_caderno_1.jpg" alt="Pág 1" title="Página 1: Abertura"/></a>
                <a href="assets/images/f_caderno_2.jpg" target="_blank"><img src="assets/images/f_caderno_2.jpg" alt="Pág 2" title="Página 2: Gestão hídrica"/></a>
                <a href="assets/images/f_caderno_3.jpg" target="_blank"><img src="assets/images/f_caderno_3.jpg" alt="Pág 3" title="Página 3: Fabulações"/></a>
                <a href="assets/images/f_caderno_4.jpg" target="_blank"><img src="assets/images/f_caderno_4.jpg" alt="Pág 4" title="Página 4: Rios"/></a>
                <a href="assets/images/f_caderno_5.jpg" target="_blank"><img src="assets/images/f_caderno_5.jpg" alt="Pág 5" title="Página 5: BARCAS"/></a>
                <a href="assets/images/f_caderno_6.jpg" target="_blank"><img src="assets/images/f_caderno_6.jpg" alt="Pág 6" title="Página 6: Encaminhamentos"/></a>
            </div>`
        },
        {
            id: "manifesto-encerramento",
            alignment: "center",
            hidden: false,
            title: "Carta-Manifesto & Continuidade",
            badge: "Encaminhamentos & Rede",
            location: {
                center: [-45.0750, -23.4600],
                zoom: 12.2,
                pitch: 20.0,
                bearing: 0.0
            },
            mapAnimation: "flyTo",
            image: "assets/images/logos-todos.png",
            imageCaption: "Instituições, laboratórios e coletivos parceiros do encontro Mar das Coisas 2026.",
            description: `<p>A plenária de encerramento consolidou as bases para a <strong>Carta-Manifesto Mar das Coisas</strong>, reafirmando o compromisso com o acesso livre ao conhecimento, a defesa dos bens comuns hídricos e o fortalecimento de tecnologias apropriadas ao litoral.</p>
            <div class="callout-box accent">
                <strong>Acervo e Acesso Aberto:</strong>
                <ul>
                    <li>🎥 <strong>Internet Archive:</strong> <a href="https://archive.org/details/mar-das-coisas-2026-ubatuba-doutor-f" target="_blank" rel="noopener">17 vídeos e gravações originais em domínio público</a>.</li>
                    <li>📖 <strong>fonte.wiki:</strong> <a href="https://fonte.wiki/projetos/mardascoisas" target="_blank" rel="noopener">Documentação textual completa e transcrições</a>.</li>
                    <li>🌐 <strong>Código e Mapas:</strong> Repositório estático disponível para GitHub Pages sob CC BY-SA 4.0.</li>
                </ul>
            </div>`
        }
    ]
};
