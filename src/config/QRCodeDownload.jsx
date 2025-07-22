import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import styles from "../pages/main/main.module.css";
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
      <button onClick={downloadQR}>Download QR Code <i className="fas fa-qrcode"></i></button>
      <div ref={qrRef} className={styles.code_container}>
        <QRCodeCanvas value={restaurantUrl} size={400} style={{display:"none"}}/>
      </div>
    </div>
  );
}

export default QRCodeDownload;
