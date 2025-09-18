import React from 'react';

// ✅ VERSI YANG DIPERBAIKI
export function Loading() {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }}
    >
      <div className="relative flex flex-col items-center gap-8">
        
        {/* Main Loading Animation */}
        <div className="relative">
          {/* Outer ring */}
          <div 
            className="w-20 h-20 rounded-full border-4 border-gray-200"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid #e5e7eb'
            }}
          ></div>
          
          {/* Animated gradient ring */}
          <div 
            className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid transparent',
              borderTopColor: '#3b82f6',
              borderRightColor: '#8b5cf6',
              borderBottomColor: '#ec4899',
              animation: 'spin 1s linear infinite'
            }}
          ></div>
          
          {/* Inner pulsing dot */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            ></div>
          </div>
          
          {/* Floating particles */}
          <div 
            className="absolute w-2 h-2 rounded-full"
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#60a5fa',
              animation: 'bounce 1s infinite'
            }}
          ></div>
          <div 
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '-8px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#a78bfa',
              animation: 'bounce 1s infinite',
              animationDelay: '200ms'
            }}
          ></div>
        </div>
        
        {/* Text with animations */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span 
              className="text-lg font-medium"
              style={{
                fontSize: '18px',
                fontWeight: '500',
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Loading
            </span>
            <div className="flex gap-1">
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  animation: 'bounce 1s infinite'
                }}
              ></div>
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#8b5cf6',
                  animation: 'bounce 1s infinite',
                  animationDelay: '150ms'
                }}
              ></div>
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#ec4899',
                  animation: 'bounce 1s infinite',
                  animationDelay: '300ms'
                }}
              ></div>
            </div>
          </div>
          
          <p 
            className="text-xs mt-2"
            style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            Preparing your experience...
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25%);
          }
        }
      `}</style>
    </div>
  );
}

// ✅ CONTOH PENGGUNAAN SEDERHANA
export function TestLoadingPage() {
  const [showLoading, setShowLoading] = React.useState(false);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Loading Component</h1>
      
      <button
        onClick={() => setShowLoading(!showLoading)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        style={{
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {showLoading ? 'Hide Loading' : 'Show Loading'}
      </button>
      
      <div className="mt-4">
        <p>Content halaman...</p>
        <p>Lorem ipsum dolor sit amet...</p>
      </div>
      
      {showLoading && <Loading />}
    </div>
  );
}