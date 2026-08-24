import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AccountService } from '@/services/account.service';
import { useAppSelector } from '@/store/hooks';
import { getCreatableRoles } from '@/constants/roles';
import { toast } from '@/components/common/Toast';
import './style.css';

export default function InsertUserPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const accountTypeOptions = useMemo(() => getCreatableRoles(user?.role), [user?.role]);

  const [formData, setFormData] = useState({
    clientName: '',
    userPassword: '',
    retypePassword: '',
    fullName: '',
    city: '',
    phone: '',
    accountType: '',
    creditReference: '',
    commissionDownline: '0',
    partnershipDownline: '0',
    transactionPassword: '',
    minBet: '100',
    maxBet: '5000000',
    betDelay: '5',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.userPassword !== formData.retypePassword) {
      toast.error('Password and Retype Password do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await AccountService.register({
        accountType: formData.accountType,
        name: formData.fullName,
        username: formData.clientName,
        password: formData.userPassword,
        retypePassword: formData.retypePassword,
        city: formData.city,
        phone: formData.phone,
        creditReference: formData.creditReference,
        transactionPassword: formData.transactionPassword,
        commissionDownline: Number(formData.commissionDownline) || 0,
        partnershipDownline: Number(formData.partnershipDownline) || 0,
        minBet: Number(formData.minBet) || 0,
        maxBet: Number(formData.maxBet) || 0,
        betDelay: Number(formData.betDelay) || 0,
      });
      toast.success('Account created successfully!');
      setTimeout(() => {
        navigate(ROUTES.CLIENTS);
      }, 1200);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="insert-user-wrapper">
      <h2 className="insert-user-title">Add Account</h2>

      <form onSubmit={handleSubmit} className="insert-user-card">
        {/* Top Grid: Personal Detail & Account Detail */}
        <div className="grid grid-cols-2 gap-4 mb-4 items-start">
          {/* Personal Detail Box */}
          <div className="insert-user-section">
            <div className="insert-user-section-header">Personal Detail</div>
            <div className="insert-user-section-body">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label className="insert-user-label">Client Name:</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Client Name"
                    className="insert-user-input"
                  />
                </div>

                <div>
                  <label className="insert-user-label">User Password:</label>
                  <input
                    type="password"
                    name="userPassword"
                    value={formData.userPassword}
                    onChange={handleChange}
                    placeholder="User Password"
                    className="insert-user-input"
                  />
                </div>

                <div>
                  <label className="insert-user-label">Retype Password:</label>
                  <input
                    type="password"
                    name="retypePassword"
                    value={formData.retypePassword}
                    onChange={handleChange}
                    placeholder="Retype Password"
                    className="insert-user-input"
                  />
                </div>

                <div>
                  <label className="insert-user-label">Full Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="insert-user-input"
                  />
                </div>

                <div>
                  <label className="insert-user-label">City:</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="insert-user-input"
                  />
                </div>

                <div>
                  <label className="insert-user-label">Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    maxLength={15}
                    className="insert-user-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Detail Box */}
          <div className="insert-user-section">
            <div className="insert-user-section-header">Account Detail</div>
            <div className="insert-user-section-body">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label className="insert-user-label">Account Type:</label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="insert-user-select"
                  >
                    <option value="">Select Account Type</option>
                    {accountTypeOptions.map((option) => (
                      <option key={option.accountType} value={option.accountType}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="insert-user-label">Credit Reference:</label>
                  <input
                    type="text"
                    name="creditReference"
                    value={formData.creditReference}
                    onChange={handleChange}
                    placeholder="Credit Reference"
                    className="insert-user-input"
                  />
                </div>

                <div>
                  <label className="insert-user-label">Min Bet:</label>
                  <input
                    type="number"
                    name="minBet"
                    value={formData.minBet}
                    onChange={handleChange}
                    placeholder="Min Bet"
                    className="insert-user-input"
                  />
                </div>

                <div>
                  <label className="insert-user-label">Max Bet:</label>
                  <input
                    type="number"
                    name="maxBet"
                    value={formData.maxBet}
                    onChange={handleChange}
                    placeholder="Max Bet"
                    className="insert-user-input"
                  />
                </div>

                <div>
                  <label className="insert-user-label">Bet Delay:</label>
                  <input
                    type="number"
                    name="betDelay"
                    value={formData.betDelay}
                    onChange={handleChange}
                    placeholder="Bet Delay"
                    className="insert-user-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Settings Section */}
        <div className="insert-user-section mb-4">
          <div className="insert-user-section-header">Commission Settings</div>
          <div className="insert-user-table-wrapper">
            <table className="insert-user-table">
              <tbody>
                <tr>
                  <td className="insert-user-table-label">Upline</td>
                  <td className="insert-user-table-val">0</td>
                </tr>
                <tr>
                  <td className="insert-user-table-label">Downline</td>
                  <td className="insert-user-table-val">
                    <input
                      type="text"
                      name="commissionDownline"
                      value={formData.commissionDownline}
                      onChange={handleChange}
                      placeholder="0"
                      maxLength={4}
                      className="insert-user-table-input"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="insert-user-table-label">Our</td>
                  <td className="insert-user-table-val"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Partnership Section */}
        <div className="insert-user-section mb-4">
          <div className="insert-user-section-header">Partnership</div>
          <div className="insert-user-table-wrapper">
            <table className="insert-user-table">
              <tbody>
                <tr>
                  <td className="insert-user-table-label">Upline</td>
                  <td className="insert-user-table-val">0</td>
                </tr>
                <tr>
                  <td className="insert-user-table-label">Downline</td>
                  <td className="insert-user-table-val">
                    <input
                      type="text"
                      name="partnershipDownline"
                      value={formData.partnershipDownline}
                      onChange={handleChange}
                      placeholder="0"
                      maxLength={4}
                      className="insert-user-table-input"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="insert-user-table-label">Our</td>
                  <td className="insert-user-table-val"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Right Form Controls */}
        <div className="flex flex-col items-end gap-3 mt-6">
          <div className="w-full max-w-[280px]">
            <label className="insert-user-label">Transaction Password:</label>
            <input
              type="password"
              name="transactionPassword"
              value={formData.transactionPassword}
              onChange={handleChange}
              placeholder="Transaction Password"
              className="insert-user-input"
            />
          </div>

          <button type="submit" className="btn-create-account flex items-center justify-center gap-2" disabled={submitting}>
            {submitting && (
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            )}
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
}
