      const managedData = getManagedData();
      const publicJobs = managedData.jobs;
      const publicReviews = managedData.reviews;

      function getJob(jobId) {
        return publicJobs.find((j) => j.jobId === jobId);
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

      let selectedRating = null;

      // ── RENDER REVIEWS ──
      function renderReviews() {
        const search = document.getElementById("reviewSearch").value.toLowerCase().trim();
        let filtered = publicReviews;
        if (selectedRating !== null) {
          filtered = filtered.filter((r) => r.stars === selectedRating);
        }
        if (search) {
          filtered = filtered.filter((r) => {
            return [r.name, getReviewVehicle(r), getReviewJobTitle(r), r.text]
              .join(" ")
              .toLowerCase()
              .includes(search);
          });
        }

        document.getElementById("reviewsGrid").innerHTML = filtered
          .map((r) => {
            return `
            <div class="review-card" id="review-${r.reviewId}"
                 onclick="openReview(${r.reviewId})">
                <div class="review-card-body">
                    <div class="review-header">
                        <div>
                            <h3>${r.name}</h3>
                        </div>
                        <div class="review-cat">
                            ${"★".repeat(r.stars)}
                        </div>
                    </div>
                    <div class="review-meta"><span class="vehicle-name">${getReviewVehicle(r)}</span></div>
                    ${getReviewJobTitle(r) ? `<div class="review-title">${getReviewJobTitle(r)}</div>` : ""}
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
        document.getElementById("modalVehicle").textContent = getReviewVehicle(review);
        document.getElementById("modalVehicle").style.display = getReviewVehicle(review) ? "" : "none";
        document.getElementById("modalStars").textContent = "★".repeat(review.stars);

        document.getElementById("modalJob").textContent = getReviewJobTitle(review);
        document.getElementById("modalJob").style.display = getReviewJobTitle(review) ? "" : "none";

        document.getElementById("modalText").textContent = review.text;

        const link = document.getElementById("modalJobLink");

        if (job) {
          link.href = `jobs.html#job-${job.jobId}`;
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

      function openReviewFromHash() {
        const match = window.location.hash.match(/^#review-(\d+)$/);
        if (!match) return;
        const reviewId = Number(match[1]);
        const card = document.getElementById(`review-${reviewId}`);
        if (card) card.scrollIntoView({ block: "center" });
        openReview(reviewId);
      }

      window.addEventListener("load", openReviewFromHash);
      window.addEventListener("hashchange", openReviewFromHash);

      // Initial render
      renderReviews();
