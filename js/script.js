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
    /* ===== Form validation helpers ===== */
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phonePattern = /^(\+27|0)[1-9]\d{8}$/;

    function setError(input, message) {
        const err = document.getElementById(input.id + "-error");
        if (err) err.textContent = message;
        input.classList.toggle("invalid", message !== "");
        return message === "";
    }
    function validateText(input, label, min) {
        const v = input.value.trim();
        if (v === "") return setError(input, label + " is required.");
        if (v.length < min) return setError(input, label + " must be at least " + min + " characters.");
        return setError(input, "");
    }
    function validateEmail(input) {
        const v = input.value.trim();
        if (v === "") return setError(input, "Email is required.");
        if (!emailPattern.test(v)) return setError(input, "Enter a valid email, e.g. name@example.com.");
        return setError(input, "");
    }
    function validatePhone(input) {
        const v = input.value.replace(/\s+/g, "");
        if (v === "") return setError(input, "Phone number is required.");
        if (!phonePattern.test(v)) return setError(input, "Enter a valid SA number, e.g. 0821234567 or +27821234567.");
        return setError(input, "");
    }
    function validateSelect(input, label) {
        if (input.value === "") return setError(input, "Please select " + label + ".");
        return setError(input, "");
    }
    function validateDate(input) {
        if (input.value === "") return setError(input, "Please choose a start date.");
        if (input.value < input.min) return setError(input, "Date cannot be in the past.");
        return setError(input, "");
    }
    function showResponse(box, title, text) {
        box.innerHTML = "";
        const h = document.createElement("h3");
        h.textContent = title;
        const p = document.createElement("p");
        p.textContent = text;
        box.append(h, p);
        box.hidden = false;
        box.scrollIntoView({ behavior: "smooth" });
    }

    /* ===== Enquiry form ===== */
    const enquiryForm = document.getElementById("enquiry-form");
    if (enquiryForm) {
        const nameEl = document.getElementById("name");
        const emailEl = document.getElementById("email");
        const phoneEl = document.getElementById("phone");
        const typeEl = document.getElementById("type");
        const dateEl = document.getElementById("start-date");
        const messageEl = document.getElementById("message");
        const box = document.getElementById("enquiry-response");
        dateEl.min = new Date().toLocaleDateString("en-CA");

        const responses = {
            volunteer: "Volunteering is free. Shifts are available Saturdays 09:00-13:00 and Sundays 10:00-14:00. Our volunteer coordinator will contact you within 3 working days to arrange an orientation.",
            foster: "Fostering costs you nothing as we cover food and vet bills. We currently have 4 foster spaces available and will arrange a home visit within 5 working days.",
            sponsor: "Sponsorship starts at R500/month (Bronze: feeds 5 animals), R1,500/month (Silver: vaccinations) or R3,000/month (Gold: sterilisations plus your logo on our website). 3 Gold spots are currently available."
        };

        const fields = [
            [nameEl, () => validateText(nameEl, "Name", 2)],
            [emailEl, () => validateEmail(emailEl)],
            [phoneEl, () => validatePhone(phoneEl)],
            [typeEl, () => validateSelect(typeEl, "an enquiry type")],
            [dateEl, () => validateDate(dateEl)],
            [messageEl, () => validateText(messageEl, "Message", 10)]
        ];
        fields.forEach(([el, check]) => el.addEventListener("blur", check));

        enquiryForm.addEventListener("submit", e => {
            e.preventDefault();
            const valid = fields.map(([, check]) => check()).every(Boolean);
            if (!valid) return;

            const title = "Thank you, " + nameEl.value.trim() + "!";
            const text = responses[typeEl.value] + " We have noted your preferred start date of " + dateEl.value + ".";
            const data = Object.fromEntries(new FormData(enquiryForm));

            /* AJAX submit to a free public test API (nothing is stored) */
            fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
                .then(res => { if (!res.ok) throw new Error("Request failed"); return res.json(); })
                .then(() => { showResponse(box, title, text); enquiryForm.reset(); })
                .catch(() => showResponse(box, "Something went wrong", "We could not send your enquiry right now. Please try again or contact us directly."));
        });
    }
}