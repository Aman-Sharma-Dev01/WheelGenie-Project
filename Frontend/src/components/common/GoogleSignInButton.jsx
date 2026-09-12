import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../api/authApi';
import { GoogleIcon } from './SocialIcons';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let scriptPromise = null;

const loadGsiScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load Google Sign-In script'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
};

export default function GoogleSignInButton({ onSuccess, onError }) {
  const { googleLogin } = useAuth();
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const workingRef = useRef(false);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    const handleFocus = () => {
      if (workingRef.current) setWorking(false);
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    if (!CLIENT_ID) return;

    let cancelled = false;

    const handleCredential = async (response) => {
      if (cancelled || !response?.credential) return;
      try {
        await googleLogin(response.credential);
        onSuccessRef.current?.();
      } catch (err) {
        const msg = getApiErrorMessage(err);
        setError(msg);
        onErrorRef.current?.(msg);
      } finally {
        workingRef.current = false;
        if (!cancelled) setWorking(false);
      }
    };

    loadGsiScript()
      .then((google) => {
        if (cancelled) return;
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredential,
          ux_mode: 'popup',
          auto_select: false,
        });
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = getApiErrorMessage(err);
          setError(msg);
          onErrorRef.current?.(msg);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [googleLogin]);

  const handleClick = () => {
    setError('');
    setWorking(true);
    workingRef.current = true;

    const google = window.google;
    if (google?.accounts?.id) {
      google.accounts.id.prompt();
    } else {
      loadGsiScript()
        .then((g) => {
          g.accounts.id.initialize({ client_id: CLIENT_ID, callback: () => {} });
          g.accounts.id.prompt();
        })
        .catch((err) => {
          const msg = getApiErrorMessage(err);
          setError(msg);
          onErrorRef.current?.(msg);
          setWorking(false);
          workingRef.current = false;
        });
    }
  };

  if (!CLIENT_ID) {
    return (
      <div
        className="opacity-40 cursor-not-allowed flex items-center justify-center"
        title="Google Sign-In is not configured (set VITE_GOOGLE_CLIENT_ID)"
      >
        <GoogleIcon className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={working}
        className="wg-mirror-social-btn flex items-center justify-center py-2 px-3 rounded-xl cursor-pointer disabled:opacity-60"
        title="Continue with Google"
      >
        {working ? (
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleIcon className="w-4 h-4" />
        )}
      </button>
      {error && <span className="mt-1 text-[10px] text-red-500 leading-tight text-center">{error}</span>}
    </div>
  );
}