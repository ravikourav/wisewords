import React, { useState } from 'react'
import './css/Report.css';

function Report({ isOpen, onClose, reportType, reportId }) {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        console.log(`Reporting ${reportType} with ID ${reportId} for reason: ${reason}`);
        onClose();
    };

    return (
        <div className="report-overlay">
            <div className="report-modal">
                <h3>Report {reportType}</h3>
                <textarea
                    placeholder="Enter reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="report-textarea"
                />
                <div className="report-actions">
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Report