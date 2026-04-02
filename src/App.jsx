import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import RootHome from "./pages/roothome/RootHome";
import UnderDevelopment from "./components/UnderDevelopment";
import AllJobs from "./pages/jobs/AllJobs";
import FreelanceJobDescription from "./pages/jobs/FreelanceJobDescription";
import ScrollToTop from "./components/ScrollToTop";
import SingleJobDescription from "./pages/jobs/SingleJobDescription";
import JobSeekerAuth from "./components/JobSeekerAuth";
import SeekerSignin from "./components/SeekerSignin";
import EmployerAuth from "./components/EmployerAuth";
import EmployerLogin from "./components/EmployerLogin";
import Jobpost from "./pages/post/Jobpost";
import FreelancerJobPost from "./pages/post/FreelancerJobPost";
import Employer from "./pages/post/Employer";
import Company from "./pages/company/Company";
import NotFoundPage from "./components/NotFoundPage";
import SeekerLayout from "./layout/SeekerLayout";
import AuthGuard from "./store/AuthGuard";
import SeekerDashboard from "./pages/seeker/SeekerDashboard";
import SeekerProfile from "./pages/seeker/SeekerProfile";
import SeekerCVUpload from "./pages/seeker/SeekerCVUpload";
import SeekerAppliedJobs from "./pages/seeker/SeekerAppliedJobs";
import SeekerShortlisted from "./pages/seeker/SeekerShortlisted";
import SeekerChangePassword from "./pages/seeker/SeekerChangePassword";
import CVWriting from "./pages/seeker/features/CVWriting";
import CareerTips from "./pages/seeker/features/CareerTips";
import InterviewTips from "./pages/seeker/features/InterviewTips";
import SkillDevelopment from "./pages/seeker/features/SkillDevelopment";
import SeekerSaveJobs from "./pages/seeker/SeekerSaveJobs";
import SeekerJobsAlert from "./pages/seeker/SeekerJobsAlert";
import FreeCVReview from "./pages/cvreview/FreeCVReview";
import GoogleCallback from "./components/GoogleCallback";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const { isAuthenticated, tokens } = useAuthStore();

  // Set axios default header when token changes
  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${tokens.accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [isAuthenticated, tokens]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ScrollToTop />
      <Routes>
        {/* Public routes - only accessible when NOT authenticated */}
        {!isAuthenticated ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<RootHome />} />
            <Route path="jobs" element={<AllJobs />} />
            <Route path="jobs/:cate" element={<AllJobs />} />
            <Route path="job/:id" element={<SingleJobDescription />} />
            <Route
              path="freelance/:jobId"
              element={<FreelanceJobDescription />}
            />
            <Route path="companys" element={<Company />} />
            <Route path="cv-review" element={<FreeCVReview />} />

            {/* Auth routes */}
            <Route path="jobseeker/signup" element={<JobSeekerAuth />} />
            <Route path="jobseeker/login" element={<SeekerSignin />} />
            <Route path="employer/signup" element={<EmployerAuth />} />
            <Route path="employer/login" element={<EmployerLogin />} />

            {/* Google OAuth callback */}
            <Route path="auth/google/callback" element={<GoogleCallback />} />

            {/* Public post job routes */}
            <Route path="employers/post-job" element={<Jobpost />} />
            <Route path="freelancer/post-job" element={<FreelancerJobPost />} />
            <Route path="employer" element={<Employer />} />

            {/* 404 for public routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        ) : (
          /* Protected routes - only accessible when authenticated */
          <Route element={<AuthGuard />}>
            <Route path="/" element={<SeekerLayout />}>
              <Route index element={<RootHome />} />
              <Route path="seeker/dashboard" element={<SeekerDashboard />} />

              {/* Jobs routes - still accessible but now within protected layout */}
              <Route path="jobs">
                <Route index element={<AllJobs />} />
                <Route path=":cate" element={<AllJobs />} />
              </Route>

              <Route path="job/:id" element={<SingleJobDescription />} />
              <Route
                path="freelance/:jobId"
                element={<FreelanceJobDescription />}
              />
              <Route path="companys" element={<Company />} />
              <Route path="cv-review" element={<FreeCVReview />} />

              {/* Seeker dashboard routes */}
              <Route path="seeker">
                <Route path="dashboard" element={<SeekerDashboard />} />
                <Route path="profile" element={<SeekerProfile />} />
                <Route path="cv-upload" element={<SeekerCVUpload />} />
                <Route path="saved-jobs" element={<SeekerSaveJobs />} />
                <Route path="applied-jobs" element={<SeekerAppliedJobs />} />
                <Route path="shortlisted" element={<SeekerShortlisted />} />
                <Route path="job-alerts" element={<SeekerJobsAlert />} />
                <Route
                  path="change-password"
                  element={<SeekerChangePassword />}
                />
              </Route>

              {/* Features routes */}
              <Route path="features">
                <Route path="cv-writing" element={<CVWriting />} />
                <Route path="career-tips" element={<CareerTips />} />
                <Route path="interview-tips" element={<InterviewTips />} />
                <Route
                  path="skill-development"
                  element={<SkillDevelopment />}
                />
              </Route>

              {/* Employer routes within authenticated section */}
              <Route path="employer" element={<Employer />}>
                <Route
                  path="dashboard"
                  element={<div>Employer Dashboard</div>}
                />
                <Route path="post-job" element={<Jobpost />} />
                <Route
                  path="freelancer/post-job"
                  element={<FreelancerJobPost />}
                />
              </Route>

              {/* Redirect auth routes to dashboard if accessed while authenticated */}
              <Route
                path="jobseeker/signup"
                element={<Navigate to="/seeker/dashboard" replace />}
              />
              <Route
                path="jobseeker/login"
                element={<Navigate to="/seeker/dashboard" replace />}
              />
              <Route
                path="employer/signup"
                element={<Navigate to="/employer/dashboard" replace />}
              />
              <Route
                path="employer/login"
                element={<Navigate to="/employer/dashboard" replace />}
              />

              {/* Catch all for protected routes */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        )}

        {/* Final fallback - only used when no routes match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
