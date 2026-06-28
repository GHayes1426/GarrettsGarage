            function getJob(jobId) {
                return jobs.find((j) => j.jobId === jobId);
            }

            function getReviewByJob(jobId) {
                return reviews.find((r) => r.jobId === jobId);
            }

            function getReview(reviewId) {
                return reviews.find((r) => r.reviewId === reviewId);
            }

            // ── RENDER JOBS ──
            let currentFilter = "all";

            function renderJobs() {
                const search = document.getElementById("jobSearch").value.toLowerCase().trim();

                let filtered = jobs;

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
                            <span>${job.vehicle}</span>
                            <span class="job-meta-dot">•</span>
                            <span>${job.hours}</span>
                        </div>

                        ${
                            review
                                ? `<div class="job-review-link">View Review →</div>`
                                : `<div class="job-review-link" style="opacity:.5">No Review Yet</div>`
                        }

                    </div>

                </a>
            `;
                    })
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
