import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Background overlay com opacidade ajustada */}
            <div
                className="fixed inset-0 bg-[rgba(0,0,0,0.5)] transition-opacity" // <-- LINHA ALTERADA
                aria-hidden="true"
                onClick={onClose}
            />

            {/* Painel do Modal */}
            <div
                className={`relative w-full bg-white rounded-lg shadow-xl transform transition-all sm:my-8 ${sizeClasses[size]}`}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b rounded-t">
                    <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        <X className="h-6 w-6" />
                        <span className="sr-only">Fechar modal</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;