import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { useLoginMutation } from '@/store/slices/apiSlice';
import './login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    let hasError = false;
    if (!username.trim()) {
      setUsernameError('The username field is required');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!password.trim()) {
      setPasswordError('The password field is required');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    try {
      const res = await login({
        username: username.trim(),
        password: password.trim(),
      }).unwrap();
      dispatch(setUser({ user: res.user, token: res.token }));
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
      navigate(from || '/', { replace: true });
    } catch (err: any) {
      setApiError(err?.data?.message || err?.error || 'Invalid username or password.');
    }
  };

  const handleUsernameBlur = () => {
    if (!username.trim()) {
      setUsernameError('The username field is required');
    }
  };

  const handlePasswordBlur = () => {
    if (!password.trim()) {
      setPasswordError('The password field is required');
    }
  };

  return (
    <section className="login-mn">
      <div className='login-form-inner'>
        <div className="log-logo m-b-20">
          <img
            src="/assets/logo/logo.png"
            alt="RICEEXCH"
            style={{ maxWidth: '250px', maxHeight: '100px' }}
          />
        </div>
        <div className="log-fld">
          <h2 className="text-center">Sign In</h2>
          <form
            autoComplete="off"
            data-vv-scope="form-login"
            onSubmit={handleLogin}
            noValidate
            className="form-horizontal"
          >
            {apiError && (
              <div className="api-error-alert text-center mb-3">
                {apiError}
              </div>
            )}

            <div id="input-group-1" role="group" className="form-group">
              <div>
                <input
                  id="input-1"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (e.target.value.trim()) setUsernameError('');
                  }}
                  onBlur={handleUsernameBlur}
                  className="form-control"
                />
                {usernameError && (
                  <span className="field-error-msg">{usernameError}</span>
                )}
              </div>
            </div>

            <div id="input-group-2" role="group" className="form-group">
              <div>
                <input
                  id="input-2"
                  name="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.trim()) setPasswordError('');
                  }}
                  onBlur={handlePasswordBlur}
                  className="form-control form-control"
                />
                {passwordError && (
                  <span className="field-error-msg">{passwordError}</span>
                )}
              </div>
            </div>

            <div className="form-group text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-submit btn-login btn-secondary"
              >
                <span>{isLoading ? 'Signing In...' : 'Login'}</span>
                <i className="fas fa-sign-in-alt ml-2.5 text-[12px]"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
