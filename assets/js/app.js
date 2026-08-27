/* ==========================================================================
   MAR DAS COISAS · SCROLLYTELLING ENGINE
   MapLibre GL JS + Scrollama
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const scroller = scrollama();
    let map = null;
    let markers = [];
    let currentChapterIndex = 0;
    let isSatellite = false;

    // 1. Initialize Map
    const initialCenter = config.chapters[0].location.center;
    const initialZoom = config.chapters[0].location.zoom;
    const initialPitch = config.chapters[0].location.pitch || 0;
    const initialBearing = config.chapters[0].location.bearing || 0;

    const mapOptions = {
        container: "map",
        style: config.style,
        center: initialCenter,
        zoom: initialZoom,
        pitch: initialPitch,
        bearing: initialBearing,
        interactive: true,
        attributionControl: false
    };

    map = new maplibregl.Map(mapOptions);

    // Add navigation controls (zoom/compass)
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

    // 2. Build DOM elements for story cards & navigation dots
    buildStoryDOM();
    buildNavDots();

    // 3. Load GeoJSON data & layers once map is loaded
    map.on("load", function () {
        fetch("assets/data/locations.geojson?t=" + Date.now())
            .then(res => res.json())
            .then(geojson => {
                // Add GeoJSON source
                map.addSource("locations-source", {
                    type: "geojson",
                    data: geojson
                });

                // Add River expedition line
                map.addLayer({
                    id: "river-tracks",
                    type: "line",
                    source: "locations-source",
                    filter: ["==", "$type", "LineString"],
                    layout: {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    paint: {
                        "line-color": "#38bdf8",
                        "line-width": 4,
                        "line-dasharray": [2, 2],
                        "line-opacity": 0.85
                    }
                });

                // Add Markers for Point features
                if (config.showMarkers) {
                    geojson.features.forEach(feature => {
                        if (feature.geometry.type === "Point") {
                            const el = document.createElement("div");
                            el.className = "map-marker";
                            el.setAttribute("data-id", feature.properties.id || "");
                            
                            const popup = new maplibregl.Popup({ offset: 12 }).setHTML(
                                `<strong>${feature.properties.title}</strong><br><small>${feature.properties.description || ""}</small>`
                            );

                            const marker = new maplibregl.Marker({ element: el })
                                .setLngLat(feature.geometry.coordinates)
                                .setPopup(popup)
                                .addTo(map);

                            markers.push({ id: feature.properties.id, marker: marker, el: el });
                        }
                    });
                }
            })
            .catch(err => console.log("GeoJSON load note:", err));

        // 4. Initialize Scrollama Scrollytelling
        initScrollama();
    });

    // 5. Function to Build Story HTML dynamically from config.js
    function buildStoryDOM() {
        const featuresContainer = document.getElementById("features");
        if (!featuresContainer) return;

        featuresContainer.innerHTML = "";

        config.chapters.forEach((chapter, index) => {
            const stepDiv = document.createElement("div");
            stepDiv.id = chapter.id;
            stepDiv.className = `step ${chapter.alignment || "left"}`;
            stepDiv.setAttribute("data-index", index);

            let cardContent = "";
            const isHero = index === 0;

            cardContent += `<div class="story-card ${isHero ? "hero-card" : ""}">`;

            if (isHero) {
                cardContent += `<div class="hero-badge"><span class="brand-dot"></span> ${chapter.badge || "Mar das Coisas"}</div>`;
                cardContent += `<h1 class="story-title">${chapter.title}</h1>`;
                if (config.subtitle) cardContent += `<div class="story-subtitle">${config.subtitle}</div>`;
                if (config.byline) cardContent += `<div class="story-byline">${config.byline}</div>`;
            } else {
                if (chapter.badge) cardContent += `<span class="chapter-badge">${chapter.badge}</span>`;
                cardContent += `<h2 class="chapter-title">${chapter.title}</h2>`;
            }

            // Image section
            if (chapter.image) {
                cardContent += `
                    <div class="card-media">
                        <img src="${chapter.image}" alt="${chapter.title}" class="zoomable-img" loading="lazy" />
                        ${chapter.imageCaption ? `<div class="media-caption">${chapter.imageCaption}</div>` : ""}
                    </div>
                `;
            }

            // Text description
            cardContent += `<div class="card-text">${chapter.description}</div>`;

            cardContent += `</div>`;
            stepDiv.innerHTML = cardContent;
            featuresContainer.appendChild(stepDiv);
        });

        // Add Footer
        const footerDiv = document.createElement("div");
        footerDiv.className = "story-footer";
        footerDiv.innerHTML = `
            <p><strong>${config.title}</strong> · ${config.date}</p>
            <p>${config.footer}</p>
            <div style="margin-top: 16px;">
                <a href="${config.archiveUrl}" target="_blank" rel="noopener" style="color: var(--accent); margin: 0 10px;">Coleção Internet Archive</a> |
                <a href="${config.wikiUrl}" target="_blank" rel="noopener" style="color: var(--accent); margin: 0 10px;">Páginas no fonte.wiki</a>
            </div>
        `;
        featuresContainer.appendChild(footerDiv);
    }

    // 6. Build Navigation Dots (sidebar)
    function buildNavDots() {
        const navContainer = document.getElementById("chapter-nav");
        if (!navContainer) return;

        navContainer.innerHTML = "";
        config.chapters.forEach((chapter, idx) => {
            const dot = document.createElement("div");
            dot.className = `nav-dot ${idx === 0 ? "active" : ""}`;
            dot.setAttribute("data-target-index", idx);
            dot.innerHTML = `<span class="tooltip">${chapter.title}</span>`;

            dot.addEventListener("click", function () {
                const targetStep = document.getElementById(chapter.id);
                if (targetStep) {
                    targetStep.scrollIntoView({ behavior: "smooth" });
                }
            });

            navContainer.appendChild(dot);
        });
    }

    // 7. Initialize Scrollama
    function initScrollama() {
        scroller
            .setup({
                step: ".step",
                offset: 0.5,
                progress: true
            })
            .onStepEnter(response => {
                const stepElement = response.element;
                const chapterIndex = parseInt(stepElement.getAttribute("data-index"), 10);
                const chapter = config.chapters[chapterIndex];

                if (!chapter) return;
                currentChapterIndex = chapterIndex;

                // Update active CSS classes
                document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
                stepElement.classList.add("active");

                // Update Nav Dots
                document.querySelectorAll(".nav-dot").forEach((dot, idx) => {
                    dot.classList.toggle("active", idx === chapterIndex);
                });

                // Fly Map to Chapter Location
                if (map && chapter.location) {
                    map.flyTo({
                        center: chapter.location.center,
                        zoom: chapter.location.zoom,
                        pitch: chapter.location.pitch || 0,
                        bearing: chapter.location.bearing || 0,
                        speed: 0.8,
                        curve: 1.2,
                        essential: true
                    });
                }

                // Highlight corresponding map marker
                markers.forEach(m => {
                    if (m.id === chapter.id) {
                        m.el.classList.add("active");
                    } else {
                        m.el.classList.remove("active");
                    }
                });
            })
            .onStepProgress(response => {
                // Global progress bar calculation
                const totalSteps = config.chapters.length;
                const progress = ((response.index + response.progress) / totalSteps) * 100;
                const progressBar = document.getElementById("progress-bar");
                if (progressBar) {
                    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
                }
            });

        window.addEventListener("resize", scroller.resize);
    }

    // 8. Basemap Toggle (Vector vs Satellite)
    const toggleMapBtn = document.getElementById("btn-toggle-map");
    if (toggleMapBtn) {
        toggleMapBtn.addEventListener("click", function () {
            isSatellite = !isSatellite;
            if (isSatellite) {
                toggleMapBtn.innerHTML = `🛰️ Satélite: Ativo`;
                toggleMapBtn.classList.add("active");
                
                // Add ESRI Satellite raster source if not exists
                if (!map.getSource("esri-satellite")) {
                    map.addSource("esri-satellite", {
                        type: "raster",
                        tiles: [config.satelliteStyle],
                        tileSize: 256
                    });
                }
                if (!map.getLayer("esri-satellite-layer")) {
                    map.addLayer({
                        id: "esri-satellite-layer",
                        type: "raster",
                        source: "esri-satellite"
                    }, "river-tracks");
                }
            } else {
                toggleMapBtn.innerHTML = `🗺️ Mapa: Vetor`;
                toggleMapBtn.classList.remove("active");
                if (map.getLayer("esri-satellite-layer")) {
                    map.removeLayer("esri-satellite-layer");
                }
            }
        });
    }

    // 9. Lightbox for Images
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const modalCaption = document.getElementById("lightbox-caption");
    const modalClose = document.getElementById("lightbox-close");

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("zoomable-img") || (e.target.tagName === "IMG" && e.target.closest(".notebook-gallery"))) {
            e.preventDefault();
            modalImg.src = e.target.src;
            modalCaption.textContent = e.target.getAttribute("title") || e.target.getAttribute("alt") || "";
            modal.classList.add("open");
        }
    });

    if (modalClose) {
        modalClose.addEventListener("click", function () {
            modal.classList.remove("open");
        });
    }

    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                modal.classList.remove("open");
            }
        });
    }
});
