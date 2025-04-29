import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { ButtonSmallPrimary } from "../ui/Buttons";
import LoadingSpinner from "../ui/LoadingSpinner";
import AuthModal from "../user/AuthModal";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, handleLogout, loading, user } = useContext(AuthContext);

  // 根据用户角色获取默认页面路径
  const getDefaultPage = () => {
    if (!user) return "/";
    switch (user.role) {
      case "respondent":
        return "/ranking-exercise";
      case "manager":
        return "/database-management";
      case "admin":
        return "/study-configuration";
      default:
        return "/guide";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
          dropdown.open = false;
        }
      });
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside); // Clean up event listener
    };
  }, []);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            aria-label="Open menu"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary-content"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Menu</a>
              <ul className="p-2 z-50">
                <li>
                  <Link to="/about" className="text-primary-content">About</Link>
                </li>
                <li>
                  <Link to="/results" className="text-primary-content">Results</Link>
                </li>
                <li>
                  <Link to="/ranking" className="text-primary-content">Ranking</Link>
                </li>
                {isLoggedIn && (
                  <li>
                    <Link to={getDefaultPage()} className="text-primary-content">
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </li>
            <li>
              <Link to="/contact" className="text-primary-content">Contact</Link>
            </li>
          </ul>
        </div>
        <Link 
          to="/" 
          className="btn btn-ghost text-xl text-primary-content hover:bg-primary/10 transition-colors duration-200"
        >
          Claros
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 z-50">
          <li>
            <details className="dropdown">
              <summary className="text-primary-content">Menu</summary>
              <ul className="p-2 z-50">
                <li>
                  <Link to="/about" className="text-primary-content">About</Link>
                </li>
                <li>
                  <Link to="/results" className="text-primary-content">Results</Link>
                </li>
                <li>
                  <Link to="/ranking" className="text-primary-content">Ranking</Link>
                </li>
                {isLoggedIn && (
                  <li>
                    <Link to={getDefaultPage()} className="text-primary-content">
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </details>
          </li>
          <li>
            <Link to="/contact" className="text-primary-content">Contact</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end pr-4">
        {/* If user is not logged in, show login buttons, else show logout button */}
        {!isLoggedIn ? (
          <div className="flex gap-2">
            <ButtonSmallPrimary
              onClick={() => {
                document.getElementById("respondent_login_modal").showModal();
              }}
            >
              Respondent Login
            </ButtonSmallPrimary>
            <ButtonSmallPrimary
              onClick={() => {
                document.getElementById("admin_login_modal").showModal();
              }}
            >
              Admin Login
            </ButtonSmallPrimary>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to={getDefaultPage()} className="text-primary-content hover:text-primary">
              Go to Dashboard
            </Link>
            <ButtonSmallPrimary onClick={handleLogout} disabled={loading}>
              {loading ? <LoadingSpinner /> : "Logout"}
            </ButtonSmallPrimary>
          </div>
        )}
      </div>

      {/* Render the AuthModal */}
      <AuthModal />
    </div>
  );
}

