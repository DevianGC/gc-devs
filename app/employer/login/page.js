'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../../../lib/firebaseClient';
import Link from 'next/link';
import styles from './login.module.css';
import FormInput from '../../../components/UI/FormInput/FormInput';
import Button from '../../../components/UI/Button/Button';
import { getAuthConfig, getNavConfig, getValidationConfig } from '../../../utils/config';

export default function EmployerLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const validationConfig = getValidationConfig();

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validationConfig.email.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const navConfig = getNavConfig();
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
      const idToken = await cred.user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      // Check if user is actually an employer
      try {
        const meRes = await fetch('/api/me', { cache: 'no-store' });
        if (meRes.ok) {
          const me = await meRes.json();
          const role = me?.user?.role || me?.profile?.role;
          if (role === 'employer') {
            window.location.href = '/dashboard/employer';
          } else {
            setErrors({ general: 'Access denied. This login is for employers only.' });
            return;
          }
        } else {
          setErrors({ general: 'Unable to verify account. Please try again.' });
          return;
        }
      } catch {
        setErrors({ general: 'Unable to verify account. Please try again.' });
        return;
      }
    } catch (error) {
      setErrors({ general: error.message || 'Login failed' });
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Employer Login</h1>
            <p className={styles.loginSubtitle}>
              Sign in to your employer account to manage job postings and applications
            </p>
          </div>

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <FormInput
              label="Company Email Address"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
              placeholder="company@example.com"
            />

            <FormInput
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={errors.password}
            />

            <div className={styles.forgotPassword}>
              <Link href="/employer/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Login to Employer Portal
            </Button>
            {errors.general && <div className={styles.errorText}>{errors.general}</div>}
          </form>

          <div className={styles.loginFooter}>
            <p>
              Don't have an employer account?{' '}
              <Link href="/employer/register" className={styles.registerLink}>
                Register your company
              </Link>
            </p>
            <div className={styles.otherLogins}>
              <p className={styles.otherLoginLink}>
                <Link href="/login">
                  Student/Alumni Login
                </Link>
              </p>
              <p className={styles.otherLoginLink}>
                <Link href="/career-office/login">
                  Career Office Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
