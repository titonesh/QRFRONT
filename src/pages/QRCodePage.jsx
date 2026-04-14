import { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Button from '../components/Button';

/**
 * QR Code Page Component
 * Generates and displays a QR code for the mortgage calculator entry page
 */
export const QRCodePage = ({ onNavigateToHome }) => {
  const canvasRef = useRef();
  const [qrGenerated, setQrGenerated] = useState(false);
  const canvasSize = 300;

  // The URL encoded in the QR code should deep-link into the calculator flow.
  const QR_URL = import.meta.env.VITE_QR_URL || 'http://localhost:3001/#calculator';

  // Generate QR code on mount
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        QR_URL,
        {
          width: canvasSize,
          margin: 2,
          color: {
            dark: '#00AEEF',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) {
            console.error('QR Code generation error:', error);
          } else {
            setQrGenerated(true);
          }
        }
      );
    }
  }, [QR_URL]);

  // Download QR code as image
  const downloadQRCode = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'mortgage-prequalification-qr.png';
      link.href = url;
      link.click();
    }
  };

  // Print QR code
  const printQRCode = () => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL('image/png');
      const printWindow = window.open('', '', 'width=400,height=500');
      printWindow.document.write(`
        <html>
          <head>
            <title>Mortgage Prequalification QR Code</title>
            <style>
              body { 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                font-family: serif; 
              }
              img { max-width: 300px; margin: 20px 0; }
              h1 { font-size: 24px; margin-bottom: 10px; }
              p { font-size: 14px; color: #666; text-align: center; }
            </style>
          </head>
          <body>
            <h1>Mortgage Prequalification</h1>
            <p>Scan this QR code to get started</p>
            <img src="${image}" />
            <p style="margin-top: 20px; font-size: 12px;">Quick, Easy, and Transparent</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-border shadow-sm">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              QR Code Generator
            </h1>
            <Button
              onClick={onNavigateToHome}
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="w-full py-10 md:py-20 lg:py-28">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="w-full text-center">
            {/* Intro */}
            <div className="w-full max-w-2xl mx-auto mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Share Your Mortgage Prequalification
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Use this QR code to share the mortgage prequalification application with clients and customers. 
                Simply scan the code or print it for distribution.
              </p>
            </div>

            {/* QR Code Display */}
            <div className="w-full flex justify-center mb-10 sm:mb-12">
              <div 
                className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl border-2 border-border w-full max-w-[22rem] sm:max-w-none sm:w-auto"
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    display: qrGenerated ? 'block' : 'none',
                    width: 'min(100%, 300px)',
                    height: 'auto',
                    aspectRatio: '1 / 1',
                  }}
                />
                {!qrGenerated && (
                  <div className="aspect-square w-full max-w-[300px] flex items-center justify-center bg-neutral-light rounded">
                    <p className="text-gray-600">Generating QR Code...</p>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Info */}
            <div className="w-full max-w-2xl mx-auto mb-10 sm:mb-12 p-4 sm:p-6 bg-neutral-light rounded-xl border border-border text-left sm:text-center">
              <p className="text-gray-700 font-medium mb-2">QR Code Details:</p>
              <p className="text-gray-600 text-sm break-all">
                <span className="font-semibold">URL:</span> {QR_URL}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                <span className="font-semibold">Resolution:</span> 300x300 pixels (High Quality)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center mb-10 sm:mb-12">
              <Button
                onClick={downloadQRCode}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-lg hover:shadow-xl"
              >
                Download QR Code
              </Button>
              <Button
                onClick={printQRCode}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto shadow-lg hover:shadow-xl"
              >
                Print QR Code
              </Button>
            </div>

            {/* Instructions */}
            <div className="w-full max-w-3xl mx-auto text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">How to Use</h3>
              <div className="space-y-4">
                <div className="p-4 bg-primary-light rounded-lg border border-primary/20">
                  <h4 className="font-bold text-gray-900 mb-2">📱 For Mobile Users</h4>
                  <p className="text-gray-700">
                    Users can scan this QR code with any smartphone camera to instantly access the prequalification form on their mobile device.
                  </p>
                </div>
                <div className="p-4 bg-success-light rounded-lg border border-success/20">
                  <h4 className="font-bold text-gray-900 mb-2">🖨️ For Print Marketing</h4>
                  <p className="text-gray-700">
                    Download and print the QR code for business cards, flyers, brochures, and other marketing materials.
                  </p>
                </div>
                <div className="p-4 bg-warning-light rounded-lg border border-warning/20">
                  <h4 className="font-bold text-gray-900 mb-2">🎯 For Digital Sharing</h4>
                  <p className="text-gray-700">
                    Share the QR code image on social media, email campaigns, and digital advertisements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 py-12 border-t border-border">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="w-full text-center">
            <p className="text-white/60 text-sm font-medium">
              © {new Date().getFullYear()} Mortgage Loan Prequalification System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QRCodePage;
