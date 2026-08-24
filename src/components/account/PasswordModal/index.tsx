import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import { AccountService, AccountListItem } from '@/services/account.service';
import './style.css';

export interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountListItem;
  onSuccess?: () => void;
}

export function PasswordModal({ isOpen, onClose, account, onSuccess }: PasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setTransactionPassword('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword.trim()) {
      setError('New password is required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New Password and Confirm Password do not match.');
      return;
    }
    if (!transactionPassword.trim()) {
      setError('Transaction password is required.');
      return;
    }

    setSubmitting(true);
    try {
      await AccountService.updatePassword(account.id, {
        newPassword,
        confirmPassword,
        transactionPassword,
      });
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Password"
      position="center"
      maxWidth="md"
      className="password-modal"
      footer={
        <>
          <button type="button" className="password-modal-btn-back" onClick={handleClose}>
            <i className="fa fa-undo"></i> BACK
          </button>
          <button
            type="submit"
            form="password-modal-form"
            className="password-modal-btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'submit'} <i className="fa fa-sign-in-alt"></i>
          </button>
        </>
      }
    >
      <form id="password-modal-form" onSubmit={handleSubmit}>
        <div className="password-modal-field">
          <label className="password-modal-label">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="password-modal-input"
          />
        </div>

        <div className="password-modal-field">
          <label className="password-modal-label">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="password-modal-input"
          />
        </div>

        <div className="password-modal-field">
          <label className="password-modal-label">Transaction Password</label>
          <input
            type="password"
            value={transactionPassword}
            onChange={(e) => setTransactionPassword(e.target.value)}
            className="password-modal-input"
          />
        </div>

        {error && <div className="password-modal-error">{error}</div>}
      </form>
    </Modal>
  );
}

export default PasswordModal;
