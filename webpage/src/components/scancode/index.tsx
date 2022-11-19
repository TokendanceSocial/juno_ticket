import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useEffect, useRef } from 'react';

interface IProps {
  config: {
    fps: number;
    qrbox: any;
    disableFlip: any;
    supportedScanTypes: Html5QrcodeScanType[];
  }
  verbose: boolean;
  qrCodeSuccessCallback: (data: any, text: any) => void
  qrCodeErrorCallback: (data: any) => void;
}
const Html5QrcodePlugin: React.FC<IProps> =(props) => {
  const qrcodeRegionId = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (qrcodeRegionId.current) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        (qrcodeRegionId.current?.id || ''), props.config, props.verbose);
      html5QrcodeScanner.render(
        props.qrCodeSuccessCallback,
        props.qrCodeErrorCallback);
        return () => {
          html5QrcodeScanner.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner. ", error);
        });
        }
    }
  }, [])
  return <div id='scan' ref={qrcodeRegionId} />;
}
export default Html5QrcodePlugin;