import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import freelanceJobs from "../../data/freelanceJob.json";
import { Link, useNavigate } from "react-router-dom";

const FreelanceSection = () => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  const createJobUrl = (job) => {
    if (!job || !job.title) return "/freelance";

    const slug = job.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);

    return `/freelance/${slug}-${job.id}`;
  };

  const handleJobClick = (job) => {
    const url = createJobUrl(job);
    navigate(url);
  };

  const handleViewAll = () => {
    navigate("/jobs");
  };

  const handleHireFreelancer = () => {
    navigate("/freelancer/post-job");
  };

  return (
    <section className="py-8 bg-gray-100 hidden md:block font-source">
      <div className="container mx-auto px-4">
        <div className="border-b border-gray-300 mb-4 flex items-center justify-center">
          <h2 className="flex-1 text-xl lg:text-2xl font-bold text-center mb-8 text-gray-700 ">
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
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className="pb-12"
          >
            {freelanceJobs.map((job, index) => {
              const jobUrl = createJobUrl(job);

              return (
                <SwiperSlide key={job.id || index}>
                  <div
                    className="bg-white rounded-lg shadow-lg overflow-hidden h-72 transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="p-4 flex flex-col h-full">
                      {/* Job Title with Link */}
                      <Link
                        to={jobUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold font-lato text-gray-950 mb-2 line-clamp-1 hover:underline hover:text-blue-600 transition-colors block"
                      >
                        {job.title}
                      </Link>

                      <p className="text-gray-600 mb-3 font-lato">
                        {job.company}
                      </p>

                      <p className="text-[#46B749] font-medium mb-4 font-lato">
                        {job.rate}
                      </p>

                      <div className="mb-4 grow overflow-y-auto">
                        <h4 className="text-[15px] font-medium text-gray-500 mb-2 font-lato">
                          Skills Required:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills?.slice(0, 3).map(
                            (skill, skillIndex) =>
                              skill && (
                                <span
                                  key={skillIndex}
                                  className="px-3 py-1 font-lato bg-blue-100 text-blue-800 text-xs rounded-full transition-colors"
                                >
                                  {skill}
                                </span>
                              )
                          )}
                        </div>
                      </div>

                      {/* Project Details Link */}
                      <Link
                        to={jobUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center justify-center cursor-pointer py-2 font-lato bg-[#4EB956] text-white font-medium rounded-lg hover:bg-[#3da745] transition-colors duration-300 mt-auto group-hover:bg-gray-800"
                      >
                        Project Details
                      </Link>
                    </div>

                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 cursor-pointer bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors duration-300 swiper-button-prev-custom"
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

          <div
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 cursor-pointer bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors duration-300 swiper-button-next-custom"
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
