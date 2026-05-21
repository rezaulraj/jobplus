import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link, useNavigate } from "react-router-dom";
import useJobStore from "../../store/jobStore";

// ── Shimmer styles injected once ─────────────────────────────────────────────

const SHIMMER_CSS = `
@keyframes shimmer {
  0%   { background-position: -700px 0; }
  100% { background-position:  700px 0; }
}
.skl {
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 700px 100%;
  animation: shimmer 1.6s infinite linear;
}
.skl-r4  { border-radius: 4px; }
.skl-r8  { border-radius: 8px; }
.skl-r12 { border-radius: 12px; }
.skl-pill{ border-radius: 9999px; }
`;

function injectSklStyles() {
  if (document.getElementById("__fsl_skl__")) return;
  const s = document.createElement("style");
  s.id = "__fsl_skl__";
  s.textContent = SHIMMER_CSS;
  document.head.appendChild(s);
}

// ── Single skeleton card (matches real card dimensions h-72) ─────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden h-72 flex flex-col p-4">
    {/* Company logo + name row */}
    <div className="flex items-center gap-2 mb-3">
      <div
        className="skl skl-pill shrink-0"
        style={{ width: 24, height: 24 }}
      />
      <div className="skl skl-r4" style={{ height: 11, width: "55%" }} />
    </div>

    {/* Job title — two lines */}
    <div className="space-y-1.5 mb-3">
      <div className="skl skl-r4" style={{ height: 14, width: "90%" }} />
      <div className="skl skl-r4" style={{ height: 14, width: "70%" }} />
    </div>

    {/* Salary */}
    <div className="skl skl-r4 mb-3" style={{ height: 13, width: "45%" }} />

    {/* Category pill */}
    <div className="skl skl-pill mb-2" style={{ height: 20, width: 80 }} />

    {/* Location */}
    <div className="skl skl-r4 mb-auto" style={{ height: 11, width: "60%" }} />

    {/* CTA button */}
    <div className="skl skl-r8 mt-3" style={{ height: 38, width: "100%" }} />
  </div>
);

// ── Skeleton for the whole section header ────────────────────────────────────

const SkeletonHeader = () => (
  <div className="border-b border-gray-300 mb-4 flex items-center justify-between pb-3">
    {/* Title */}
    <div className="flex-1 flex justify-center">
      <div className="skl skl-r4" style={{ height: 22, width: 340 }} />
    </div>
    {/* Right links */}
    <div className="flex items-center gap-4 shrink-0">
      <div className="skl skl-r4" style={{ height: 14, width: 110 }} />
      <div className="skl skl-r4" style={{ height: 14, width: 90 }} />
    </div>
  </div>
);

// ── Skeleton section (4 cards in a row matching lg breakpoint) ───────────────

const FreelanceSkeleton = () => (
  <section className="py-8 bg-gray-100 hidden md:block font-source">
    <div className="container mx-auto px-4">
      <SkeletonHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  </section>
);

// ── Selectors ────────────────────────────────────────────────────────────────

const selectIsLoading = (s) => s.isLoading;

// ── Main component ────────────────────────────────────────────────────────────

const FreelanceSection = () => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  // Granular selector — avoids re-rendering on unrelated store changes
  const storeIsLoading = useJobStore(selectIsLoading);
  const fetchJobTypes = useJobStore((s) => s.fetchJobTypes);
  const fetchJobsByJobType = useJobStore((s) => s.fetchJobsByJobType);

  const [freelanceJobs, setFreelanceJobs] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);

  useEffect(() => {
    injectSklStyles();

    let cancelled = false;

    const loadFreelanceJobs = async () => {
      setSectionLoading(true);

      const typesResult = await fetchJobTypes();
      const types = typesResult?.data || useJobStore.getState().jobTypes;

      const freelanceType = types.find(
        (t) => t.title?.toLowerCase() === "freelance",
      );

      if (freelanceType?.jobTypeId) {
        const result = await fetchJobsByJobType(freelanceType.jobTypeId, {
          status: "published",
          limit: 20,
        });

        if (!cancelled && result?.success && result?.data) {
          setFreelanceJobs(result.data);
        }
      }

      if (!cancelled) setSectionLoading(false);
    };

    loadFreelanceJobs();
    return () => {
      cancelled = true;
    };
  }, [fetchJobTypes, fetchJobsByJobType]);

  const createJobUrl = (job) => {
    if (!job?.title) return "/freelance";
    const slug = job.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
    return `/freelance/${slug}-${job.jobId || job.id}`;
  };

  const handleJobClick = (job) => navigate(createJobUrl(job));
  const handleViewAll = () => navigate("/jobs");
  const handleHireFreelancer = () => navigate("/freelancer/post-job");

  // ── Show skeleton while loading ───────────────────────────────────────────
  if (sectionLoading) return <FreelanceSkeleton />;

  // ── Nothing to show ───────────────────────────────────────────────────────
  if (freelanceJobs.length === 0) return null;

  return (
    <section className="py-8 bg-gray-100 hidden md:block font-source">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="border-b border-gray-300 mb-4 flex items-center justify-center">
          <h2 className="flex-1 text-xl lg:text-2xl font-bold text-center mb-8 text-gray-700">
            Freelance Side Hustles - Make Extra Income
          </h2>
          <div className="block md:flex items-center justify-center gap-4">
            <button
              onClick={handleHireFreelancer}
              className="underline hover:text-blue-700 text-blue-800 text-[18px] font-lato font-medium transition-colors tracking-wide duration-200 bg-transparent border-none cursor-pointer"
            >
              Hire a Freelancer
            </button>
            <button
              onClick={handleViewAll}
              className="underline hover:text-blue-700 text-blue-800 text-[15px] font-lato font-medium transition-colors tracking-wide duration-200 bg-transparent border-none cursor-pointer"
            >
              View all Projects
            </button>
          </div>
        </div>

        {/* Swiper */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={freelanceJobs.length > 4}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className="pb-12"
          >
            {freelanceJobs.map((job, index) => {
              const jobUrl = createJobUrl(job);
              const salary =
                job.salary?.min && job.salary?.max
                  ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                  : job.salary?.min
                    ? `From $${job.salary.min.toLocaleString()}`
                    : job.salary?.max
                      ? `Up to $${job.salary.max.toLocaleString()}`
                      : "Negotiable";

              return (
                <SwiperSlide key={job.jobId || job.id || index}>
                  <div
                    className="bg-white rounded-lg shadow-lg overflow-hidden h-72 transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="p-4 flex flex-col h-full">
                      {/* Company logo + name */}
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-6 h-6 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.src = "/images/default-company.png";
                          }}
                        />
                        <span className="text-xs text-gray-500 font-lato truncate">
                          {job.company}
                        </span>
                      </div>

                      {/* Job title */}
                      <Link
                        to={jobUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold font-lato text-gray-950 mb-2 line-clamp-2 hover:underline hover:text-blue-600 transition-colors block"
                      >
                        {job.title}
                      </Link>

                      {/* Salary */}
                      <p className="text-[#46B749] font-medium mb-3 font-lato text-sm">
                        {salary}
                      </p>

                      {/* Category + location */}
                      <div className="mb-3 grow overflow-hidden">
                        {job.category && (
                          <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-lato mb-2">
                            {job.category}
                          </span>
                        )}
                        {job.location && (
                          <p className="text-xs text-gray-400 font-lato truncate">
                            📍 {job.location}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <Link
                        to={jobUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center justify-center cursor-pointer py-2 font-lato bg-[#4EB956] text-white font-medium rounded-lg hover:bg-[#3da745] transition-colors duration-300 mt-auto"
                      >
                        Project Details
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Prev button */}
          <div
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 cursor-pointer bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors duration-300"
            onMouseEnter={() => swiperRef.current?.autoplay.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay.start()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>

          {/* Next button */}
          <div
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 cursor-pointer bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors duration-300"
            onMouseEnter={() => swiperRef.current?.autoplay.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay.start()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreelanceSection;
