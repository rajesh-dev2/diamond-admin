import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import './style.css';

export default function InsertUserPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: '',
    userPassword: '',
    retypePassword: '',
    fullName: '',
    city: '',
    phone: '',
    accountType: '',
    creditReference: '',
    commissionDownline: '',
    partnershipDownline: '',
    transactionPassword: '',
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Account created successfully!');
    setTimeout(() => {
      navigate(ROUTES.CLIENTS);
    }, 1200);
  };

  return (
    <div className="insert-user-wrapper">
      <h2 className="insert-user-title">Add Account</h2>

      <form onSubmit={handleSubmit} className="insert-user-card">
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 text-sm rounded-[3px]">
            {message}
          </div>
        )}

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
                    <option value="5">Agent</option>
                    <option value="6">User</option>
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
                      disabled
                      className="insert-user-table-input opacity-70 cursor-not-allowed"
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

          <button type="submit" className="btn-create-account">
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
