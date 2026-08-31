import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import { AccountService, AccountListItem } from '@/services/account.service';
import './style.css';

export interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountListItem;
  onSuccess?: () => void;
}

export function ChangeStatusModal({ isOpen, onClose, account, onSuccess }: ChangeStatusModalProps) {
  const [userActive, setUserActive] = useState(account.ust ?? true);
  const [betActive, setBetActive] = useState(account.bst ?? true);
  const [transactionPassword, setTransactionPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setTransactionPassword('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!transactionPassword.trim()) {
      setError('Transaction password is required.');
      return;
    }

    setSubmitting(true);
    try {
      await AccountService.updateStatus(account.id, {
        isActive: userActive,
        betStatus: betActive,
        transactionPassword,
      });
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Status"
      position="top"
      maxWidth="md"
      className="change-status-modal"
      footer={
        <>
          <button type="button" className="change-status-modal-btn-back" onClick={handleClose}>
            <i className="fa fa-undo"></i> BACK
          </button>
          <button
            type="submit"
            form="change-status-modal-form"
            className="change-status-modal-btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'submit'} <i className="fa fa-sign-in-alt"></i>
          </button>
        </>
      }
    >
      <form id="change-status-modal-form" onSubmit={handleSubmit}>
        <div className="change-status-modal-username">{account.username}</div>

        <div className="change-status-modal-toggles">
          <div className="change-status-modal-toggle-group">
            <label className="change-status-modal-label">User Active</label>
            <button
              type="button"
              role="switch"
              aria-checked={userActive}
              onClick={() => setUserActive((v) => !v)}
              className={`change-status-toggle ${userActive ? 'change-status-toggle-on' : ''}`}
            >
              <span className="change-status-toggle-text">{userActive ? 'ON' : 'OFF'}</span>
              <span className="change-status-toggle-knob" />
            </button>
          </div>

          <div className="change-status-modal-toggle-group">
            <label className="change-status-modal-label">Bet Active</label>
            <button
              type="button"
              role="switch"
              aria-checked={betActive}
              onClick={() => setBetActive((v) => !v)}
              className={`change-status-toggle ${betActive ? 'change-status-toggle-on' : ''}`}
            >
              <span className="change-status-toggle-text">{betActive ? 'ON' : 'OFF'}</span>
              <span className="change-status-toggle-knob" />
            </button>
          </div>
        </div>

        <div className="change-status-modal-field">
          <label className="change-status-modal-label">Transaction Password</label>
          <input
            type="password"
            value={transactionPassword}
            onChange={(e) => setTransactionPassword(e.target.value)}
            className="change-status-modal-input"
          />
        </div>

        {error && <div className="change-status-modal-error">{error}</div>}
      </form>
    </Modal>
  );
}

export default ChangeStatusModal;
