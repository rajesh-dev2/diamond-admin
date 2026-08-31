import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import { AccountService, AccountListItem } from '@/services/account.service';
import './style.css';

export interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountListItem;
  onSuccess?: () => void;
}

export function CreditModal({ isOpen, onClose, account, onSuccess }: CreditModalProps) {
  const [newCredit, setNewCredit] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const oldCredit = Number(account.creditReference) || 0;

  const handleClose = () => {
    setNewCredit('');
    setTransactionPassword('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newCredit.trim() === '' || Number(newCredit) < 0) {
      setError('Please enter a valid credit amount.');
      return;
    }
    if (!transactionPassword.trim()) {
      setError('Transaction password is required.');
      return;
    }

    setSubmitting(true);
    try {
      await AccountService.updateCredit(account.id, {
        newCredit: Number(newCredit),
        transactionPassword,
      });
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update credit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Credit"
      position="top"
      maxWidth="md"
      className="credit-modal"
      footer={
        <>
          <button type="button" className="credit-modal-btn-back" onClick={handleClose}>
            <i className="fa fa-undo"></i> BACK
          </button>
          <button
            type="submit"
            form="credit-modal-form"
            className="credit-modal-btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'submit'} <i className="fa fa-sign-in-alt"></i>
          </button>
        </>
      }
    >
      <form id="credit-modal-form" onSubmit={handleSubmit}>
        <div className="credit-modal-field">
          <label className="credit-modal-label">Old Credit</label>
          <input
            type="text"
            className="credit-modal-input-readonly"
            value={oldCredit.toFixed(2)}
            disabled
            readOnly
          />
        </div>

        <div className="credit-modal-field">
          <label className="credit-modal-label">New Credit</label>
          <input
            type="number"
            value={newCredit}
            onChange={(e) => setNewCredit(e.target.value)}
            className="credit-modal-input"
          />
        </div>

        <div className="credit-modal-field">
          <label className="credit-modal-label">Transaction Password</label>
          <input
            type="password"
            value={transactionPassword}
            onChange={(e) => setTransactionPassword(e.target.value)}
            className="credit-modal-input"
          />
        </div>

        {error && <div className="credit-modal-error">{error}</div>}
      </form>
    </Modal>
  );
}

export default CreditModal;
