import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import { AccountService, AccountListItem } from '@/services/account.service';
import './style.css';

export interface ExposureLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountListItem;
  onSuccess?: () => void;
}

export function ExposureLimitModal({ isOpen, onClose, account, onSuccess }: ExposureLimitModalProps) {
  const [newLimit, setNewLimit] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const oldLimit = account.exposure ?? 0;

  const handleClose = () => {
    setNewLimit('');
    setTransactionPassword('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newLimit.trim() === '' || Number(newLimit) < 0) {
      setError('Please enter a valid limit.');
      return;
    }
    if (!transactionPassword.trim()) {
      setError('Transaction password is required.');
      return;
    }

    setSubmitting(true);
    try {
      await AccountService.updateExposureLimit(account.id, {
        newLimit: Number(newLimit),
        transactionPassword,
      });
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update exposure limit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Exposure Limit"
      position="top"
      maxWidth="md"
      className="exposure-limit-modal"
      footer={
        <>
          <button type="button" className="exposure-limit-modal-btn-back" onClick={handleClose}>
            <i className="fa fa-undo"></i> BACK
          </button>
          <button
            type="submit"
            form="exposure-limit-modal-form"
            className="exposure-limit-modal-btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'submit'} <i className="fa fa-sign-in-alt"></i>
          </button>
        </>
      }
    >
      <form id="exposure-limit-modal-form" onSubmit={handleSubmit}>
        <div className="exposure-limit-modal-field">
          <label className="exposure-limit-modal-label">Old Limit</label>
          <input
            type="text"
            className="exposure-limit-modal-input-readonly"
            value={oldLimit.toFixed(2)}
            disabled
            readOnly
          />
        </div>

        <div className="exposure-limit-modal-field">
          <label className="exposure-limit-modal-label">New Limit</label>
          <input
            type="number"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            className="exposure-limit-modal-input exposure-limit-modal-input-highlight"
          />
        </div>

        <div className="exposure-limit-modal-field">
          <label className="exposure-limit-modal-label">Transaction Password</label>
          <input
            type="password"
            value={transactionPassword}
            onChange={(e) => setTransactionPassword(e.target.value)}
            className="exposure-limit-modal-input exposure-limit-modal-input-highlight"
          />
        </div>

        {error && <div className="exposure-limit-modal-error">{error}</div>}
      </form>
    </Modal>
  );
}

export default ExposureLimitModal;
