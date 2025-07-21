import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

function QRCodeDownload({ restaurantUrl, className }) {
  const qrRef = useRef();

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
  };

  return (
    <div className={className}>
      <button onClick={downloadQR}>Download QR Code</button>
      <div ref={qrRef}>
        <QRCodeCanvas value={restaurantUrl} size={400} style={{display:"none"}}/>
      </div>
    </div>
  );
}

export default QRCodeDownload;
