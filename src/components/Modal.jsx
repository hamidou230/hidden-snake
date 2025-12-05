import { useEffect, useRef } from 'react';

/**
 * Modal 100% responsive - s'adapte à tous les écrans
 */
const Modal = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-green-500/30 shadow-2xl shadow-green-500/10 overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 16px)', maxHeight: 'calc(100dvh - 16px)' }}
      >
        {/* Header fixe */}
        {title && (
          <div className="sticky top-0 z-10 px-4 py-3 bg-gray-900/95 backdrop-blur border-b border-green-500/20">
            <h2 className="text-lg sm:text-xl font-bold text-green-400 text-center" style={{ textShadow: '0 0 10px rgba(34,197,94,0.5)' }}>
              {title}
            </h2>
          </div>
        )}

        {/* Contenu scrollable */}
        <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100vh - 70px)', maxHeight: 'calc(100dvh - 70px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
