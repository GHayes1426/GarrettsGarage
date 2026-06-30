// data.js
const jobs = [
    {
        jobId: 1,
        title: "2018 Honda Accord Engine Rebuild",
        category: "Engine",
        description: "Complete engine rebuild after oil starvation. New rings, bearings, and head work.",
        vehicle: "2018 Honda Accord 2.0T",
        tech: "Garrett",
        hours: "18 hrs"
    },
    {
        jobId: 2,
        title: "2017 Honda Civic Head Gasket Replacement",
        category: "Engine",
        description: "Full Head Gasket Replacement.",
        vehicle: "2017 Honda Civic",
        tech: "Garrett",
        hours: "6 hrs"
    }
];

const reviews = [
    {
        reviewId: 1,
        jobId: 1,
        name: "Marcus T.",
        vehicle: "2018 Honda Accord",
        jobTitle: "2018 Honda Accord Engine Rebuild",
        stars: 5,
        text: "Garrett completely rebuilt my engine, here is some extra added bs to test length limitshere is some extra added bs to test length limitshere is some extra added bs to test length limitshere is some extra added bs to test length limitshere is some extra added bs to test length limitshere is some extra added bs to test length limits ZZZZZZZZZZZ here is some extra added bs to test length limitshere is some extra added bs to test length limits"
    },
    {
        reviewId: 2,
        jobId: 2,
        name: "Priya H.",
        vehicle: "2017 Honda Civic",
        jobTitle: "2017 Honda Civic Head Gasket Replacement",
        stars: 5,
        text: "Garrett completely fixed my engine after the head gasket went bad"
    },
    {
        reviewId: 7,
        jobId: null,
        name: "Alex B.",
        vehicle: "2022 Honda Civic",
        jobTitle: "Quick Honda Civic Service",
        stars: 5,
        text: "Quick service, in and out with a pick up and delivery service"
    }
];

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


const siteDataDefaults = { jobs, reviews, services };

function normalizeJob(job) {
    const images = [...new Set(Array.isArray(job.images) ? job.images : job.image ? [job.image] : [])];
    const { image, ...rest } = job;
    return { ...rest, images };
}

function normalizeReview(review) {
    const rest = { ...review };
    delete rest["s" + "lug"];
    return rest;
}

function normalizeCollection(key, value) {
    if (key === "jobs") return value.map(normalizeJob);
    if (key === "reviews") return value.map(normalizeReview);
    return value;
}

function readManagedCollection(key, fallback) {
    try {
        const saved = localStorage.getItem(`gg_admin_${key}`);
        return normalizeCollection(key, saved ? JSON.parse(saved) : fallback);
    } catch (error) {
        return normalizeCollection(key, fallback);
    }
}

function getManagedData() {
    return {
        jobs: readManagedCollection("jobs", jobs),
        reviews: readManagedCollection("reviews", reviews),
        services: readManagedCollection("services", services)
    };
}

function getJobImages(job) {
    return Array.isArray(job.images) ? job.images : job.image ? [job.image] : [];
}

function getPrimaryJobImage(job) {
    return getJobImages(job)[0] || "";
}

function saveManagedCollection(key, value) {
    localStorage.setItem(`gg_admin_${key}`, JSON.stringify(value));
}


function resetScrollOnRefresh() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry ? navEntry.type === "reload" : performance.navigation && performance.navigation.type === 1;

    if (isReload) {
        if (window.location.hash) {
            history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }

        window.addEventListener("load", () => window.scrollTo(0, 0));
        window.addEventListener("pageshow", () => window.scrollTo(0, 0));
    }
}

resetScrollOnRefresh();
