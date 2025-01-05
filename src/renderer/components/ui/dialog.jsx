import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const DialogContext = createContext({
  open: false,
  setOpen: () => {},
});

// Dialog 组件
export const Dialog = {
  Root: ({ children, onOpenChange }) => {
    const [open, setOpen] = useState(false);
    
    React.useEffect(() => {
      if (onOpenChange) {
        onOpenChange(open);
      }
    }, [open, onOpenChange]);

    return (
      <DialogContext.Provider value={{ open, setOpen }}>
        {children}
      </DialogContext.Provider>
    );
  },
  
  Trigger: ({ children, asChild, ...props }) => {
    const { setOpen } = useContext(DialogContext);
    const Comp = asChild ? 'div' : 'button';
    return (
      <Comp onClick={() => setOpen(true)} {...props}>
        {children}
      </Comp>
    );
  },
  
  Content: ({ children, className = '', ...props }) => {
    const { open, setOpen } = useContext(DialogContext);
    
    if (!open) return null;
    
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div 
          className={`bg-background p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto ${className}`}
          {...props}
        >
          <div className="relative">
            {children}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  },
  
  Header: ({ children, className = '', ...props }) => {
    return (
      <div className={`mb-4 ${className}`} {...props}>
        {children}
      </div>
    );
  },
  
  Title: ({ children, className = '', ...props }) => {
    return (
      <h2 className={`text-lg font-semibold ${className}`} {...props}>
        {children}
      </h2>
    );
  },
  
  Description: ({ children, className = '', ...props }) => {
    return (
      <p className={`text-sm text-muted-foreground mt-2 ${className}`} {...props}>
        {children}
      </p>
    );
  },
  
  Footer: ({ children, className = '', ...props }) => {
    return (
      <div className={`mt-6 flex justify-end gap-2 ${className}`} {...props}>
        {children}
      </div>
    );
  },
  
  Close: ({ children, className = '', ...props }) => {
    const { setOpen } = useContext(DialogContext);
    return (
      <button 
        onClick={() => setOpen(false)}
        className={`px-4 py-2 text-sm font-medium ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
}; 