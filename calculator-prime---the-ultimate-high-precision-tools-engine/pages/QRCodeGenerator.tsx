import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download } from 'lucide-react';
import { useLanguage } from '../App';

const QRCodeGenerator = () => {
  const [text, setText] = useState<string>('https://example.com');
  const [qrUrl, setQrUrl] = useState<string>('');
  const { t } = useLanguage();

  useEffect(() => {
    generateQR();
  }, [text]);

  const generateQR = async () => {
    try {
      if(!text) {
        setQrUrl('');
        return;
      }
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
          <QrCode size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('qr_title')}</h1>
          <p className="text-slate-500">{t('qr_sub')}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('enter_text')}
        </label>
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none mb-8"
          placeholder={t('qr_placeholder')}
        />

        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          {qrUrl ? (
            <>
              <img src={qrUrl} alt="Generated QR Code" className="w-64 h-64 rounded-lg shadow-sm mb-6" />
              <a 
                href={qrUrl} 
                download="qrcode.png"
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={20} /> {t('download')}
              </a>
            </>
          ) : (
            <p className="text-slate-400">{t('qr_placeholder')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;