import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../firebase";
import type { Scenario } from "../types/scenario";
import { AdminLogin } from "./AdminLogin";
import { AdminScenarioManager } from "./AdminScenarioManager";
import "./AdminAuth.css";

type AdminAreaProps = {
  scenarios: Scenario[];
  onScenariosChange: (scenarios: Scenario[]) => void;
  onClose: () => void;
  onResetToDefaults: () => void;
};

export function AdminArea({
  scenarios,
  onScenariosChange,
  onClose,
  onResetToDefaults,
}: AdminAreaProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    setLogoutError("");

    try {
      await signOut(auth);
    } catch {
      setLogoutError("ログアウトできませんでした。もう一度お試しください。");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="screen admin-login-screen">
        <div className="admin-auth-loading" role="status">
          ログイン状態を確認しています…
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLogin onCancel={onClose} />;
  }

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-session-bar">
        <div className="admin-session-information">
          <span className="admin-session-mark">✓</span>

          <div>
            <strong>ログイン中</strong>

            <small>{currentUser.email ?? "大人用アカウント"}</small>
          </div>
        </div>

        <button
          className="admin-logout-button"
          type="button"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </div>

      {logoutError && (
        <div className="admin-error-message" role="alert">
          {logoutError}
        </div>
      )}

      <AdminScenarioManager
        scenarios={scenarios}
        onScenariosChange={onScenariosChange}
        onClose={onClose}
        onResetToDefaults={onResetToDefaults}
      />
    </div>
  );
}
