
            const managedData = getManagedData();
            const publicServices = managedData.services;

            function getJob(jobId) {
                return managedData.jobs.find((j) => j.jobId === jobId);
            }

            function getReviewByJob(jobId) {
                return managedData.reviews.find((r) => r.jobId === jobId);
            }

            function getReview(reviewId) {
                return managedData.reviews.find((r) => r.reviewId === reviewId);
            }

            

            // ── RENDER SERVICES ──
            function renderServices(filter = "all") {
                const grid = document.getElementById("servicesGrid");
                const filtered = filter === "all" ? publicServices : publicServices.filter((s) => s.cat === filter);
                grid.innerHTML = filtered
                    .map(
                        (s) => `
    <div class="service-card" data-cat="${s.cat}" onclick="openServiceModal(${publicServices.indexOf(s)})">
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

            function openServiceModal(index) {
                const service = publicServices[index];
                if (!service) return;

                document.getElementById("serviceModalTitle").textContent = service.name;
                document.getElementById("serviceModalBody").innerHTML = [
                    `<div class="modal-job-tag">${service.cat.toUpperCase()}</div>`,
                    `<div class="service-icon-wrap" style="margin-bottom:16px">${service.icon}</div>`,
                    `<p style="color: var(--text); font-size: 17px; line-height: 1.7; margin-bottom: 20px;">${service.desc}</p>`,
                    `<div class="modal-details">`,
                    `<div class="modal-detail"><label>Price</label><strong>${service.price}</strong></div>`,
                    `<div class="modal-detail"><label>Note</label><strong>${service.priceNote || "Ask for details"}</strong></div>`,
                    `</div>`,
                    `<a href="index.html#schedule" class="modal-job-link">Schedule This Service →</a>`
                ].join("");
                document.getElementById("serviceModal").classList.add("open");
                document.body.style.overflow = "hidden";
            }

            function closeServiceModal() {
                document.getElementById("serviceModal").classList.remove("open");
                document.body.style.overflow = "";
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
