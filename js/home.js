      function getJob(jobId) {
        return jobs.find((j) => j.jobId === jobId);
      }

      function getReviewByJob(jobId) {
        return reviews.find((r) => r.jobId === jobId);
      }

      function getReview(reviewId) {
        return reviews.find((r) => r.reviewId === reviewId);
      }

      const featuredReviews = reviews;

      // ── DATA ──
      const services = [
        {
          cat: "maintenance",
          icon: "🛢️",
          name: "Oil Change & Filter",
          desc: "Full synthetic or conventional oil change with filter replacement and multi-point inspection.",
          price: "From $49",
          priceNote: "/visit"
        },
        {
          cat: "maintenance",
          icon: "🔍",
          name: "Multi-Point Inspection",
          desc: "Comprehensive 27-point inspection covering brakes, fluids, belts, hoses, and more.",
          price: "Free",
          priceNote: " with service"
        },
        {
          cat: "maintenance",
          icon: "💧",
          name: "Fluid Services",
          desc: "Coolant, brake fluid, power steering, and transmission fluid flush and fill services.",
          price: "From $79",
          priceNote: "/service"
        },
        {
          cat: "engine",
          icon: "🔧",
          name: "Engine Diagnostics",
          desc: "Computer scan plus hands-on diagnosis to identify the root cause of check engine lights or unusual symptoms.",
          price: "From $89",
          priceNote: "/diagnostic"
        },
        {
          cat: "engine",
          icon: "⚡",
          name: "Timing Belt / Chain",
          desc: "Factory-spec timing belt or chain replacement with tensioners and water pump where applicable.",
          price: "From $349",
          priceNote: "/job"
        },
        {
          cat: "engine",
          icon: "🌀",
          name: "Head Gasket Repair",
          desc: "Full head gasket replacement with resurfacing and pressure testing. Guaranteed work.",
          price: "From $899",
          priceNote: "/job"
        },
        {
          cat: "brakes",
          icon: "🛑",
          name: "Brake Pad Replacement",
          desc: "OEM-quality pads front or rear with hardware kit and brake dust check.",
          price: "From $149",
          priceNote: "/axle"
        },
        {
          cat: "brakes",
          icon: "⭕",
          name: "Rotor Replacement",
          desc: "Rotors machined or replaced to spec — paired with new pads for peak stopping power.",
          price: "From $249",
          priceNote: "/axle"
        },
        {
          cat: "brakes",
          icon: "🔩",
          name: "Suspension & Struts",
          desc: "Shocks, struts, control arms, and alignment — handle vibration and uneven wear before it gets worse.",
          price: "From $299",
          priceNote: "/corner"
        },
        {
          cat: "transmission",
          icon: "⚙️",
          name: "Transmission Service",
          desc: "Fluid drain and fill or full flush with filter replacement. CVT and automatic specialists.",
          price: "From $199",
          priceNote: "/service"
        },
        {
          cat: "transmission",
          icon: "🔄",
          name: "Transmission Rebuild",
          desc: "Full transmission rebuild using quality rebuild kits — backed by a 12-month warranty.",
          price: "From $1,499",
          priceNote: "/job"
        },
        {
          cat: "electrical",
          icon: "🔋",
          name: "Battery Service",
          desc: "Battery test, replacement, and charging system inspection. Honda OEM batteries available.",
          price: "From $99",
          priceNote: "/installed"
        },
        {
          cat: "electrical",
          icon: "💡",
          name: "Electrical Diagnosis",
          desc: "Pinpoint shorts, bad grounds, sensor failures, and other electrical gremlins in your Honda/Acura.",
          price: "From $89",
          priceNote: "/hour"
        },
        {
          cat: "ac",
          icon: "❄️",
          name: "A/C Recharge",
          desc: "Refrigerant recharge with leak inspection to get your cabin cool again.",
          price: "From $129",
          priceNote: "/service"
        },
        {
          cat: "ac",
          icon: "🌡️",
          name: "A/C Compressor Replacement",
          desc: "Full compressor R&R with dye test and system recharge. OEM compressors available.",
          price: "From $599",
          priceNote: "/job"
        }
      ];

      // ── RENDER JOBS ──
      function renderJobs() {
        document.getElementById("jobsGrid").innerHTML = jobs
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
          <div class="job-tag">${job.category}</div>
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

      // ── REVIEW CAROUSEL ──
      let currentReview = 0;

      function updateCarousel() {
        document.getElementById("reviewTrack").style.transform = `translateX(-${currentReview * 100}%)`;

        document.getElementById("reviewDots").innerHTML = featuredReviews
          .map(
            (_, i) => `
      <span
        class="review-dot ${i === currentReview ? "active" : ""}"
        onclick="goToReview(${i})"
      ></span>
    `
          )
          .join("");
      }

      let carouselInterval;
      function renderReviews() {
        document.getElementById("reviewTrack").innerHTML = featuredReviews
          .map((review) => {
            const job = getJob(review.jobId);

            return `
        <div class="featured-review"
          onclick="openReviewModal(${review.reviewId})">

          <div class="featured-review-header">

              ${job ? `<div class="review-title">${job.title}</div>` : ""}

              <div class="review-stars">
                  ${"★".repeat(review.stars)}
              </div>

          </div>

          <p class="review-text">
              "${review.text}"
          </p>

          <div class="review-author">
              <div class="review-avatar">
                  ${review.name.charAt(0)}
              </div>

              <div>
                  <div class="review-name">${review.name}</div>
                  <div class="review-vehicle">${review.vehicle}</div>
              </div>
          </div>

      </div>
      `;
          })
          .join("");

        document.getElementById("reviewDots").innerHTML = featuredReviews
          .map(
            (_, i) => `
      <span
        class="review-dot ${i === currentReview ? "active" : ""}"
        onclick="goToReview(${i})"
      ></span>
    `
          )
          .join("");

        updateCarousel();
      }

      function nextReview() {
        currentReview++;

        if (currentReview >= featuredReviews.length) {
          currentReview = 0;
        }

        updateCarousel();
      }

      function prevReview() {
        currentReview--;

        if (currentReview < 0) {
          currentReview = featuredReviews.length - 1;
        }

        updateCarousel();
      }

      function goToReview(index) {
        currentReview = index;
        renderReviews();
        restartCarousel();
      }

      function startCarousel() {
        carouselInterval = setInterval(() => {
          nextReview();
        }, 5000);
      }

      function restartCarousel() {
        clearInterval(carouselInterval);
        startCarousel();
      }

      function openReviewModal(reviewId) {
        const review = getReview(reviewId);
        const job = getJob(review.jobId);
        document.getElementById("modalName").textContent = review.name;
        document.getElementById("modalVehicle").textContent = review.vehicle;
        document.getElementById("modalStars").textContent = "★".repeat(review.stars);
        document.getElementById("modalJob").textContent = job ? job.title : "";
        document.getElementById("modalText").textContent = review.text;
        const link = document.getElementById("modalJobLink");
        if (job) {
          link.href = `jobs.html#job-${job.jobId}`;
          link.style.display = "";
        } else {
          link.style.display = "none";
        }
        document.getElementById("reviewModal").classList.add("open");
        document.body.style.overflow = "hidden";
      }

      function closeReviewModal() {
        document.getElementById("reviewModal").classList.remove("open");

        document.body.style.overflow = "";
      }

      document.getElementById("reviewModal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("reviewModal")) {
          closeReviewModal();
        }
      });

      // ── MODAL ──
      function openJobModal(jobId) {
        const job = getJob(jobId);
        const review = getReviewByJob(jobId);
        if (!job) return;

        document.getElementById("modalTitle").textContent = job.title;
        document.getElementById("modalBody").innerHTML = `
    <div class="modal-job-tag">${job.category}</div>
    <div class="modal-img">🚗</div>
    <p style="color: var(--text-muted); font-size: 15px; line-height: 1.7; margin-bottom: 20px;">${job.description}</p>
    <div class="modal-details">
      <div class="modal-detail"><label>Vehicle</label><strong>${job.vehicle}</strong></div>
      <div class="modal-detail"><label>Technician</label><strong>${job.tech}</strong></div>
      <div class="modal-detail"><label>Labor Time</label><strong>${job.hours}</strong></div>
      <div class="modal-detail"><label>Job Type</label><strong>${job.category}</strong></div>
    </div>
    ${
      review
        ? `
    <div class="modal-review-section">
      <h4>Customer Review</h4>
      <div class="review-card" style="cursor: default; pointer-events: none;">
        <div class="review-stars">${"★".repeat(review.stars)}</div>
        <p class="review-text">"${review.text}"</p>
        <div class="review-author">
          <div class="review-avatar">${review.name.charAt(0)}</div>
          <div>
            <div class="review-name">${review.name}</div>
            <div class="review-vehicle">${review.vehicle}</div>
          </div>
        </div>
      </div>
    </div>`
        : ""
    }
  `;

        document.getElementById("jobModal").classList.add("open");
        document.body.style.overflow = "hidden";
      }

      function closeModal() {
        document.getElementById("jobModal").classList.remove("open");
        document.body.style.overflow = "";
      }

      document.getElementById("jobModal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("jobModal")) closeModal();
      });

      // ── APPOINTMENT SUBMISSION ──
      function submitAppointment() {
        const fname = document.getElementById("fname").value.trim();
        const lname = document.getElementById("lname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const make = document.getElementById("make").value;
        const model = document.getElementById("model").value.trim();
        const year = document.getElementById("year").value.trim();
        const serviceType = document.getElementById("serviceType").value;
        const apptDate = document.getElementById("apptDate").value;
        const dropoff = document.querySelector('input[name="dropoff"]:checked')?.value;
        const notes = document.getElementById("notes").value.trim();

        if (!fname || !lname || !phone || !make || !model || !year || !serviceType || !apptDate) {
          alert("Please fill in all required fields.");
          return;
        }

        // Simulate database save
        const appointment = {
          id: Date.now(),
          customer: { fname, lname, phone, email },
          vehicle: { make, model, year },
          service: { serviceType, apptDate, dropoff, notes },
          submitted: new Date().toISOString()
        };

        // Store in localStorage (simulating DB)
        const existing = JSON.parse(localStorage.getItem("gg_appointments") || "[]");
        existing.push(appointment);
        localStorage.setItem("gg_appointments", JSON.stringify(existing));

        // Store customer record
        const customers = JSON.parse(localStorage.getItem("gg_customers") || "[]");
        const existingCustomer = customers.find((c) => c.phone === phone);
        if (!existingCustomer) {
          customers.push({
            id: Date.now(),
            fname,
            lname,
            phone,
            email,
            vehicles: [`${year} ${make} ${model}`],
            firstVisit: new Date().toISOString()
          });
        } else {
          const veh = `${year} ${make} ${model}`;
          if (!existingCustomer.vehicles.includes(veh)) existingCustomer.vehicles.push(veh);
        }
        localStorage.setItem("gg_customers", JSON.stringify(customers));

        // Reset form
        ["fname", "lname", "phone", "email", "model", "year", "notes", "apptDate"].forEach(
          (id) => (document.getElementById(id).value = "")
        );
        document.getElementById("make").value = "";
        document.getElementById("serviceType").value = "";

        // Show toast
        const toast = document.getElementById("toast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 4000);
      }

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

      // ── INIT ──
      renderJobs();
      renderReviews();
      startCarousel();

      // Animate on scroll
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.style.opacity = "1";
              e.target.style.transform = "translateY(0)";
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll(".service-card, .job-card, .review-card, .specialty-item").forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        observer.observe(el);
      });

      function updateNavOffsets() {
        const nav = document.querySelector("nav");
        const menu = document.getElementById("mobileMenu");
        const bookBtn = document.querySelector(".floating-book-btn");

        const navHeight = nav.getBoundingClientRect().height;

        document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);

        const menuHeight = menu.classList.contains("open") ? menu.scrollHeight : 0;

        bookBtn.style.top = `${navHeight + menuHeight}px`;
      }

      document.querySelectorAll("#mobileMenu a").forEach((link) => {
        link.addEventListener("click", () => {
          const menu = document.getElementById("mobileMenu");
          const burger = document.getElementById("burger");

          menu.classList.remove("open");
          burger.classList.remove("open");

          updateNavOffsets();
        });
      });

      window.addEventListener("load", updateNavOffsets);
      window.addEventListener("resize", () => {
        updateNavOffsets();

        if (window.innerWidth > 900) {
          document.getElementById("mobileMenu").classList.remove("open");
          document.getElementById("burger").classList.remove("open");
        }
      });

      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-links a, #mobileMenu a");
      const sectionNavTargets = {
        home: "#about",
        about: "services.html",
        services: "services.html",
        reviews: "reviews.html",
        jobs: "jobs.html",
        schedule: "#schedule"
      };

      function getSectionForScroll() {
        let current = "";

        sections.forEach((section) => {
          const top = section.offsetTop;

          if (window.scrollY >= top - 120) {
            current = section.id;
          }
        });

        return current;
      }

      function updateActiveNav() {
        const current = getSectionForScroll();
        const activeTarget = sectionNavTargets[current];

        navLinks.forEach((link) => {
          link.classList.toggle("active", Boolean(activeTarget) && link.getAttribute("href") === activeTarget);
        });
      }

      window.addEventListener("scroll", updateActiveNav);
      window.addEventListener("load", updateActiveNav);
      window.addEventListener("hashchange", updateActiveNav);

      function updateTodayHours() {
        const schedule = {
          0: { day: "Sunday", hours: "11am – 5pm" },
          1: { day: "Monday", hours: "11am – 11pm" },
          2: { day: "Tuesday", hours: "11am – 11pm" },
          3: { day: "Wednesday", hours: "11am – 11pm" },
          4: { day: "Thursday", hours: "11am – 11pm" },
          5: { day: "Friday", hours: "11am – 11pm" },
          6: { day: "Saturday", hours: "11am – 12pm" }
        };

        const today = schedule[new Date().getDay()];

        document.getElementById("todayHours").textContent = today.hours;
      }

      updateTodayHours();
