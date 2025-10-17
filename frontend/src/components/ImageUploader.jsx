import React, { useState, useRef } from 'react';

/**
 * 画像アップロードコンポーネント
 */
const ImageUploader = ({ label, onImageSelect, selectedImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // ドラッグイベントのハンドラ
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // ドロップイベントのハンドラ
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // ファイル選択のハンドラ
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // ファイル処理
  const handleFile = (file) => {
    // ファイル形式のチェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('JPEG または PNG 形式の画像を選択してください');
      return;
    }

    // ファイルサイズのチェック（10MB以下）
    if (file.size > 10 * 1024 * 1024) {
      alert('ファイルサイズは10MB以下にしてください');
      return;
    }

    // プレビュー用のData URLを生成
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // 親コンポーネントに通知
    onImageSelect(file);
  };

  // クリックでファイル選択ダイアログを開く
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // 選択された画像のプレビューを更新
  React.useEffect(() => {
    if (selectedImage && !preview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else if (!selectedImage) {
      setPreview(null);
    }
  }, [selectedImage]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
          ${dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : preview 
            ? 'border-green-500 bg-green-500/5'
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleChange}
        />

        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="プレビュー"
              className="w-full h-48 object-contain rounded"
            />
            <div className="text-center">
              <p className="text-sm text-green-400">画像が選択されました</p>
              <p className="text-xs text-gray-400 mt-1">クリックして変更</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-300">
                クリックして画像を選択
              </p>
              <p className="text-xs text-gray-400">
                または ドラッグ&ドロップ
              </p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG (最大 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

