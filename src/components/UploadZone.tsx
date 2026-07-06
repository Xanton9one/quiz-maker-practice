import { useState, useRef, ChangeEvent } from 'react';
import '../styles/UploadZone.css'; 

interface UploadZoneProps {
  onFileSelect: (fileName: string) => void;
}

export const UploadZone = ({ onFileSelect }: UploadZoneProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file.name);
    }
  };

  return (
    <div onClick={handleZoneClick} className="upload-zone">
      <div className="upload-zone-gradient" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf"
      />
      <div className="upload-zone-icon">📁</div>
      <p className="upload-zone-title">
        {fileName ? fileName : "Загрузите файл лекции"}
      </p>
      <p className="upload-zone-subtitle">
        {fileName ? "Файл успешно добавлен" : "Поддерживаются только .PDF файлы до 25 МБ"}
      </p>
    </div>
  );
};