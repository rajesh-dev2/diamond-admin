import React, { useState } from 'react';
import './style.css';

const PRIVILEGES = [
  { value: '1', label: 'DashBoard' },
  { value: '2', label: 'Market Analysis' },
  { value: '4', label: 'User List' },
  { value: '5', label: 'Insert User' },
  { value: '8', label: 'Account Statement' },
  { value: '9', label: 'Party Win Loss' },
  { value: '10', label: 'Current Bets' },
  { value: '12', label: 'General Lock' },
  { value: '13', label: 'Casino Result' },
  { value: '14', label: 'Live Casino Result' },
  { value: '15', label: 'Our Casino' },
  { value: '16', label: 'Events' },
  { value: '17', label: 'Market Search Analysis' },
  { value: '19', label: 'Login User creation' },
  { value: '54', label: 'Withdraw' },
  { value: '55', label: 'Deposit' },
  { value: '56', label: 'Credit Reference' },
  { value: '57', label: 'User Info' },
  { value: '58', label: 'User Password Change' },
  { value: '59', label: 'User Lock' },
  { value: '60', label: 'Bet Lock' },
  { value: '91', label: 'active user' },
  { value: '104', label: 'Agent Assign' },
  { value: '111', label: 'User Register Report' },
  { value: '112', label: 'Total Profitloss' },
  { value: '113', label: 'User Winloss' },
];

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    clientId: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    transactionCode: '',
  });

  const [checkedPrivileges, setCheckedPrivileges] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllToggle = () => {
    if (allChecked) {
      setCheckedPrivileges([]);
      setAllChecked(false);
    } else {
      setCheckedPrivileges(PRIVILEGES.map((p) => p.value));
      setAllChecked(true);
    }
  };

  const handlePrivilegeToggle = (value: string) => {
    setCheckedPrivileges((prev) => {
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      setAllChecked(next.length === PRIVILEGES.length);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setFormData({
      clientId: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      transactionCode: '',
    });
    setCheckedPrivileges([]);
    setAllChecked(false);
  };

  return (
    <div className="ml-wrapper">
      <h4 className="ml-title">Multi Login Account</h4>

      <div className="ml-card">
        <form method="post" onSubmit={handleSubmit}>
          <div className="ml-form">
            {/* Personal Information */}
            <div>
              <h5 className="ml-section-title">Personal Information</h5>
              <div className="ml-form-row">
                <div className="ml-form-group">
                  <label className="ml-label">Client ID</label>
                  <input
                    type="text"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="ml-input"
                  />
                </div>
                <div className="ml-form-group">
                  <label className="ml-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="ml-input"
                  />
                </div>
                <div className="ml-form-group">
                  <label className="ml-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="ml-input"
                  />
                </div>
                <div className="ml-form-group">
                  <label className="ml-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="ml-input"
                  />
                </div>
              </div>
            </div>

            {/* Privileges */}
            <div className="ml-privileges-section">
              <h5 className="ml-section-title">Privileges</h5>
              <div className="ml-privilege-box">
                {/* All checkbox */}
                <div className="ml-privilege-all-row">
                  <label className="ml-checkbox-label">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={handleAllToggle}
                      className="ml-checkbox"
                    />
                    <span className="ml-checkbox-custom"></span>
                    <span>All</span>
                  </label>
                </div>

                {/* 8 Columns Grid of Privileges */}
                <div className="ml-privilege-grid">
                  {PRIVILEGES.map((priv) => (
                    <div className="ml-privilege-item" key={priv.value}>
                      <label className="ml-checkbox-label">
                        <input
                          type="checkbox"
                          checked={checkedPrivileges.includes(priv.value)}
                          onChange={() => handlePrivilegeToggle(priv.value)}
                          className="ml-checkbox"
                        />
                        <span className="ml-checkbox-custom"></span>
                        <span>{priv.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action bar right below Privileges box */}
              <div className="ml-action-bar">
                <div className="ml-action-bar-inner">
                  <input
                    type="password"
                    name="transactionCode"
                    value={formData.transactionCode}
                    onChange={handleChange}
                    placeholder="Transaction Code"
                    className="ml-input ml-txcode-input"
                  />
                  <button type="submit" className="ml-btn-submit">
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-btn-reset"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Table outer & inner matching the exact HTML structure */}
        <div className="outer mt-4">
          <div className="inner ml-table-inner">
            <table className="table table-bordered ml-table">
              <tbody>
                <tr>
                  <th className="fixed-col-1">Action</th>
                  <th className="fixed-col-2">Username</th>
                  <th className="fixed-col-3">IsAuth</th>
                  <th className="fixed-col-4">Full Name</th>
                  {PRIVILEGES.map((priv) => (
                    <th key={priv.value}>{priv.label}</th>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
