      function getJob(jobId) {
        return jobs.find((j) => j.jobId === jobId);
      }

      function getReviewByJob(jobId) {
        return reviews.find((r) => r.jobId === jobId);
      }

      function getReview(reviewId) {
        return reviews.find((r) => r.reviewId === reviewId);
      }

      let selectedRating = null;

      // ── RENDER REVIEWS ──
      function renderReviews() {
        const search = document.getElementById("reviewSearch").value.toLowerCase().trim();
        let filtered = reviews;
        if (selectedRating !== null) {
          filtered = filtered.filter((r) => r.stars === selectedRating);
        }
        if (search) {
          filtered = filtered.filter((r) => {
            const job = getJob(r.jobId);
            return [r.name, r.vehicle, r.text, job?.title || "", job?.category || ""]
              .join(" ")
              .toLowerCase()
              .includes(search);
          });
        }

        document.getElementById("reviewsGrid").innerHTML = filtered
          .map((r) => {
            const job = getJob(r.jobId);
            return `
            <div class="review-card"
                 onclick="openReview(${r.reviewId})">
                <div class="review-card-body">
                    <div class="review-header">
                        <div>
                            <h3>${r.name}</h3>
                            <div class="review-meta">
                                ${r.vehicle}
                                ${job ? `• ${job.category}` : ""}
                            </div>
                        </div>
                        <div class="review-cat">
                            ${"★".repeat(r.stars)}
                        </div>
                    </div>
                    ${job ? `<div class="review-title">${job.title}</div>` : ""}
                    <p class="review-text">
                        "${r.text}"
                    </p>
                </div>
            </div>
            `;
          })
          .join("");
      }

      function openReview(reviewId) {
        const review = getReview(reviewId);
        const job = getJob(review.jobId);

        document.getElementById("modalName").textContent = review.name;
        document.getElementById("modalVehicle").textContent = review.vehicle;
        document.getElementById("modalStars").textContent = "★".repeat(review.stars);

        document.getElementById("modalJob").textContent = job ? job.title : "";

        document.getElementById("modalText").textContent = review.text;

        const link = document.getElementById("modalJobLink");

        if (job) {
          link.href = `/index.html#job-${job.jobId}`;
          link.style.display = "";
        } else {
          link.style.display = "none";
        }

        document.getElementById("reviewModal").classList.add("show");
      }

      function closeReview() {
        document.getElementById("reviewModal").classList.remove("show");
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

      window.addEventListener("resize", () => {
        updateNavOffsets();

        if (window.innerWidth > 900) {
          document.getElementById("mobileMenu").classList.remove("open");
          document.getElementById("burger").classList.remove("open");
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

      // Search
      document.getElementById("reviewSearch").addEventListener("input", renderReviews);

      // Star Filter
      const stars = document.querySelectorAll(".filter-star");

      stars.forEach((star) => {
        star.addEventListener("mouseenter", () => {
          const rating = Number(star.dataset.rating);

          stars.forEach((s) => {
            s.classList.toggle("hovered", Number(s.dataset.rating) <= rating);
          });
        });

        star.addEventListener("mouseleave", () => {
          stars.forEach((s) => s.classList.remove("hovered"));
        });

        star.addEventListener("click", () => {
          const clickedRating = Number(star.dataset.rating);

          // If already selected, clear filter
          if (selectedRating === clickedRating) {
            selectedRating = null;

            stars.forEach((s) => {
              s.classList.remove("active");
            });
          } else {
            selectedRating = clickedRating;

            stars.forEach((s) => {
              s.classList.toggle("active", Number(s.dataset.rating) <= selectedRating);
            });
          }

          renderReviews();
        });
      });

      // Initial render
      renderReviews();
