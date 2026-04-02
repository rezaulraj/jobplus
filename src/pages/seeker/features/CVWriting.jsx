import React, { useState } from "react";
import {
  FiCheck,
  FiMail,
  FiPhone,
  FiFileText,
  FiSearch,
  FiStar,
  FiUsers,
  FiSend,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const CVWriting = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    code: "+880",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const services = [
    {
      icon: <FiUsers size={24} />,
      title: "Partner with a Professional",
      description:
        "Discuss your career concerns with our recruitment expert, and make a stronger first impact on recruiters via your resume.",
    },
    {
      icon: <FiFileText size={24} />,
      title: "Appealing Resume",
      description:
        "Get yourself showcased according to market needs in an appealing format with no spelling or grammatical mistakes.",
    },
    {
      icon: <FiSearch size={24} />,
      title: "Search Optimized CV",
      description:
        "Be the first to be searched with a search optimized resume.",
    },
  ];

  const packages = [
    {
      title: "Early Career",
      price: "70 USD",
      description:
        "Make the most of your opportunities with the Early Career package, designed especially for young professionals & fresh graduates",
      features: [
        "Review & Critique",
        "Editable & PDF File",
        "Optimized JobsPlus Profile",
        "Designed to score with Application Tracking Software (ATS)",
        "Keyword-rich to match job postings",
        "Choose from 2 CV Layouts",
        "1 Revision",
      ],
    },
    {
      title: "Career Evolution",
      price: "90 USD",
      description:
        "Take your career to the next level, with a CV designed to highlight your achievements & experiences",
      features: [
        "Review & Critique",
        "Editable & PDF File",
        "Optimized JobsPlus Profile",
        "Designed to score with Application Tracking Software (ATS)",
        "Keyword-rich to match job postings",
        "Choose from 3 CV Layouts",
        "2 Revisions",
        "High Impact Cover Letter",
      ],
      popular: true,
    },
    {
      title: "Advanced Professional",
      price: "130 USD",
      description:
        "Highlight your managerial skills & accelerate career growth with the Advanced Professional CV bundle",
      features: [
        "Review & Critique",
        "Editable & PDF File",
        "Optimized JobsPlus Profile",
        "Designed to score with Application Tracking Software (ATS)",
        "Keyword-rich to match job postings",
        "Choose from 4 CV Layouts",
        "3 Revisions",
        "High Impact Cover Letter",
        "Personalized Interactions With CV Experts",
      ],
    },
    {
      title: "Senior Executive",
      price: "165 USD",
      description:
        "Showcase your vast experience & leadership qualities to land the HOD or C-Level positions with our Senior Executive CV bundle",
      features: [
        "Review & Critique",
        "Editable & PDF File",
        "Optimized JobsPlus Profile",
        "Designed to score with Application Tracking Software (ATS)",
        "Keyword-rich to match job postings",
        "Choose from 4 CV Layouts",
        "3 Revisions",
        "High Impact Cover Letter",
        "Personalized Interactions With CV Experts",
        "Executive Search Database Inclusion",
        "Discounted Annual CV Updates (Up to 50%)",
      ],
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Send Information",
      description:
        "Let our CV experts know about you! The required information is what you want to be communicated in your resume.",
    },
    {
      number: "02",
      title: "Get a draft",
      description: "Review the first draft of your resume.",
    },
    {
      number: "03",
      title: "Review draft",
      description:
        "Make sure that the resume is according to your liking and everything is mentioned properly.",
    },
    {
      number: "04",
      title: "Final Resume / CV",
      description:
        "Once finalized, you can get the resume to start applying for the jobs.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      text: "The CV writing service transformed my career. I got 3 interview calls within a week!",
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      text: "Professional and efficient service. My CV now stands out from the competition.",
    },
    {
      name: "Emma Wilson",
      role: "HR Director",
      text: "Best investment in my career. The CV helped me land my dream job.",
    },
    {
      name: "David Brown",
      role: "Project Manager",
      text: "Exceptional quality and attention to detail. Highly recommended!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative py-12 lg:py-20 bg-gradient-to-r from-[#1e2558] via-[#4eb956] to-[#1e2558] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="lg:w-1/2">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                  <FiStar className="mr-2" />
                  Professional CV Writing Services
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Showcase Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4eb956] to-white">
                  Skills And
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#4eb956]">
                  Experiences
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                The Right Way before even meeting the employer to make a great
                first impression
              </p>
            </div>

            {/* Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src="/cvwriten.png"
                    alt="Professional CV Writing"
                    className="w-full h-[300px] lg:h-[400px] object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  <div className="absolute top-6 right-6 bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4eb956] to-[#3da844] rounded-lg flex items-center justify-center">
                        <FiCheck className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Success Rate</p>
                        <p className="font-bold text-gray-900">98%</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
                    <p className="text-sm font-medium text-gray-900">
                      "Professional CV writers helping thousands land dream
                      jobs"
                    </p>
                  </div>
                </div>

                <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#4eb956] to-[#3da844] rounded-2xl flex items-center justify-center text-white mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Packages */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our CV Writing Packages
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Choose the perfect package that matches your career level and
              needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border-2 transition-all duration-300 hover:-translate-y-3 ${
                  pkg.popular
                    ? "border-[#4eb956] bg-gradient-to-b from-white to-green-50 shadow-xl relative"
                    : "border-gray-200 bg-white hover:shadow-lg"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-6 py-2 bg-gradient-to-r from-[#4eb956] to-[#3da844] text-white font-semibold rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.title}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-bold text-[#1e2558]">
                      {pkg.price}
                    </span>
                    <span className="text-gray-500">/package</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FiCheck className="text-[#4eb956] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    pkg.popular
                      ? "bg-gradient-to-r from-[#4eb956] to-[#3da844] text-white hover:shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#1e2558] to-[#4eb956] rounded-3xl p-8 md:p-12 text-white mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">How it Works</h2>
              <p className="text-white/90 text-lg max-w-3xl mx-auto">
                Simple 4-step process to get your professional CV
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Contact us to know More About CV Writing Services
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FiMail className="text-[#4eb956]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">
                      Enquiry@jobplus.com.bd
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FiPhone className="text-[#4eb956]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <div className="flex items-center mt-1">
                      <span className="font-semibold text-gray-900">
                        +880 1906-499721
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600">
                Ready to transform your career? Send us a message and we'll get
                back to you within 24 hours.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your message - No more than 2000 characters
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    maxLength="2000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.message.length}/2000 characters
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#4eb956] to-[#3da844] text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FiSend /> Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Client's Testimonials
              </h2>
              <p className="text-gray-600 text-lg">
                What our clients say about our CV writing services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVWriting;
