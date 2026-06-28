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
        slug: "marcus-accord-engine-rebuild",
        name: "Marcus T.",
        vehicle: "2018 Honda Accord",
        stars: 5,
        text: "Garrett completely rebuilt my engine, here is some extra added bs to test length limitshere is some extra added bs to test length limitshere is some extra added bs to test length limitshere is some extra added bs to test length limitshere is some extra added bs to test length limitshere is some extra added bs to test length limits ZZZZZZZZZZZ here is some extra added bs to test length limitshere is some extra added bs to test length limits"
    },
    {
        reviewId: 2,
        jobId: 2,
        slug: "priya-head-gasket-replacement",
        name: "Priya H.",
        vehicle: "2017 Honda Civic",
        stars: 5,
        text: "Garrett completely fixed my engine after the head gasket went bad"
    },
    {
        reviewId: 7,
        jobId: null,
        slug: "oil-change-review",
        name: "Alex B.",
        vehicle: "2022 Honda Civic",
        stars: 5,
        text: "Quick service, in and out with a pick up and delivery service"
    }
];