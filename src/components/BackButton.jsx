import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    const canGoBack = window.history.state?.idx > 0;

    navigate(canGoBack ? -1 : "/dashboard");
  };

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition duration-200 ease-out hover:-translate-y-[1px] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      onClick={handleBack}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center text-slate-700">
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path d="M10.707 14.707a1 1 0 0 1-1.414 0L4.586 10l4.707-4.707a1 1 0 1 1 1.414 1.414L7.414 10l3.293 3.293a1 1 0 0 1 0 1.414z" />
        </svg>
      </span>
      Back
    </button>
  );
};

export default BackButton;
