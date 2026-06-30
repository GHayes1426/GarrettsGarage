const managedData = getManagedData();
const publicServices = managedData.services;

function renderServices(filter = "all") {
  const grid = document.getElementById("servicesGrid");
  const filtered = filter === "all" ? publicServices : publicServices.filter((service) => service.cat === filter);

  grid.innerHTML = filtered
    .map(
      (service) =>
        '<div class="service-card" data-cat="' + service.cat + '">' +
        '<div class="service-card-body">' +
        '<div class="service-icon-wrap">' + service.icon + '</div>' +
        '<div class="service-cat">' + service.cat.toUpperCase() + '</div>' +
        '<h3>' + service.name + '</h3>' +
        '<p>' + service.desc + '</p>' +
        '<div class="service-price">' + service.price + ' <span>' + service.priceNote + '</span></div>' +
        '</div>' +
        '</div>'
    )
    .join("");
}

function updateNavOffsets() {
  const nav = document.querySelector("nav");
  const menu = document.getElementById("mobileMenu");
  const bookBtn = document.querySelector(".floating-book-btn");
  const navHeight = nav.getBoundingClientRect().height;
  const menuHeight = menu.classList.contains("open") ? menu.scrollHeight : 0;

  document.documentElement.style.setProperty("--nav-height", navHeight + "px");
  bookBtn.style.top = navHeight + menuHeight + "px";
}

window.addEventListener("load", updateNavOffsets);
window.addEventListener("resize", updateNavOffsets);

document.getElementById("filterBar").addEventListener("click", (event) => {
  if (!event.target.classList.contains("filter-btn")) return;

  document.querySelectorAll(".filter-btn").forEach((button) => button.classList.remove("active"));
  event.target.classList.add("active");
  renderServices(event.target.dataset.filter);
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
  bookBtn.style.top = menu.classList.contains("open") ? navHeight + 48 + "px" : navHeight + "px";
}

renderServices();
