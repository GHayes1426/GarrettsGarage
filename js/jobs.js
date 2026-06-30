            const managedData = getManagedData();
            const publicJobs = managedData.jobs;
            const publicReviews = managedData.reviews;

            function getJob(jobId) {
                return publicJobs.find((j) => j.jobId === jobId);
            }

            function getReviewByJob(jobId) {
                return publicReviews.find((r) => r.jobId === jobId);
            }

            function getReview(reviewId) {
                return publicReviews.find((r) => r.reviewId === reviewId);
            }

            function getReviewVehicle(review) {
                const job = getJob(review.jobId);
                return review.vehicle || (job ? job.vehicle : "");
            }

            function getReviewJobTitle(review) {
                const job = getJob(review.jobId);
                return review.jobTitle || (job ? job.title : "");
            }

            // ── RENDER JOBS ──
            let currentFilter = "all";

            function renderJobs() {
                const search = document.getElementById("jobSearch").value.toLowerCase().trim();

                let filtered = publicJobs;

                if (currentFilter !== "all") {
                    filtered = filtered.filter((job) => job.category === currentFilter);
                }

                if (search) {
                    filtered = filtered.filter((job) =>
                        (job.title + " " + job.vehicle + " " + job.category + " " + job.description)
                            .toLowerCase()
                            .includes(search)
                    );
                }

                document.getElementById("jobsGrid").innerHTML = filtered
                    .map((job) => {
                        const review = getReviewByJob(job.jobId);

                        return `
                <a class="job-card"
                   onclick="openJobModal(${job.jobId}); return false;"
                   href="#">

                    <div class="job-img">
          ${getPrimaryJobImage(job) ? `<img class="job-card-photo" src="${getPrimaryJobImage(job)}" alt="${job.title}" />` : ``}
          <div class="job-img-placeholder">
                            <div class="car-icon">🚗</div>
                            <div>${job.vehicle}</div>
                        </div>

                        <div class="job-overlay"></div>

                        <div class="job-tag">
                            ${job.category}
                        </div>
                    </div>

                    <div class="job-body">

                        <h3>${job.title}</h3>

                        <div class="job-meta">
                            <span class="job-vehicle">${job.vehicle}</span>
                            <span class="job-meta-dot">•</span>
                            <span>${job.hours}</span>
                        </div>

                        ${
                            review
                                ? `<button class="job-review-link" onclick="event.stopPropagation(); location.href='reviews.html#review-${review.reviewId}'; return false;">View Review →</button>`
                                : `<div class="job-review-link" style="opacity:.5">No Review Yet</div>`
                        }

                    </div>

                </a>
            `;
                    })
                    .join("");
            }

            function renderJobImageGallery(job) {
        const images = getJobImages(job).slice(1);
        if (!images.length) return "";
        return `<div class="job-image-gallery">${images.map((image, index) => `<img src="${image}" alt="${job.title} photo ${index + 2}" />`).join("")}</div>`;
      }

      function openJobModal(jobId) {
                const job = getJob(jobId);
                const review = getReviewByJob(jobId);
                if (!job) return;

                document.getElementById("modalTitle").textContent = job.title;
                document.getElementById("modalBody").innerHTML = [
                    `<div class="modal-job-tag">${job.category}</div>`,
                    getPrimaryJobImage(job) ? `<img class="modal-img job-modal-photo" src="${getPrimaryJobImage(job)}" alt="${job.title}" />` : `<div class="modal-img">🚗</div>`,
                    renderJobImageGallery(job),
                    `<p style="color: var(--text-muted); font-size: 15px; line-height: 1.7; margin-bottom: 20px;">${job.description}</p>`,
                    `<div class="modal-details">`,
                    `<div class="modal-detail"><label>Vehicle</label><strong>${job.vehicle}</strong></div>`,
                    `<div class="modal-detail"><label>Technician</label><strong>${job.tech}</strong></div>`,
                    `<div class="modal-detail"><label>Labor Time</label><strong>${job.hours}</strong></div>`,
                    `<div class="modal-detail"><label>Job Type</label><strong>${job.category}</strong></div>`,
                    `</div>`,
                    review ? `<div class="modal-review-section"><h4>Customer Review</h4><div class="review-card modal-review-card" style="cursor: default; pointer-events: none;"><div class="modal-review-top"><div class="review-title">${getReviewJobTitle(review)}</div><div class="review-stars">${"★".repeat(review.stars)}</div></div><p class="review-text">"${review.text}"</p><div class="modal-review-author"><div class="review-avatar">${review.name.charAt(0)}</div><div><div class="review-name">${review.name}</div><div class="review-vehicle">${getReviewVehicle(review)}</div></div></div></div><a class="modal-job-link" href="reviews.html#review-${review.reviewId}">Open Review →</a></div>` : ``
                ].join("");
                document.getElementById("jobModal").classList.add("open");
                document.body.style.overflow = "hidden";
            }

            function closeModal() {
                document.getElementById("jobModal").classList.remove("open");
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
                if (!e.target.classList.contains("filter-btn")) return;

                document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));

                e.target.classList.add("active");

                currentFilter = e.target.dataset.filter;

                renderJobs();
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

            // Search
            document.getElementById("jobSearch").addEventListener("input", renderJobs);

            // Initial render
            renderJobs();
