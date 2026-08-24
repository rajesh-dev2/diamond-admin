import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';
import { useAppSelector } from '@/store/hooks';
import { AccountService, AccountListItem } from '@/services/account.service';
import './style.css';

export type TransactionType = 'deposit' | 'withdraw';

export interface AccountTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountListItem;
  type: TransactionType;
  onSuccess?: () => void;
}

const TITLES: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
};

export function AccountTransactionModal({ isOpen, onClose, account, type, onSuccess }: AccountTransactionModalProps) {
  const adminUser = useAppSelector((state) => state.auth.user);

  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [targetBalance, setTargetBalance] = useState(account.balance ?? 0);
  const [adminBalance, setAdminBalance] = useState(0);
  const [adminLabel, setAdminLabel] = useState(adminUser?.username || adminUser?.name);
  const [isAdminBalanceLoading, setIsAdminBalanceLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;

    setTargetBalance(account.balance ?? 0);
    setAdminBalance(0);
    setIsAdminBalanceLoading(true);
    AccountService.getBalance(account.id).then(({ balance, username, name }) => {
      if (ignore) return;
      setAdminBalance(balance);
      setAdminLabel(username || name || adminUser?.username || adminUser?.name);
      setIsAdminBalanceLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [isOpen, account.id]);

  const amountNum = Number(amount) || 0;

  // Deposit: admin credits the account (admin balance down, target balance up).
  // Withdraw: admin reclaims from the account (admin balance up, target balance down).
  const direction = type === 'deposit' ? 1 : -1;
  const adminNewBalance = useMemo(() => adminBalance - direction * amountNum, [adminBalance, amountNum, direction]);
  const targetNewBalance = useMemo(() => targetBalance + direction * amountNum, [targetBalance, amountNum, direction]);

  const handleClose = () => {
    setAmount('');
    setRemark('');
    setTransactionPassword('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amountNum <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!transactionPassword.trim()) {
      setError('Transaction password is required.');
      return;
    }

    setSubmitting(true);
    try {
      const submit = type === 'deposit' ? AccountService.deposit : AccountService.withdraw;
      await submit(account.id, {
        amount: amountNum,
        remark,
        transactionPassword,
      });
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to ${type}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={TITLES[type]}
      position="center"
      maxWidth="md"
      className="account-txn-modal"
      footer={
        <>
          <button type="button" className="account-txn-modal-btn-back" onClick={handleClose}>
            <i className="fa fa-undo"></i> BACK
          </button>
          <button
            type="submit"
            form="account-txn-modal-form"
            className="account-txn-modal-btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'submit'} <i className="fa fa-sign-in-alt"></i>
          </button>
        </>
      }
    >
      <form id="account-txn-modal-form" onSubmit={handleSubmit}>
        <div className="account-txn-modal-row">
          <span className="account-txn-modal-row-label flex items-center gap-2">
            {adminLabel}
            {isAdminBalanceLoading && <Loader size="sm" />}
          </span>
          <input type="text" className="account-txn-modal-balance-input" value={adminBalance} disabled readOnly />
          <input type="text" className="account-txn-modal-balance-input" value={adminNewBalance} disabled readOnly />
        </div>

        <div className="account-txn-modal-row">
          <span className="account-txn-modal-row-label">{account.username}</span>
          <input type="text" className="account-txn-modal-balance-input" value={targetBalance} disabled readOnly />
          <input type="text" className="account-txn-modal-balance-input" value={targetNewBalance} disabled readOnly />
        </div>

        <div className="account-txn-modal-field">
          <label className="account-txn-modal-label">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="account-txn-modal-input account-txn-modal-input-highlight"
          />
        </div>

        <div className="account-txn-modal-field">
          <label className="account-txn-modal-label">Remark</label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="account-txn-modal-textarea"
          />
        </div>

        <div className="account-txn-modal-field">
          <label className="account-txn-modal-label">Transaction Password</label>
          <input
            type="password"
            value={transactionPassword}
            onChange={(e) => setTransactionPassword(e.target.value)}
            className="account-txn-modal-input account-txn-modal-input-highlight"
          />
        </div>

        {error && <div className="account-txn-modal-error">{error}</div>}
      </form>
    </Modal>
  );
}

export default AccountTransactionModal;
