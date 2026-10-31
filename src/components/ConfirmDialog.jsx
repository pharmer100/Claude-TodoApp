import { useEffect } from 'react';

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog small" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">{title}</h2>
        {message && <p className="dialog-text">{message}</p>}
        <div className="form-actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn primary destructive"
            autoFocus
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
