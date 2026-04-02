import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaChartLine,
  FaMobile,
  FaCloud,
  FaShieldAlt,
  FaDatabase,
  FaRobot,
  FaBrain,
  FaPencilRuler,
  FaCamera,
  FaMusic,
  FaVideo as FaVideoIcon,
  FaPenFancy,
  FaBullhorn,
  FaShoppingCart,
  FaChartBar,
  FaProjectDiagram,
  FaLanguage,
  FaUsers,
  FaHandshake,
  FaRegClock,
  FaRocket,
  FaStar,
  FaDownload,
  FaBookOpen,
  FaPlayCircle,
  FaCertificate,
  FaArrowRight,
  FaCheckCircle,
  FaRegLightbulb,
  FaRegGem,
  FaRegSmile,
  FaGraduationCap,
  FaLaptopCode,
  FaPalette,
  FaCalculator,
} from "react-icons/fa";

const SkillDevelopment = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState(null);

  const categories = [
    { id: "all", name: "All Skills", icon: FaStar },
    { id: "technical", name: "Technical Skills", icon: FaLaptopCode },
    { id: "creative", name: "Creative Skills", icon: FaPalette },
    { id: "business", name: "Business Skills", icon: FaChartLine },
    { id: "soft", name: "Soft Skills", icon: FaUsers },
  ];

  const skills = [
    // Technical Skills
    {
      id: 1,
      category: "technical",
      icon: <FaCode className="w-6 h-6" />,
      title: "Web Development",
      description:
        "Master modern web development with HTML, CSS, JavaScript, React, Node.js, and more.",
      level: "Beginner to Advanced",
      duration: "6-12 months",
      resources: 45,
      students: "15k+",
      rating: 4.8,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    },
    {
      id: 2,
      category: "technical",
      icon: <FaMobile className="w-6 h-6" />,
      title: "Mobile App Development",
      description:
        "Build iOS and Android apps with React Native, Flutter, or native development.",
      level: "Intermediate",
      duration: "4-8 months",
      resources: 32,
      students: "10k+",
      rating: 4.7,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    },
    {
      id: 3,
      category: "technical",
      icon: <FaCloud className="w-6 h-6" />,
      title: "Cloud Computing",
      description:
        "Learn AWS, Azure, Google Cloud, and modern cloud architecture.",
      level: "Intermediate to Advanced",
      duration: "3-6 months",
      resources: 28,
      students: "8k+",
      rating: 4.9,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: ["AWS", "Azure", "Docker", "Kubernetes", "DevOps"],
    },
    {
      id: 4,
      category: "technical",
      icon: <FaDatabase className="w-6 h-6" />,
      title: "Data Science",
      description:
        "Master data analysis, machine learning, and statistical modeling.",
      level: "Intermediate",
      duration: "6-12 months",
      resources: 52,
      students: "12k+",
      rating: 4.8,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: ["Python", "SQL", "Machine Learning", "Tableau", "Statistics"],
    },
    {
      id: 5,
      category: "technical",
      icon: <FaRobot className="w-6 h-6" />,
      title: "Artificial Intelligence",
      description:
        "Dive into AI, neural networks, deep learning, and natural language processing.",
      level: "Advanced",
      duration: "8-12 months",
      resources: 38,
      students: "6k+",
      rating: 4.9,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    },
    {
      id: 6,
      category: "technical",
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Cybersecurity",
      description:
        "Learn ethical hacking, network security, and information security.",
      level: "Intermediate",
      duration: "4-8 months",
      resources: 25,
      students: "5k+",
      rating: 4.7,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: [
        "Network Security",
        "Ethical Hacking",
        "Cryptography",
        "Risk Management",
      ],
    },

    // Creative Skills
    {
      id: 7,
      category: "creative",
      icon: <FaPencilRuler className="w-6 h-6" />,
      title: "UI/UX Design",
      description:
        "Create beautiful and functional user interfaces with modern design tools.",
      level: "Beginner to Advanced",
      duration: "3-6 months",
      resources: 42,
      students: "9k+",
      rating: 4.8,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: ["Figma", "Adobe XD", "Sketch", "Wireframing", "Prototyping"],
    },
    {
      id: 8,
      category: "creative",
      icon: <FaCamera className="w-6 h-6" />,
      title: "Photography",
      description:
        "Master composition, lighting, and post-processing techniques.",
      level: "All Levels",
      duration: "2-4 months",
      resources: 35,
      students: "7k+",
      rating: 4.6,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: ["Composition", "Lighting", "Editing", "Portrait", "Landscape"],
    },
    {
      id: 9,
      category: "creative",
      icon: <FaVideoIcon className="w-6 h-6" />,
      title: "Video Editing",
      description:
        "Edit professional videos with Premiere Pro, Final Cut, or DaVinci Resolve.",
      level: "Beginner to Advanced",
      duration: "3-6 months",
      resources: 30,
      students: "8k+",
      rating: 4.7,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: [
        "Premiere Pro",
        "After Effects",
        "Color Grading",
        "Sound Design",
      ],
    },
    {
      id: 10,
      category: "creative",
      icon: <FaMusic className="w-6 h-6" />,
      title: "Music Production",
      description: "Create and produce music with industry-standard tools.",
      level: "Intermediate",
      duration: "4-8 months",
      resources: 28,
      students: "4k+",
      rating: 4.8,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: ["Ableton", "FL Studio", "Sound Design", "Mixing", "Mastering"],
    },

    // Business Skills
    {
      id: 11,
      category: "business",
      icon: <FaBullhorn className="w-6 h-6" />,
      title: "Digital Marketing",
      description:
        "Master SEO, social media, content marketing, and analytics.",
      level: "All Levels",
      duration: "3-6 months",
      resources: 48,
      students: "20k+",
      rating: 4.8,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: [
        "SEO",
        "Social Media",
        "Content Marketing",
        "Analytics",
        "Email Marketing",
      ],
    },
    {
      id: 12,
      category: "business",
      icon: <FaShoppingCart className="w-6 h-6" />,
      title: "E-commerce",
      description: "Build and grow successful online stores and marketplaces.",
      level: "Beginner to Advanced",
      duration: "2-4 months",
      resources: 32,
      students: "15k+",
      rating: 4.7,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: [
        "Shopify",
        "WooCommerce",
        "Product Management",
        "Customer Service",
      ],
    },
    {
      id: 13,
      category: "business",
      icon: <FaChartBar className="w-6 h-6" />,
      title: "Business Analytics",
      description: "Analyze data to make better business decisions.",
      level: "Intermediate",
      duration: "3-6 months",
      resources: 38,
      students: "11k+",
      rating: 4.8,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: ["Excel", "SQL", "Tableau", "Power BI", "Statistics"],
    },
    {
      id: 14,
      category: "business",
      icon: <FaProjectDiagram className="w-6 h-6" />,
      title: "Project Management",
      description:
        "Lead projects effectively with agile and traditional methodologies.",
      level: "Intermediate",
      duration: "2-4 months",
      resources: 42,
      students: "18k+",
      rating: 4.9,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: ["Agile", "Scrum", "Jira", "Risk Management", "Leadership"],
    },

    // Soft Skills
    {
      id: 15,
      category: "soft",
      icon: <FaLanguage className="w-6 h-6" />,
      title: "Communication Skills",
      description: "Improve verbal, written, and interpersonal communication.",
      level: "All Levels",
      duration: "1-3 months",
      resources: 25,
      students: "25k+",
      rating: 4.8,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: [
        "Public Speaking",
        "Writing",
        "Active Listening",
        "Presentation",
      ],
    },
    {
      id: 16,
      category: "soft",
      icon: <FaUsers className="w-6 h-6" />,
      title: "Leadership",
      description: "Develop skills to lead teams and inspire others.",
      level: "Intermediate",
      duration: "2-4 months",
      resources: 35,
      students: "15k+",
      rating: 4.9,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: [
        "Team Management",
        "Decision Making",
        "Coaching",
        "Conflict Resolution",
      ],
    },
    {
      id: 17,
      category: "soft",
      icon: <FaHandshake className="w-6 h-6" />,
      title: "Negotiation Skills",
      description: "Learn to negotiate effectively in business and life.",
      level: "Intermediate",
      duration: "1-2 months",
      resources: 22,
      students: "10k+",
      rating: 4.7,
      color: "from-[#1e2558] to-[#4eb956]",
      skills: ["Persuasion", "Strategy", "Communication", "Problem Solving"],
    },
    {
      id: 18,
      category: "soft",
      icon: <FaRegClock className="w-6 h-6" />,
      title: "Time Management",
      description: "Master productivity and prioritization techniques.",
      level: "All Levels",
      duration: "1 month",
      resources: 28,
      students: "30k+",
      rating: 4.8,
      color: "from-[#4eb956] to-[#1e2558]",
      skills: ["Prioritization", "Planning", "Focus", "Goal Setting"],
    },
  ];

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  const learningPaths = [
    {
      title: "Web Development Path",
      icon: FaCode,
      steps: ["HTML/CSS", "JavaScript", "React", "Node.js", "Full Stack"],
      duration: "8 months",
      jobs: ["Frontend Dev", "Backend Dev", "Full Stack Dev"],
    },
    {
      title: "Data Science Path",
      icon: FaDatabase,
      steps: [
        "Python",
        "Statistics",
        "Machine Learning",
        "Deep Learning",
        "AI",
      ],
      duration: "10 months",
      jobs: ["Data Analyst", "Data Scientist", "ML Engineer"],
    },
    {
      title: "Digital Marketing Path",
      icon: FaBullhorn,
      steps: ["SEO", "Social Media", "Content", "Analytics", "Strategy"],
      duration: "6 months",
      jobs: ["SEO Specialist", "Social Media Manager", "Marketing Manager"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#4eb956]/5">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#1e2558]/5 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4eb956]/5 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-96 h-96 bg-[#1e2558]/5 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e2558] to-[#4eb956] rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-[#1e2558] to-[#4eb956] p-6 rounded-full">
                <FaGraduationCap className="w-16 h-16 text-white" />
              </div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1e2558] to-[#4eb956]">
              Skill Development
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Master in-demand skills, advance your career, and stay competitive
            in today's job market. Choose from hundreds of courses and learning
            paths.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { number: "100+", label: "Skills", icon: FaStar },
              { number: "50k+", label: "Students", icon: FaUsers },
              { number: "4.8★", label: "Avg Rating", icon: FaRegSmile },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white px-6 py-4 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="w-6 h-6 text-[#4eb956]" />
                  <div>
                    <div className="text-2xl font-bold text-[#1e2558]">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-md"
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <AnimatePresence>
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedSkill(skill)}
                className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
              >
                <div
                  className={`bg-gradient-to-r ${skill.color} p-6 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <div className="text-white">{skill.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {skill.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-sm">
                          {skill.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {skill.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Level:</span>
                      <span className="font-semibold text-[#1e2558]">
                        {skill.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-semibold text-[#1e2558]">
                        {skill.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Students:</span>
                      <span className="font-semibold text-[#1e2558]">
                        {skill.students}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {skill.skills.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="bg-[#4eb956]/10 text-[#4eb956] text-xs px-2 py-1 rounded"
                      >
                        {s}
                      </span>
                    ))}
                    {skill.skills.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{skill.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaBookOpen className="w-4 h-4 text-[#4eb956]" />
                      <span>{skill.resources} resources</span>
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-[#1e2558] font-semibold flex items-center gap-1 group-hover:text-[#4eb956] transition-colors"
                    >
                      Learn More
                      <FaArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-[#1e2558] mb-12">
            Popular <span className="text-[#4eb956]">Learning Paths</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <div className="bg-[#4eb956]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <path.icon className="w-8 h-8 text-[#1e2558]" />
                </div>

                <h3 className="text-xl font-bold text-[#1e2558] mb-4">
                  {path.title}
                </h3>

                <div className="space-y-3 mb-6">
                  {path.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#4eb956]/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-[#1e2558]">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-gray-700">{step}</span>
                      {i < path.steps.length - 1 && (
                        <FaArrowRight className="w-3 h-3 text-gray-400 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-semibold text-[#1e2558]">
                      {path.duration}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Career Paths:</span>
                    <span className="font-semibold text-[#4eb956]">
                      {path.jobs.length} roles
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Start Learning Path
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Resources */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          <div className="bg-gradient-to-br from-[#1e2558]/5 to-[#4eb956]/5 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#4eb956] p-3 rounded-xl">
                <FaPlayCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1e2558]">
                Video Tutorials
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Access thousands of video tutorials from industry experts. Learn
              at your own pace with high-quality content.
            </p>
            <div className="space-y-4">
              {[
                "Beginner to Advanced Courses",
                "Project-Based Learning",
                "Downloadable Resources",
                "Certificate of Completion",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[#4eb956]" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#4eb956]/5 to-[#1e2558]/5 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#1e2558] p-3 rounded-xl">
                <FaCertificate className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1e2558]">
                Certifications
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Earn recognized certifications to validate your skills and boost
              your resume.
            </p>
            <div className="space-y-4">
              {[
                "Industry Recognized",
                "Share on LinkedIn",
                "Employer Valued",
                "Lifetime Access",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[#4eb956]" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-[#1e2558] to-[#4eb956] rounded-3xl p-12 text-center text-white"
        >
          <FaRocket className="w-16 h-16 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and take your skills to the next level.
            Start your learning journey today!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-[#1e2558] rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              Browse All Skills
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Take Assessment
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className={`bg-gradient-to-r ${selectedSkill.color} p-8`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-white text-3xl">
                      {selectedSkill.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {selectedSkill.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span>{selectedSkill.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{selectedSkill.students} students</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-700 text-lg mb-6">
                  {selectedSkill.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500">Level</span>
                    <p className="font-semibold text-[#1e2558]">
                      {selectedSkill.level}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500">Duration</span>
                    <p className="font-semibold text-[#1e2558]">
                      {selectedSkill.duration}
                    </p>
                  </div>
                </div>

                <h4 className="font-bold text-[#1e2558] mb-3">
                  Skills You'll Learn
                </h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedSkill.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-[#4eb956]/10 text-[#4eb956] px-3 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <h4 className="font-bold text-[#1e2558] mb-3">
                  Learning Resources
                </h4>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaBookOpen className="w-5 h-5 text-[#4eb956]" />
                      <span>Video Tutorials</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e2558]">
                      24 videos
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaDownload className="w-5 h-5 text-[#4eb956]" />
                      <span>Practice Exercises</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e2558]">
                      15 exercises
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaCertificate className="w-5 h-5 text-[#4eb956]" />
                      <span>Projects</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e2558]">
                      3 projects
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white rounded-xl font-semibold"
                  >
                    Start Learning
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedSkill(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-float {
          animation: float 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SkillDevelopment;
