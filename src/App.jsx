import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import axios from "axios";

import Layout from "./components/Layout";
import SeekerLayout from "./layout/SeekerLayout";
import AuthGuard from "./store/AuthGuard";
import ScrollToTop from "./components/ScrollToTop";
import NotFoundPage from "./components/NotFoundPage";

// Public pages
import RootHome from "./pages/roothome/RootHome";
import AllJobs from "./pages/jobs/AllJobs";
import SingleJobDescription from "./pages/jobs/SingleJobDescription";
import FreelanceJobDescription from "./pages/jobs/FreelanceJobDescription";
import Company from "./pages/company/Company";
import FreeCVReview from "./pages/cvreview/FreeCVReview";
import Jobpost from "./pages/post/Jobpost";
import FreelancerJobPost from "./pages/post/FreelancerJobPost";
import Employer from "./pages/post/Employer";

// Auth pages
import JobSeekerAuth from "./components/JobSeekerAuth";
import SeekerSignin from "./components/SeekerSignin";
import EmployerAuth from "./components/EmployerAuth";
import EmployerLogin from "./components/EmployerLogin";
import GoogleCallback from "./components/GoogleCallback";

// Seeker dashboard pages
import SeekerDashboard from "./pages/seeker/SeekerDashboard";
import SeekerProfile from "./pages/seeker/SeekerProfile";
import SeekerCVUpload from "./pages/seeker/SeekerCVUpload";
import SeekerAppliedJobs from "./pages/seeker/SeekerAppliedJobs";
import SeekerShortlisted from "./pages/seeker/SeekerShortlisted";
import SeekerChangePassword from "./pages/seeker/SeekerChangePassword";
import SeekerSaveJobs from "./pages/seeker/SeekerSaveJobs";
import SeekerJobsAlert from "./pages/seeker/SeekerJobsAlert";

// Feature pages
import CVWriting from "./pages/seeker/features/CVWriting";
import CareerTips from "./pages/seeker/features/CareerTips";
import InterviewTips from "./pages/seeker/features/InterviewTips";
import SkillDevelopment from "./pages/seeker/features/SkillDevelopment";

import useAuthStore from "./store/authStore";

function App() {
  const { isAuthenticated, tokens, setAuthHeader } = useAuthStore();

  // ── Sync axios Authorization header whenever token changes ──────────────
  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      setAuthHeader(tokens.accessToken);
    } else {
      setAuthHeader(null);
    }
  }, [isAuthenticated, tokens?.accessToken, setAuthHeader]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!rounded-2xl !shadow-lg !text-sm !font-medium"
      />
      <ScrollToTop />

      <Routes>
        {/* ─── PUBLIC routes (accessible regardless of auth) ─────────────── */}
        {/* We always render public routes; AuthGuard handles gating protected ones */}

        {/* Auth / landing routes — redirect to dashboard if already signed in */}
        <Route
          path="/jobseeker/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/seeker/dashboard" replace />
            ) : (
              <JobSeekerAuth />
            )
          }
        />
        <Route
          path="/jobseeker/login"
          element={
            isAuthenticated ? (
              <Navigate to="/seeker/dashboard" replace />
            ) : (
              <SeekerSignin />
            )
          }
        />
        <Route
          path="/employer/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/seeker/dashboard" replace />
            ) : (
              <EmployerAuth />
            )
          }
        />
        <Route
          path="/employer/login"
          element={
            isAuthenticated ? (
              <Navigate to="/seeker/dashboard" replace />
            ) : (
              <EmployerLogin />
            )
          }
        />

        {/* Google OAuth callback — always public */}
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Public layout routes */}
        <Route
          path="/"
          element={isAuthenticated ? <SeekerLayout /> : <Layout />}
        >
          <Route index element={<RootHome />} />

          {/* Jobs — public & authenticated */}
          <Route path="jobs" element={<AllJobs />} />
          <Route path="jobs/:cate" element={<AllJobs />} />
          <Route path="job/:id" element={<SingleJobDescription />} />
          <Route
            path="freelance/:jobId"
            element={<FreelanceJobDescription />}
          />
          <Route path="companys" element={<Company />} />
          <Route path="cv-review" element={<FreeCVReview />} />
          <Route path="employer" element={<Employer />} />

          {/* Public post routes */}
          <Route path="employers/post-job" element={<Jobpost />} />
          <Route path="freelancer/post-job" element={<FreelancerJobPost />} />
        </Route>

        {/* ─── PROTECTED routes (wrapped in AuthGuard) ───────────────────── */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<SeekerLayout />}>
            {/* Seeker pages */}
            <Route path="seeker/dashboard" element={<SeekerDashboard />} />
            <Route path="seeker/profile" element={<SeekerProfile />} />
            <Route path="seeker/cv-upload" element={<SeekerCVUpload />} />
            <Route path="seeker/saved-jobs" element={<SeekerSaveJobs />} />
            <Route path="seeker/applied-jobs" element={<SeekerAppliedJobs />} />
            <Route path="seeker/shortlisted" element={<SeekerShortlisted />} />
            <Route path="seeker/job-alerts" element={<SeekerJobsAlert />} />
            <Route
              path="seeker/change-password"
              element={<SeekerChangePassword />}
            />

            {/* Feature pages */}
            <Route path="features/cv-writing" element={<CVWriting />} />
            <Route path="features/career-tips" element={<CareerTips />} />
            <Route path="features/interview-tips" element={<InterviewTips />} />
            <Route
              path="features/skill-development"
              element={<SkillDevelopment />}
            />
          </Route>
        </Route>

        {/* ─── Catch-all ─────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
