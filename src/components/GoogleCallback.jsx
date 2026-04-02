import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback, isLoading } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const result = await handleGoogleCallback();

      if (!result?.success) {
        // If failed, redirect to login after a delay
        setTimeout(() => {
          navigate("/jobseeker/login");
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate, handleGoogleCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f9ff] to-[#eef1ff]">
      <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        {isLoading ? (
          <>
            <div className="w-20 h-20 border-4 border-[#4eb956] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Completing Authentication
            </h2>
            <p className="text-gray-600">
              Please wait while we redirect you...
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
