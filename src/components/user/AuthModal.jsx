import { useState, useContext } from "react";
import Login from "./login/login";
import Register from "./register/register";
import { AuthContext } from "../../context/AuthProvider";

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { setIsLoggedIn } = useContext(AuthContext);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {/* Respondent Login Modal */}
      <dialog id="respondent_login_modal" className="modal">
        <div className="modal-box relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("respondent_login_modal").close()}
          >
            ✕
          </button>
          {isLogin ? (
            <Login 
              userType="respondent" 
              toggle={toggleForm} 
              setIsLoggedIn={setIsLoggedIn} 
            />
          ) : (
            <Register toggle={toggleForm} />
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Admin Login Modal */}
      <dialog id="admin_login_modal" className="modal">
        <div className="modal-box relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("admin_login_modal").close()}
          >
            ✕
          </button>
          {isLogin ? (
            <Login 
              userType="admin" 
              toggle={toggleForm} 
              setIsLoggedIn={setIsLoggedIn} 
            />
          ) : (
            <Register toggle={toggleForm} />
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AuthModal;
