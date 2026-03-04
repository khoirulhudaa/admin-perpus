// import QRCode from 'react-qr-code';

// interface QRCodeDisplayProps {
//   generateQrCode: () => void;
//   qrCodeData: string | null;
//   isDisabled: boolean;
// }

// const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
//   generateQrCode,
//   qrCodeData,
//   isDisabled,
// }) => (
//   <div className="absolute top-4 right-4 flex flex-col items-center">
//     <button
//       onClick={generateQrCode}
//       className={`bg-blue-500 text-white py-2 px-6 rounded-lg ${
//         isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
//       }`}
//       disabled={isDisabled}
//     >
//       Generate QR
//     </button>
//     {qrCodeData && (
//       <div className="mt-4 bg-white p-2 shadow-md rounded border-4">
//         <QRCode value={qrCodeData} size={180} />
//       </div>
//     )}
//   </div>
// );

// export default QRCodeDisplay;


import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';

interface QRCodeDisplayProps {
  generateQrCode: () => void;
  qrCodeData: string | null;
  isDisabled: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  generateQrCode,
  qrCodeData,
  isDisabled,
}) => {
  const [isQrVisible, setIsQrVisible] = useState(false);

  const toggleQrVisibility = () => {
    setIsQrVisible(!isQrVisible);
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col items-center">
      <div className="flex space-x-2">
        <button
          onClick={generateQrCode}
          className={`bg-blue-500 w-[160px] text-white py-2 px-6 rounded-lg ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={isDisabled}
        >
          Generate QR
        </button>
        {qrCodeData && (
          <button
            onClick={toggleQrVisibility}
            className="bg-gray-500 w-[160px] justify-center flex items-center gap-2 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
          >
            {isQrVisible ? 'Hide QR' : 'Show QR'}
            {isQrVisible ? <Eye className='relative top-[0.3px] scale-[0.8]' /> : <EyeClosed className='relative top-[0.3px] scale-[0.8]' />}
            {/* <Eye /> */}
          </button>
        )}
      </div>
      {qrCodeData && isQrVisible && (
        <div className="mt-4 bg-white p-2 z-[777] shadow-md rounded border-4">
          <QRCode value={qrCodeData} size={180} />
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;