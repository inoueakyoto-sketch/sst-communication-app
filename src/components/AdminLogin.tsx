import { useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

type AdminLoginProps = {
  onCancel: () => void;
};

function getErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "ログインできませんでした。もう一度お試しください。";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "メールアドレスの形式を確認してください。";

    case "auth/invalid-credential":
      return "メールアドレスまたはパスワードが違います。";

    case "auth/too-many-requests":
      return "ログインの試行回数が多すぎます。少し時間をおいてください。";

    case "auth/network-request-failed":
      return "通信できませんでした。インターネット接続を確認してください。";

    default:
      return "ログインできませんでした。入力内容を確認してください。";
  }
}

export function AdminLogin({ onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setErrorMessage("メールアドレスとパスワードを入力してください。");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="screen admin-login-screen">
      <div className="admin-login-heading">
        <p className="admin-label">おとな画面</p>

        <h2>ログイン</h2>

        <p>登録されている大人用アカウントで ログインしてください。</p>
      </div>

      <form className="admin-login-card" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="admin-error-message" role="alert">
            {errorMessage}
          </div>
        )}

        <label className="admin-field">
          <span>メールアドレス</span>

          <input
            type="email"
            value={email}
            autoComplete="username"
            placeholder="example@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>パスワード</span>

          <input
            type="password"
            value={password}
            autoComplete="current-password"
            placeholder="パスワードを入力"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <div className="admin-login-actions">
          <button
            className="secondary-button"
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            もどる
          </button>

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ログイン中…" : "ログイン"}
          </button>
        </div>
      </form>

      <p className="admin-login-note">
        アカウントの新規登録は、この画面からは できません。
      </p>
    </div>
  );
}
