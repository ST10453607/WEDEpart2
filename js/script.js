/* ===== Animal data (dynamic content) ===== */
const animals = [
    { name: "Rocky", type: "dog", age: 2, sex: "Male", trait: "Playful and loyal", img: "images/rocky-brown-dog.jpg", alt: "Rocky, a two-year-old brown dog waiting for adoption" },
    { name: "Luna", type: "cat", age: 1, sex: "Female", trait: "Calm and affectionate", img: "images/luna-grey-cat.jpg", alt: "Luna, a one-year-old grey cat resting" },
    { name: "Buddy", type: "dog", age: 4, sex: "Male", trait: "Great with kids", img: "images/buddy-golden-dog.jpg", alt: "Buddy, a four-year-old golden dog smiling" },
    { name: "Milo", type: "cat", age: 3, sex: "Male", trait: "Independent and curious", img: "images/milo-ginger-cat.jpg", alt: "Milo, a three-year-old ginger cat looking curious" }
];

/* ===== Gallery: render, search, sort, filter, lightbox ===== */
const gallery = document.getElementById("animal-gallery");
if (gallery) {
    let currentFilter = "all";
    const searchBox = document.getElementById("search");
    const sortBox = document.getElementById("sort");
    const countText = document.getElementById("results-count");

    function renderAnimals() {
        const term = searchBox.value.trim().toLowerCase();
        const list = animals.filter(a =>
            (currentFilter === "all" || a.type === currentFilter) &&
            (a.name + " " + a.trait + " " + a.type).toLowerCase().includes(term)
        );
        list.sort((a, b) => sortBox.value === "age" ? a.age - b.age : a.name.localeCompare(b.name));

        gallery.innerHTML = "";
        list.forEach(a => {
            const card = document.createElement("div");
            card.className = "animal-card";
            card.innerHTML = `
                <img src="${a.img}" alt="${a.alt}" loading="lazy" data-caption="${a.name} - ${a.trait}">
                <h3>${a.name}</h3>
                <p>${a.age} yr(s) &middot; ${a.sex} &middot; ${a.trait}</p>
                <a href="enquiry.html" class="btn">Enquire about ${a.name}</a>`;
            gallery.appendChild(card);
        });
        countText.textContent = list.length + " animal(s) found";
        if (list.length === 0) gallery.innerHTML = "<p>No animals match your search.</p>";
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.remove("active");
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderAnimals();
        });
    });
    searchBox.addEventListener("input", renderAnimals);
    sortBox.addEventListener("change", renderAnimals);
    renderAnimals();

    /* Lightbox */
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");

    gallery.addEventListener("click", e => {
        if (e.target.tagName === "IMG") {
            lightboxImg.src = e.target.src;
            lightboxImg.alt = e.target.alt;
            lightboxCaption.textContent = e.target.dataset.caption;
            lightbox.hidden = false;
        }
    });
    const closeLightbox = () => { lightbox.hidden = true; };
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

    /* ===== Accordion ===== */
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            const body = header.nextElementSibling;
            const isOpen = header.getAttribute("aria-expanded") === "true";
            header.setAttribute("aria-expanded", String(!isOpen));
            body.classList.toggle("open", !isOpen);
        });
    });

    /* ===== Interactive map (Leaflet) ===== */
    const mapEl = document.getElementById("map");
    if (mapEl && typeof L !== "undefined") {
        const map = L.map("map").setView([-33.91, 18.52], 10);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        const locations = [
            { name: "Main Shelter", address: "12 Rescue Road, Cape Town", coords: [-33.9249, 18.4241] },
            { name: "Adoption Centre", address: "45 Companion Street, Bellville", coords: [-33.9000, 18.6290] }
        ];
        locations.forEach(loc => {
            L.marker(loc.coords).addTo(map).bindPopup("<strong>" + loc.name + "</strong><br>" + loc.address);
        });
        map.fitBounds(locations.map(l => l.coords), { padding: [40, 40] });
    }
}