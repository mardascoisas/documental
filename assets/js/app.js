/* ==========================================================================
   MAR DAS COISAS · SCROLLYTELLING ENGINE
   MapLibre GL JS + Scrollama
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // Configure marked for friendly linebreaks and GFM if present
    if (typeof marked !== "undefined" && marked.setOptions) {
        marked.setOptions({
            gfm: true,
            breaks: true
        });
    }

    const scroller = scrollama();
    let map = null;
    let markers = [];
    let currentChapterIndex = 0;
    let isSatellite = config.defaultBasemap === "satellite";

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
    setupCarouselArrows();

    // 3. Load GeoJSON data & layers once map is loaded
    map.on("load", function () {
        if (isSatellite) {
            enableSatelliteMode();
        }
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
                            
                            // Check for linked chapter (by chapter, chapterId, targetChapter, or id)
                            const targetChapterId = feature.properties.chapter || feature.properties.chapterId || feature.properties.targetChapter || feature.properties.id;
                            const linkedChapter = config.chapters.find(c => c.id === targetChapterId);

                            let chapterLinkHtml = "";
                            if (linkedChapter) {
                                const chapterName = linkedChapter.title || linkedChapter.badge || `Capítulo ${config.chapters.indexOf(linkedChapter) + 1}`;
                                chapterLinkHtml = `
                                    <div class="popup-chapter-action">
                                        <button type="button" class="btn-popup-chapter" onclick="window.scrollToChapterId('${targetChapterId}')">
                                            <span>📖 Ir para o relato</span>
                                            <span class="btn-popup-chapter-name">${chapterName} &rarr;</span>
                                        </button>
                                    </div>
                                `;
                            }

                            let parsedDesc = feature.properties.description || "";
                            if (typeof marked !== "undefined" && marked.parseInline && parsedDesc) {
                                parsedDesc = marked.parseInline(parsedDesc);
                            }
                            const descHtml = parsedDesc ? `<div class="popup-desc">${parsedDesc}</div>` : "";
                            const catBadge = feature.properties.category ? `<span class="popup-category-badge">${feature.properties.category}</span>` : "";

                            const popupHtml = `
                                <div class="map-popup-card">
                                    ${catBadge}
                                    <h4 class="popup-title">${feature.properties.title || "Ponto de Interesse"}</h4>
                                    ${descHtml}
                                    ${chapterLinkHtml}
                                </div>
                            `;

                            const popup = new maplibregl.Popup({ offset: 14, maxWidth: "340px" }).setHTML(popupHtml);

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
        // Sync header brand title with config.title
        const brandTextEl = document.querySelector(".top-nav .brand-text");
        if (brandTextEl && config.title) {
            brandTextEl.textContent = config.title;
        }

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

            // Text description (supports Markdown or existing HTML)
            let formattedDescription = chapter.description || "";
            if (typeof marked !== "undefined" && typeof marked.parse === "function") {
                formattedDescription = marked.parse(formattedDescription);
            }
            cardContent += `<div class="card-text">${formattedDescription}</div>`;

            cardContent += `</div>`;
            stepDiv.innerHTML = cardContent;
            featuresContainer.appendChild(stepDiv);
        });

        // Add Footer
        const footerDiv = document.createElement("div");
        footerDiv.className = "story-footer";

        let footerLinks = [];
        if (config.archiveUrl && config.archiveUrl.trim()) {
            footerLinks.push(`<a href="${config.archiveUrl.trim()}" target="_blank" rel="noopener" class="footer-btn">🎬 Internet Archive</a>`);
        }
        if (config.wikiUrl && config.wikiUrl.trim()) {
            footerLinks.push(`<a href="${config.wikiUrl.trim()}" target="_blank" rel="noopener" class="footer-btn">📖 Documentação Wiki</a>`);
        }

        const linksHtml = footerLinks.length > 0
            ? `<div class="footer-actions">${footerLinks.join("")}</div>`
            : "";

        let footerText = config.footer || "";
        if (typeof marked !== "undefined" && marked.parseInline && footerText) {
            footerText = marked.parseInline(footerText);
        }

        footerDiv.innerHTML = `
            <div class="footer-card">
                <div class="footer-brand">
                    <strong class="footer-title">${config.title}</strong>
                    ${config.date ? `<span class="footer-date"> · ${config.date}</span>` : ""}
                </div>
                ${config.byline ? `<p class="footer-byline">${config.byline}</p>` : ""}
                ${footerText ? `<div class="footer-text">${footerText}</div>` : ""}
                ${linksHtml}
            </div>
        `;
        featuresContainer.appendChild(footerDiv);
    }

    function navigateToChapter(index) {
        if (index < 0 || index >= config.chapters.length) return;
        const chapter = config.chapters[index];
        if (!chapter) return;
        const targetStep = document.getElementById(chapter.id);
        if (targetStep) {
            targetStep.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    window.scrollToChapterId = function (chapterId) {
        if (!chapterId) return;
        const targetStep = document.getElementById(chapterId);
        if (targetStep) {
            targetStep.scrollIntoView({ behavior: "smooth", block: "center" });
            // Close any open popups so they don't block the view
            markers.forEach(m => {
                if (m.marker && m.marker.getPopup() && m.marker.getPopup().isOpen()) {
                    m.marker.getPopup().remove();
                }
            });
        }
    };

    // 6. Build Navigation Dots (sidebar)
    function buildNavDots() {
        const navContainer = document.getElementById("chapter-nav");
        if (!navContainer) return;

        navContainer.innerHTML = "";
        config.chapters.forEach((chapter, idx) => {
            const dot = document.createElement("div");
            dot.className = `nav-dot ${idx === 0 ? "active" : ""}`;
            dot.setAttribute("data-target-index", idx);
            dot.innerHTML = `<span class="tooltip">${chapter.title || chapter.badge || `Capítulo ${idx + 1}`}</span>`;

            dot.addEventListener("click", function () {
                navigateToChapter(idx);
            });

            navContainer.appendChild(dot);
        });
    }

    // 6b. Setup Carousel Navigation Arrows (Instagram-like)
    function setupCarouselArrows() {
        const prevBtn = document.getElementById("carousel-prev");
        const nextBtn = document.getElementById("carousel-next");
        if (!prevBtn || !nextBtn) return;

        prevBtn.addEventListener("click", function () {
            if (currentChapterIndex > 0) {
                navigateToChapter(currentChapterIndex - 1);
            }
        });

        nextBtn.addEventListener("click", function () {
            if (currentChapterIndex < config.chapters.length - 1) {
                navigateToChapter(currentChapterIndex + 1);
            }
        });

        // Keyboard Navigation (ArrowLeft & ArrowRight)
        window.addEventListener("keydown", function (e) {
            if (document.activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
            const modal = document.getElementById("lightbox-modal");
            if (modal && modal.classList.contains("open")) return;

            if (e.key === "ArrowLeft") {
                if (currentChapterIndex > 0) {
                    e.preventDefault();
                    navigateToChapter(currentChapterIndex - 1);
                }
            } else if (e.key === "ArrowRight") {
                if (currentChapterIndex < config.chapters.length - 1) {
                    e.preventDefault();
                    navigateToChapter(currentChapterIndex + 1);
                }
            }
        });

        updateCarouselArrows();
    }

    function updateCarouselArrows() {
        const prevBtn = document.getElementById("carousel-prev");
        const nextBtn = document.getElementById("carousel-next");
        if (!prevBtn || !nextBtn) return;

        const totalChapters = config.chapters.length;

        if (currentChapterIndex <= 0) {
            prevBtn.classList.add("disabled");
            prevBtn.setAttribute("disabled", "true");
        } else {
            prevBtn.classList.remove("disabled");
            prevBtn.removeAttribute("disabled");
            const prevChapter = config.chapters[currentChapterIndex - 1];
            if (prevChapter) {
                prevBtn.title = `Capítulo anterior: ${prevChapter.title || prevChapter.badge || ""}`;
            }
        }

        if (currentChapterIndex >= totalChapters - 1) {
            nextBtn.classList.add("disabled");
            nextBtn.setAttribute("disabled", "true");
        } else {
            nextBtn.classList.remove("disabled");
            nextBtn.removeAttribute("disabled");
            const nextChapter = config.chapters[currentChapterIndex + 1];
            if (nextChapter) {
                nextBtn.title = `Próximo capítulo: ${nextChapter.title || nextChapter.badge || ""}`;
            }
        }
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

                // Update Carousel Arrows
                updateCarouselArrows();

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

                // Highlight corresponding map marker or control chapter visibility
                const chapterShowMarkers = chapter.showMarkers !== false;
                markers.forEach(m => {
                    if (!chapterShowMarkers) {
                        m.el.style.display = "none";
                    } else {
                        m.el.style.display = "";
                        if (m.id === chapter.id) {
                            m.el.classList.add("active");
                        } else {
                            m.el.classList.remove("active");
                        }
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

    // 8. Basemap Satellite Helpers & Optional Website Toggle
    function enableSatelliteMode() {
        if (!map) return;
        if (!map.getSource("esri-satellite")) {
            map.addSource("esri-satellite", {
                type: "raster",
                tiles: [config.satelliteStyle || "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                tileSize: 256
            });
        }
        if (!map.getLayer("esri-satellite-layer")) {
            const beforeId = map.getLayer("river-tracks") ? "river-tracks" : undefined;
            map.addLayer({
                id: "esri-satellite-layer",
                type: "raster",
                source: "esri-satellite"
            }, beforeId);
        }
    }

    function disableSatelliteMode() {
        if (map && map.getLayer("esri-satellite-layer")) {
            map.removeLayer("esri-satellite-layer");
        }
    }

    const toggleMapBtn = document.getElementById("btn-toggle-map");
    if (toggleMapBtn) {
        if (config.showMapToggle === true) {
            toggleMapBtn.style.display = "inline-flex";
            toggleMapBtn.innerHTML = isSatellite ? `🛰️ Satélite: Ativo` : `🗺️ Mapa: Vetor`;
            if (isSatellite) toggleMapBtn.classList.add("active");

            toggleMapBtn.addEventListener("click", function () {
                isSatellite = !isSatellite;
                if (isSatellite) {
                    toggleMapBtn.innerHTML = `🛰️ Satélite: Ativo`;
                    toggleMapBtn.classList.add("active");
                    enableSatelliteMode();
                } else {
                    toggleMapBtn.innerHTML = `🗺️ Mapa: Vetor`;
                    toggleMapBtn.classList.remove("active");
                    disableSatelliteMode();
                }
            });
        } else {
            toggleMapBtn.style.display = "none";
        }
    }

    // 9. Lightbox for Images & Videos
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const modalVideo = document.getElementById("lightbox-video");
    const modalCaption = document.getElementById("lightbox-caption");
    const modalClose = document.getElementById("lightbox-close");

    function closeModal() {
        if (!modal) return;
        modal.classList.remove("open");
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = "";
            modalVideo.style.display = "none";
        }
        if (modalImg) {
            modalImg.src = "";
            modalImg.style.display = "block";
        }
    }

    document.addEventListener("click", function (e) {
        // A) Video link clicked (e.g. [![Thumb](img)](video.mp4) or [Watch Video](video.mp4))
        const videoLink = e.target.closest('a[href$=".mp4"], a[href$=".webm"], a[href$=".ogv"], a[href*=".ia.mp4"], a[href*="archive.org/download/"][href*=".mp4"], a[data-lightbox-video]');
        if (videoLink) {
            e.preventDefault();
            const videoUrl = videoLink.getAttribute("data-lightbox-video") || videoLink.getAttribute("href");
            const caption = videoLink.getAttribute("title") || 
                            (videoLink.querySelector("img") && (videoLink.querySelector("img").getAttribute("alt") || videoLink.querySelector("img").getAttribute("title"))) || 
                            videoLink.textContent.trim();

            if (modalImg) modalImg.style.display = "none";
            if (modalVideo) {
                modalVideo.style.display = "block";
                modalVideo.src = videoUrl;
                modalVideo.play().catch(() => {});
            }
            if (modalCaption) modalCaption.textContent = caption || "";
            if (modal) modal.classList.add("open");
            return;
        }

        // B) Image clicked
        if (e.target.classList.contains("zoomable-img") || (e.target.tagName === "IMG" && (e.target.closest(".notebook-gallery") || (e.target.closest(".card-text") && !e.target.closest("a"))))) {
            e.preventDefault();
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.src = "";
                modalVideo.style.display = "none";
            }
            if (modalImg) {
                modalImg.style.display = "block";
                modalImg.src = e.target.src;
            }
            if (modalCaption) modalCaption.textContent = e.target.getAttribute("title") || e.target.getAttribute("alt") || "";
            if (modal) modal.classList.add("open");
        }
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal && modal.classList.contains("open")) {
            closeModal();
        }
    });
});
