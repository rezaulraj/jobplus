import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link, useNavigate } from "react-router-dom";
import useJobStore from "../../store/jobStore";

const FreelanceSection = () => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  const { fetchJobTypes, fetchJobsByJobType, jobs, jobTypes, isLoading } =
    useJobStore();
  const [freelanceJobs, setFreelanceJobs] = useState([]);

  useEffect(() => {
    const loadFreelanceJobs = async () => {
      // Fetch job types to find the Freelance type ID
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

        if (result?.success && result?.data) {
          setFreelanceJobs(result.data);
        }
      }
    };

    loadFreelanceJobs();
  }, []);

  const createJobUrl = (job) => {
    if (!job || !job.title) return "/freelance";
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

  if (isLoading && freelanceJobs.length === 0) {
    return (
      <section className="py-8 bg-gray-100 hidden md:block font-source">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        </div>
      </section>
    );
  }

  if (!isLoading && freelanceJobs.length === 0) return null;

  return (
    <section className="py-8 bg-gray-100 hidden md:block font-source">
      <div className="container mx-auto px-4">
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
                      {/* Company Logo + Name */}
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

                      {/* Job Title */}
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

                      {/* Category + Location */}
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

                      {/* CTA Button */}
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

          {/* Prev Button */}
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

          {/* Next Button */}
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
