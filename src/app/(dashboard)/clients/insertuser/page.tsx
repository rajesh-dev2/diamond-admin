import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { HttpService } from '@/api/httpService';
import { AccountService } from '@/services/account.service';
import { ReportsService } from '@/services/reports.service';
import { SelectOption } from '@/components/common/FormSelect';
import { toast } from '@/components/common/Toast';
import './style.css';

const REQUIRED_FIELD_MESSAGES: Record<string, string> = {
  clientName: 'The clientname field is required',
  userPassword: 'The password field is required',
  fullName: 'The fullname field is required',
  accountType: 'The User Type field is required',
  creditReference: 'The camt field is required',
};

export default function InsertUserPage() {
  const navigate = useNavigate();
  const [accountTypeOptions, setAccountTypeOptions] = useState<SelectOption[]>([]);
  const [uplineAmounts, setUplineAmounts] = useState({ commission: 0, partnership: 0 });

  useEffect(() => {
    ReportsService.getProfitLossLevels().then((options) => {
      setAccountTypeOptions(options.filter((option) => option.value !== 'all'));
    });

    HttpService.get<any>(API_ENDPOINTS.AUTH.ME).then((res) => {
      setUplineAmounts({
        commission: res?.data?.commission?.upline ?? 0,
        partnership: res?.data?.partnership?.upline ?? 0,
      });
    });
  }, []);

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): Record<string, string> => {
    const nextErrors: Record<string, string> = {};
    for (const field of Object.keys(REQUIRED_FIELD_MESSAGES)) {
      if (!formData[field as keyof typeof formData].trim()) {
        nextErrors[field] = REQUIRED_FIELD_MESSAGES[field];
      }
    }
    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (formData.userPassword !== formData.retypePassword) {
      toast.error('Password and Retype Password do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const accountType = formData.accountType.toLowerCase() === 'user' ? 'client' : formData.accountType;
      await AccountService.register({
        accountType,
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

  // The bottom-most level in the hierarchy (the actual bettor) is the only
  // one that needs bet limits configured.
  const isUserLevelSelected =
    accountTypeOptions.length > 0 &&
    formData.accountType === accountTypeOptions[accountTypeOptions.length - 1].value;

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
                  <div className="insert-user-field-wrap">
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      placeholder="Client Name"
                      className={`insert-user-input ${errors.clientName ? 'insert-user-input-error' : ''}`}
                    />
                    {errors.clientName && <X className="insert-user-input-error-icon" />}
                  </div>
                  {errors.clientName && <p className="insert-user-error-text">{errors.clientName}</p>}
                </div>

                <div>
                  <label className="insert-user-label">User Password:</label>
                  <div className="insert-user-field-wrap">
                    <input
                      type="password"
                      name="userPassword"
                      value={formData.userPassword}
                      onChange={handleChange}
                      placeholder="User Password"
                      className={`insert-user-input ${errors.userPassword ? 'insert-user-input-error' : ''}`}
                    />
                    {errors.userPassword && <X className="insert-user-input-error-icon" />}
                  </div>
                  {errors.userPassword && <p className="insert-user-error-text">{errors.userPassword}</p>}
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
                  <div className="insert-user-field-wrap">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className={`insert-user-input ${errors.fullName ? 'insert-user-input-error' : ''}`}
                    />
                    {errors.fullName && <X className="insert-user-input-error-icon" />}
                  </div>
                  {errors.fullName && <p className="insert-user-error-text">{errors.fullName}</p>}
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
                  <div className="insert-user-field-wrap">
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className={`insert-user-select ${errors.accountType ? 'insert-user-input-error' : ''}`}
                    >
                      <option value="">Select Account Type</option>
                      {accountTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.accountType && <X className="insert-user-input-error-icon" />}
                  </div>
                  {errors.accountType && <p className="insert-user-error-text">{errors.accountType}</p>}
                </div>

                <div>
                  <label className="insert-user-label">Credit Reference:</label>
                  <div className="insert-user-field-wrap">
                    <input
                      type="text"
                      name="creditReference"
                      value={formData.creditReference}
                      onChange={handleChange}
                      placeholder="Credit Reference"
                      className={`insert-user-input ${errors.creditReference ? 'insert-user-input-error' : ''}`}
                    />
                    {errors.creditReference && <X className="insert-user-input-error-icon" />}
                  </div>
                  {errors.creditReference && <p className="insert-user-error-text">{errors.creditReference}</p>}
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
                  <td className="insert-user-table-val">{uplineAmounts.commission}</td>
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
                  <td className="insert-user-table-val">{uplineAmounts.partnership}</td>
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

        {/* Min Max Bet Section — only for the bottom-most (User/Client) level */}
        {isUserLevelSelected && (
          <div className="insert-user-section mb-4">
            <div className="insert-user-section-header">Min Max Bet</div>
            <div className="insert-user-table-wrapper">
              <table className="insert-user-table">
                <tbody>
                  <tr>
                    <td className="insert-user-table-label" rowSpan={2}>Min Bet</td>
                    <td className="insert-user-table-val">100</td>
                  </tr>
                  <tr>
                    <td className="insert-user-table-val">
                      <input
                        type="number"
                        name="minBet"
                        value={formData.minBet}
                        onChange={handleChange}
                        placeholder="Min Bet"
                        className="insert-user-table-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="insert-user-table-label" rowSpan={2}>Max Bet</td>
                    <td className="insert-user-table-val">5000000</td>
                  </tr>
                  <tr>
                    <td className="insert-user-table-val">
                      <input
                        type="number"
                        name="maxBet"
                        value={formData.maxBet}
                        onChange={handleChange}
                        placeholder="Max Bet"
                        className="insert-user-table-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="insert-user-table-label" rowSpan={2}>Delay</td>
                    <td className="insert-user-table-val">5.00</td>
                  </tr>
                  <tr>
                    <td className="insert-user-table-val">
                      <input
                        type="number"
                        name="betDelay"
                        value={formData.betDelay}
                        onChange={handleChange}
                        placeholder="Delay"
                        className="insert-user-table-input"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

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
