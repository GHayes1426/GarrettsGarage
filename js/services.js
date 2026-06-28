            function getJob(jobId) {
                return jobs.find((j) => j.jobId === jobId);
            }

            function getReviewByJob(jobId) {
                return reviews.find((r) => r.jobId === jobId);
            }

            function getReview(reviewId) {
                return reviews.find((r) => r.reviewId === reviewId);
            }

            const services = [
                {
                    cat: "maintenance",
                    icon: "🛢️",
                    name: "Oil Change & Filter",
                    desc: "Full synthetic or conventional oil change with filter replacement and multi-point inspection.",
                    price: "From $100",
                    priceNote: "/visit"
                },
                {
                    cat: "maintenance",
                    icon: "🔍",
                    name: "Multi-Point Inspection",
                    desc: "Comprehensive inspection covering brakes, fluids, belts, hoses, and more.",
                    price: "Free",
                    priceNote: " with service"
                },
                {
                    cat: "engine",
                    icon: "🔧",
                    name: "Engine Diagnostics",
                    desc: "Computer scan plus hands-on diagnosis to identify the root cause of check engine lights or unusual symptoms.",
                    price: "From $100",
                    priceNote: "/diagnostic"
                },
                {
                    cat: "engine",
                    icon: "⚡",
                    name: "Timing Belt Package",
                    desc: "Factory-spec timing belt replacement with tensioners.",
                    price: "From $1300",
                    priceNote: "/job"
                },
                {
                    cat: "engine",
                    icon: "⛓️",
                    name: "Timing Chain Package",
                    desc: "Factory-spec chain replacement with tensioners. VTC Actuator",
                    price: "From $1400",
                    priceNote: "/job"
                },
                {
                    cat: "engine",
                    icon: "🌀",
                    name: "Head Gasket Repair",
                    desc: "Full head gasket replacement with warpage inspection. Guaranteed work.",
                    price: "From $2500",
                    priceNote: "/without ARP Head Studs"
                },
                {
                    cat: "brakes",
                    icon: "🛑",
                    name: "Brake Pad & Rotor Replacement",
                    desc: "OEM-quality pads and rotors for peak stopping power with hardware kit and brake dust check.",
                    price: "From $350",
                    priceNote: "/axle"
                },
                {
                    cat: "brakes",
                    icon: "🔩",
                    name: "Suspension & Struts",
                    desc: "Shocks, struts, control arms, handle vibration and uneven wear before it gets worse.",
                    price: "From $900",
                    priceNote: "/corner"
                },
                {
                    cat: "transmission",
                    icon: "⚙️",
                    name: "Transmission Service",
                    desc: "Fluid drain and fill. CVT, ATF, MTF",
                    price: "From $170",
                    priceNote: "/service"
                },
                {
                    cat: "ac",
                    icon: "❄️",
                    name: "R-134a A/C Services",
                    desc: "Refrigerant recharge with leak inspection to get your cabin cool again.",
                    price: "From $180",
                    priceNote: "/must pass full AC System Vacuum Test"
                }
            ];

            // ── RENDER SERVICES ──
            function renderServices(filter = "all") {
                const grid = document.getElementById("servicesGrid");
                const filtered = filter === "all" ? services : services.filter((s) => s.cat === filter);
                grid.innerHTML = filtered
                    .map(
                        (s) => `
    <div class="service-card" data-cat="${s.cat}">
      <div class="service-card-body">
        <div class="service-icon-wrap">${s.icon}</div>
        <div class="service-cat">${s.cat.toUpperCase()}</div>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <div class="service-price">${s.price} <span>${s.priceNote}</span></div>
      </div>
    </div>
  `
                    )
                    .join("");
            }

            function updateNavOffsets() {
                const nav = document.querySelector("nav");
                const menu = document.getElementById("mobileMenu");
                const bookBtn = document.querySelector(".floating-book-btn");

                const navHeight = nav.getBoundingClientRect().height;

                document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);

                const menuHeight = menu.classList.contains("open") ? menu.scrollHeight : 0;

                bookBtn.style.top = `${navHeight + menuHeight}px`;
            }

            window.addEventListener("load", updateNavOffsets);
            window.addEventListener("resize", updateNavOffsets);

            // ── FILTER LOGIC ──
            document.getElementById("filterBar").addEventListener("click", (e) => {
                if (e.target.classList.contains("filter-btn")) {
                    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
                    e.target.classList.add("active");
                    renderServices(e.target.dataset.filter);
                }
            });

            document.querySelectorAll("#mobileMenu a").forEach((link) => {
                link.addEventListener("click", () => {
                    const menu = document.getElementById("mobileMenu");
                    const burger = document.getElementById("burger");

                    menu.classList.remove("open");
                    burger.classList.remove("open");

                    updateNavOffsets();
                });
            });

            function toggleMenu() {
        const menu = document.getElementById("mobileMenu");
        const burger = document.getElementById("burger");
        const bookBtn = document.querySelector(".floating-book-btn");
        const nav = document.querySelector("nav");

        menu.classList.toggle("open");
        burger.classList.toggle("open");

        const navHeight = nav.offsetHeight;

        if (menu.classList.contains("open")) {
          bookBtn.style.top = `${navHeight + 48}px`;
        } else {
          bookBtn.style.top = `${navHeight}px`;
        }
      }

            renderServices();
