import React, { useState } from 'react';
import './css/Report.css';
import axios from 'axios';
import Cookies from 'js-cookie';

import BackButton from '../components/BackButton.js';
import Button from '../components/Button.js';
import { useAlert } from '../context/AlertContext.js';
import { useAuth } from '../context/AuthContext.js';

const REASONS = {
  post: ['Inappropriate content','Inappropriate background', 'Copyright violation', 'Spam',  'Misinformation'],
  comment: ['Offensive language', 'Harassment', 'Spam'],
  reply: ['Offensive reply', 'Spam', 'Harassment'],
  user: ['Inappropriate username', 'Inappropriate username', 'Inappropriate profile', 'Inappropriate bio', 'Inappropriate cover'],
};

function Report({ isOpen, onClose, reportType, reportId }) {
  const { showAlert } = useAlert();
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const reasonToSend = selectedReason === 'Other' ? customReason : selectedReason;
    if (!reasonToSend.trim()) {
      showAlert('Please select or write a reason.' , 'error')
      return;
    }

    setSubmitting(true);
    const token = Cookies.get('authToken');
    const reporterId = user._id; // or from session/context

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/report/create`,
        {
          reporterId,
          type: reportType,
          targetId: reportId,
          reason: reasonToSend
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      showAlert(res.data.message , 'success');
      onClose();
      setSelectedReason('');
      setCustomReason('');
      setSubmitting(false);

    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit report.';
      showAlert(message , 'error')
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="report-overlay">
      <div className="report-modal">
        <div className='report-header'>
          <BackButton onClick={onClose} />
          <p className='report-title'>Reporting {reportType}</p>
        </div>
        <div className="report-reason-options">
          {REASONS[reportType]?.map((r, i) => (
            <label key={i} className="custom-radio">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={selectedReason === r}
                onChange={() => setSelectedReason(r)}
              />
              <span className="custom-radio-mark"></span>
              {r}
            </label>
          ))}
          <label className='custom-radio'>
            <input
              type="radio"
              name="reason"
              value="Other"
              checked={selectedReason === 'Other'}
              onChange={() => setSelectedReason('Other')}
            />
            Other
          </label>
        </div>

        <textarea disabled={selectedReason === 'Other' ? false : true}
          placeholder="Enter your reason"
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          className="report-textarea"
        />
        
        <div className="report-actions">
          <Button text={submitting ? 'Submitting...' : 'Submit'} onClick={handleSubmit} disabled={submitting} />
        </div>
      </div>
    </div>
  );
}

export default Report;