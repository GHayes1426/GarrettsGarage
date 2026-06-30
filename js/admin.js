var adminData = getManagedData();
var adminState = {
    jobs: JSON.parse(JSON.stringify(adminData.jobs)),
    reviews: JSON.parse(JSON.stringify(adminData.reviews)),
    services: JSON.parse(JSON.stringify(adminData.services))
};
var adminFilters = {
    reviews: { rating: null, search: "" },
    jobs: { category: "all", search: "" },
    services: { category: "all" }
};
var dirtyPanels = { reviews: false, jobs: false, services: false };
var editors = {
    reviews: document.getElementById("reviewsEditor"),
    jobs: document.getElementById("jobsEditor"),
    services: document.getElementById("servicesEditor")
};

adminState.reviews = adminState.reviews.map(function (review) {
    if (!review.jobTitle) {
        var job = getAdminJob(review.jobId);
        if (job) review.jobTitle = job.title || "";
    }
    return review;
});

function esc(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
}

function nextId(items, key) {
    return Math.max(0, ...items.map(function (item) { return Number(item[key]) || 0; })) + 1;
}

function getAdminJob(jobId) {
    return adminState.jobs.find(function (job) { return job.jobId === Number(jobId); });
}

function reviewVehicle(review) {
    var job = getAdminJob(review.jobId);
    return review.vehicle || (job ? job.vehicle : "") || "";
}

function reviewJobTitle(review) {
    var job = getAdminJob(review.jobId);
    return review.jobTitle || (job ? job.title : "") || "";
}

function setSaveState(collection, isDirty) {
    dirtyPanels[collection] = isDirty;
    document.querySelectorAll('[data-save="' + collection + '"]').forEach(function (button) {
        button.classList.toggle("is-dirty", isDirty);
        button.textContent = isDirty ? "Save Changes" : "Saved";
    });
}

function saveCollection(collection) {
    saveManagedCollection(collection, adminState[collection]);
    setSaveState(collection, false);
}

function saveAll() {
    saveCollection("jobs");
    saveCollection("reviews");
    saveCollection("services");
}

function field(collection, index, key, label, type) {
    var value = adminState[collection][index][key] ?? "";
    if (type === "textarea") {
        return '<label>' + label + '<textarea data-collection="' + collection + '" data-index="' + index + '" data-key="' + key + '">' + esc(value) + '</textarea></label>';
    }
    return '<label>' + label + '<input type="' + (type || "text") + '" value="' + esc(value) + '" data-collection="' + collection + '" data-index="' + index + '" data-key="' + key + '" /></label>';
}

function reviewMatchesSearch(review) {
    var search = adminFilters.reviews.search.toLowerCase().trim();
    if (adminFilters.reviews.rating !== null && Number(review.stars) !== adminFilters.reviews.rating) return false;
    if (!search) return true;
    return [review.name, reviewVehicle(review), reviewJobTitle(review), review.text, review.jobId]
        .join(" ")
        .toLowerCase()
        .includes(search);
}

function jobMatchesSearch(job) {
    var search = adminFilters.jobs.search.toLowerCase().trim();
    if (adminFilters.jobs.category !== "all" && job.category !== adminFilters.jobs.category) return false;
    if (!search) return true;
    return [job.title, job.vehicle, job.category, job.description, job.tech, job.hours]
        .join(" ")
        .toLowerCase()
        .includes(search);
}

function serviceMatchesFilter(service) {
    return adminFilters.services.category === "all" || service.cat === adminFilters.services.category;
}

function renderReviews() {
    editors.reviews.innerHTML = adminState.reviews
        .map(function (review, index) { return { review: review, index: index }; })
        .filter(function (entry) { return reviewMatchesSearch(entry.review); })
        .map(function (entry) {
            var review = entry.review;
            var index = entry.index;
            return '<article class="editor-card">' +
                '<button class="editor-summary" type="button">' +
                '<div class="summary-content"><strong class="summary-name">' + esc(review.name || "New Review") + '</strong>' +
                '<small class="summary-meta"><span class="admin-stars">' + '★'.repeat(review.stars || 0) + '</span><span class="admin-summary-sep">•</span><span class="admin-vehicle">' + esc(reviewVehicle(review) || "No Vehicle") + '</span><span class="admin-summary-sep">•</span><span class="admin-job-title">' + esc(reviewJobTitle(review) || "No Job Title") + '</span></small></div>' +
                '<span class="arrow">▼</span>' +
                '</button>' +
                '<div class="editor-body">' +
                '<div class="form-row">' + field("reviews", index, "reviewId", "ID", "number") + field("reviews", index, "stars", "Stars", "number") + '</div>' +
                field("reviews", index, "name", "Name") +
                '<div class="form-row">' + field("reviews", index, "vehicle", "Vehicle Info") + field("reviews", index, "jobTitle", "Job Title") + '</div>' +
                field("reviews", index, "jobId", "Linked Job ID", "number") +
                field("reviews", index, "text", "Review Text", "textarea") +
                '<label class="checkbox-label"><input type="checkbox" ' + (review.featured === false ? "" : "checked") + ' data-collection="reviews" data-index="' + index + '" data-key="featured" /> Show on main page</label>' +
                '<div class="card-actions"><button class="admin-btn danger" data-remove="reviews" data-index="' + index + '">Delete</button></div>' +
                '</div></article>';
        })
        .join("") || '<p class="admin-empty">No reviews match that filter.</p>';
}

function renderJobs() {
    editors.jobs.innerHTML = adminState.jobs
        .map(function (job, index) { return { job: job, index: index }; })
        .filter(function (entry) { return jobMatchesSearch(entry.job); })
        .map(function (entry) {
            var job = entry.job;
            var index = entry.index;
            var images = Array.isArray(job.images) ? job.images : job.image ? [job.image] : [];
            var preview = images.length
                ? '<div class="image-preview-grid">' + images.map(function (image, imageIndex) {
                    return '<div class="image-preview-wrap"><img class="image-preview" src="' + image + '" alt="' + esc(job.title || 'Job image') + '" /><button class="image-remove" data-remove-image="' + index + '" data-image-index="' + imageIndex + '">Remove</button></div>';
                }).join('') + '</div>'
                : '<div class="image-preview"></div>';
            return '<article class="editor-card">' +
                '<button class="editor-summary" type="button"><div class="summary-content"><strong class="summary-name">' + esc(job.title || "New Job") + '</strong><small class="summary-meta"><span class="admin-category">' + esc(job.category || "No Category") + '</span><span class="admin-summary-sep">•</span><span>' + esc(job.vehicle || "No Vehicle") + '</span></small></div><span class="arrow">▼</span></button>' +
                '<div class="editor-body">' + preview +
                '<label>Upload Pictures<input type="file" accept="image/*" multiple data-upload-job="' + index + '" /></label>' +
                '<div class="form-row">' + field('jobs', index, 'jobId', 'ID', 'number') + field('jobs', index, 'category', 'Category') + '</div>' +
                field('jobs', index, 'title', 'Title') +
                field('jobs', index, 'vehicle', 'Vehicle') +
                '<div class="form-row">' + field('jobs', index, 'tech', 'Tech') + field('jobs', index, 'hours', 'Hours') + '</div>' +
                field('jobs', index, 'description', 'Description', 'textarea') +
                '<div class="card-actions"><button class="admin-btn danger" data-remove="jobs" data-index="' + index + '">Delete</button></div>' +
                '</div></article>';
        })
        .join("") || '<p class="admin-empty">No completed jobs match that filter.</p>';
}

function renderServices() {
    editors.services.innerHTML = adminState.services
        .map(function (service, index) { return { service: service, index: index }; })
        .filter(function (entry) { return serviceMatchesFilter(entry.service); })
        .map(function (entry) {
            var service = entry.service;
            var index = entry.index;
            return '<article class="editor-card">' +
                '<button class="editor-summary" type="button"><div class="summary-content"><strong class="summary-name">' + esc(service.name || "New Service") + '</strong><small class="summary-meta"><span class="admin-category">' + esc(service.cat || "No Category") + '</span></small></div><span class="arrow">▼</span></button>' +
                '<div class="editor-body">' +
                '<div class="form-row">' + field("services", index, "cat", "Category") + field("services", index, "icon", "Icon") + '</div>' +
                field("services", index, "name", "Name") +
                field("services", index, "desc", "Description", "textarea") +
                '<div class="form-row">' + field("services", index, "price", "Price") + field("services", index, "priceNote", "Price Note") + '</div>' +
                '<div class="card-actions"><button class="admin-btn danger" data-remove="services" data-index="' + index + '">Delete</button></div>' +
                '</div></article>';
        })
        .join("") || '<p class="admin-empty">No services match that category.</p>';
}

function renderAll() {
    renderReviews();
    renderJobs();
    renderServices();
}

function toJsLiteral(value) {
    return JSON.stringify(value, null, 4);
}

function buildDataJs() {
    return '// data.js\n' +
        'const jobs = ' + toJsLiteral(adminState.jobs) + ';\n\n' +
        'const reviews = ' + toJsLiteral(adminState.reviews) + ';\n\n' +
        'const services = ' + toJsLiteral(adminState.services) + ';\n\n' +
        'const siteDataDefaults = { jobs, reviews, services };\n\n' +
        'function normalizeJob(job) {\n' +
        '    const images = [...new Set(Array.isArray(job.images) ? job.images : job.image ? [job.image] : [])];\n' +
        '    const { image, ...rest } = job;\n' +
        '    return { ...rest, images };\n' +
        '}\n\n' +
        'function normalizeReview(review) {\n' +
        '    const rest = { ...review };\n' +
        '    delete rest["s" + "lug"];\n' +
        '    return rest;\n' +
        '}\n\n' +
        'function normalizeCollection(key, value) {\n' +
        '    if (key === "jobs") return value.map(normalizeJob);\n' +
        '    if (key === "reviews") return value.map(normalizeReview);\n' +
        '    return value;\n' +
        '}\n\n' +
        'function readManagedCollection(key, fallback) {\n' +
        '    try {\n' +
        '        const saved = localStorage.getItem("gg_admin_" + key);\n' +
        '        return normalizeCollection(key, saved ? JSON.parse(saved) : fallback);\n' +
        '    } catch (error) {\n' +
        '        return normalizeCollection(key, fallback);\n' +
        '    }\n' +
        '}\n\n' +
        'function getManagedData() {\n' +
        '    return {\n' +
        '        jobs: readManagedCollection("jobs", jobs),\n' +
        '        reviews: readManagedCollection("reviews", reviews),\n' +
        '        services: readManagedCollection("services", services)\n' +
        '    };\n' +
        '}\n\n' +
        'function getJobImages(job) {\n' +
        '    return Array.isArray(job.images) ? job.images : job.image ? [job.image] : [];\n' +
        '}\n\n' +
        'function getPrimaryJobImage(job) {\n' +
        '    return getJobImages(job)[0] || "";\n' +
        '}\n\n' +
        'function saveManagedCollection(key, value) {\n' +
        '    localStorage.setItem("gg_admin_" + key, JSON.stringify(value));\n' +
        '}\n\n' +
        'function resetScrollOnRefresh() {\n' +
        '    if ("scrollRestoration" in history) history.scrollRestoration = "manual";\n\n' +
        '    const navEntry = performance.getEntriesByType("navigation")[0];\n' +
        '    const isReload = navEntry ? navEntry.type === "reload" : performance.navigation && performance.navigation.type === 1;\n\n' +
        '    if (isReload) {\n' +
        '        if (window.location.hash) {\n' +
        '            history.replaceState(null, document.title, window.location.pathname + window.location.search);\n' +
        '        }\n\n' +
        '        window.addEventListener("load", () => window.scrollTo(0, 0));\n' +
        '        window.addEventListener("pageshow", () => window.scrollTo(0, 0));\n' +
        '    }\n' +
        '}\n\n' +
        'resetScrollOnRefresh();\n';
}

function downloadFile(filename, content, type) {
    var blob = new Blob([content], { type: type });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

document.querySelectorAll(".admin-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
        document.querySelectorAll(".admin-tab,.admin-panel").forEach(function (el) { el.classList.remove("active"); });
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab + "Panel").classList.add("active");
    });
});

document.body.addEventListener("input", function (event) {
    var el = event.target;
    if (el.id === "adminReviewSearch") {
        adminFilters.reviews.search = el.value;
        renderReviews();
        return;
    }
    if (el.id === "adminJobSearch") {
        adminFilters.jobs.search = el.value;
        renderJobs();
        return;
    }
    if (!el.matches("[data-collection][data-key]")) return;
    var collection = el.dataset.collection;
    var key = el.dataset.key;
    var value = el.type === "checkbox" ? el.checked : el.value;
    if (["jobId", "reviewId", "stars"].includes(key)) value = Number(value) || null;
    adminState[collection][Number(el.dataset.index)][key] = value;
    setSaveState(collection, true);
});

document.body.addEventListener("change", function (event) {
    var input = event.target;
    if (!input.matches("[data-upload-job]")) return;
    var files = Array.from(input.files || []);
    if (!files.length) return;
    var job = adminState.jobs[Number(input.dataset.uploadJob)];
    job.images = Array.isArray(job.images) ? job.images : job.image ? [job.image] : [];
    delete job.image;
    var pending = files.length;
    files.forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function () {
            job.images.push(reader.result);
            job.images = [...new Set(job.images)];
            pending--;
            if (pending === 0) {
                setSaveState("jobs", true);
                renderJobs();
            }
        };
        reader.readAsDataURL(file);
    });
});

document.body.addEventListener("click", function (e) {
    var rating = e.target.closest("[data-admin-rating]");
    var jobFilter = e.target.closest("#adminJobFilterBar [data-admin-filter]");
    var serviceFilter = e.target.closest("#adminServiceFilterBar [data-admin-filter]");
    var save = e.target.closest("[data-save]");
    var add = e.target.closest("[data-add]");
    var remove = e.target.closest("[data-remove]");
    var removeImage = e.target.closest("[data-remove-image]");

    if (rating) {
        var selected = Number(rating.dataset.adminRating);
        adminFilters.reviews.rating = adminFilters.reviews.rating === selected ? null : selected;
        document.querySelectorAll("[data-admin-rating]").forEach(function (star) {
            star.classList.toggle("active", adminFilters.reviews.rating !== null && Number(star.dataset.adminRating) <= adminFilters.reviews.rating);
        });
        renderReviews();
        return;
    }

    if (jobFilter) {
        adminFilters.jobs.category = jobFilter.dataset.adminFilter;
        document.querySelectorAll("#adminJobFilterBar .filter-btn").forEach(function (button) { button.classList.remove("active"); });
        jobFilter.classList.add("active");
        renderJobs();
        return;
    }

    if (serviceFilter) {
        adminFilters.services.category = serviceFilter.dataset.adminFilter;
        document.querySelectorAll("#adminServiceFilterBar .filter-btn").forEach(function (button) { button.classList.remove("active"); });
        serviceFilter.classList.add("active");
        renderServices();
        return;
    }

    if (save) {
        saveCollection(save.dataset.save);
        return;
    }

    if (removeImage) {
        var job = adminState.jobs[Number(removeImage.dataset.removeImage)];
        job.images = (job.images || []).filter(function (_, i) { return i !== Number(removeImage.dataset.imageIndex); });
        setSaveState("jobs", true);
        renderJobs();
        return;
    }

    if (add) {
        var c = add.dataset.add;
        if (c === "reviews") adminState.reviews.unshift({ reviewId: nextId(adminState.reviews, "reviewId"), jobId: null, name: "", vehicle: "", jobTitle: "", stars: 5, text: "", featured: true });
        if (c === "jobs") adminState.jobs.unshift({ jobId: nextId(adminState.jobs, "jobId"), title: "", category: "", description: "", vehicle: "", tech: "Garrett", hours: "", images: [] });
        if (c === "services") adminState.services.unshift({ cat: "maintenance", icon: "", name: "", desc: "", price: "", priceNote: "" });
        setSaveState(c, true);
        renderAll();
        return;
    }

    if (remove) {
        var removedCollection = remove.dataset.remove;
        adminState[removedCollection].splice(Number(remove.dataset.index), 1);
        setSaveState(removedCollection, true);
        renderAll();
        return;
    }

    var summary = e.target.closest(".editor-summary");
    if (!summary) return;
    var card = summary.closest(".editor-card");
    var isOpen = card.classList.contains("open");
    document.querySelectorAll(".editor-card").forEach(function (c) { c.classList.remove("open"); });
    if (!isOpen) card.classList.add("open");
});

document.getElementById("adminRatingFilter").addEventListener("mouseover", function (event) {
    var star = event.target.closest("[data-admin-rating]");
    if (!star) return;
    var rating = Number(star.dataset.adminRating);
    document.querySelectorAll("[data-admin-rating]").forEach(function (s) { s.classList.toggle("hovered", Number(s.dataset.adminRating) <= rating); });
});

document.getElementById("adminRatingFilter").addEventListener("mouseleave", function () {
    document.querySelectorAll("[data-admin-rating]").forEach(function (s) { s.classList.remove("hovered"); });
});

document.getElementById("exportDataBtn").addEventListener("click", function () {
    saveAll();
    downloadFile("garretts-garage-data.json", JSON.stringify(adminState, null, 2), "application/json");
});

document.getElementById("exportDataJsBtn").addEventListener("click", function () {
    saveAll();
    downloadFile("data.js", buildDataJs(), "text/javascript");
});

document.getElementById("resetDataBtn").addEventListener("click", function () {
    var warning = "WARNING: this will delete all browser-saved admin edits and reload the original data from js/data.js. Continue?";
    if (!confirm(warning)) return;

    var typed = prompt('Type RESET to fully erase the saved admin edits.');
    if (typed !== "RESET") {
        alert("Reset canceled. No data was erased.");
        return;
    }

    ["jobs", "reviews", "services"].forEach(function (key) { localStorage.removeItem("gg_admin_" + key); });
    location.reload();
});

renderAll();
["reviews", "jobs", "services"].forEach(function (collection) { setSaveState(collection, false); });
