import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import './style.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  position?: 'center' | 'top' | 'bottom';
  showCloseButton?: boolean;
  className?: string;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'xl',
  maxWidth,
  position = 'top',
  showCloseButton = true,
  className = '',
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-3xl',
    xl: 'max-w-[92vw]',
    full: 'max-w-[98vw] h-[95vh]',
  };

  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-10',
    bottom: 'items-end justify-center pb-8',
  };

  const activeSizeClass = maxWidth ? sizeClasses[maxWidth === '2xl' ? 'xl' : maxWidth] : sizeClasses[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={cn('modal-overlay', positionClasses[position])}>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeOnOverlayClick && onClose()}
            className="modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: position === 'top' ? -15 : position === 'bottom' ? 15 : 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: position === 'top' ? -15 : position === 'bottom' ? 15 : 0 }}
            transition={{ type: 'spring', duration: 0.2 }}
            className={cn('modal-container', activeSizeClass, className)}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="modal-header">
                <div className="modal-header-title">{title}</div>
                {showCloseButton && (
                  <button onClick={onClose} className="modal-close-btn" title="Close">
                    <X className="w-4 h-4 stroke-[3]" />
                  </button>
                )}
              </div>
            )}

            {/* Body Container */}
            <div className="modal-body">{children}</div>

            {/* Footer */}
            {footer && <div className="modal-footer">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
