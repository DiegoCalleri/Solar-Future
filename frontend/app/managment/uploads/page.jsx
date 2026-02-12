'use client'
import React, { useState } from 'react'
import { UPLOAD_FILE } from '@/api/api-utils'
import { endpoints, BASE_URL } from '@/api/config'
import Styles from './page.module.css'

export default function UploadsPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
      
      // Превью для изображений
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Выберите файл для загрузки')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const response = await UPLOAD_FILE(endpoints.upload, file)
      
      if (response instanceof Error) {
        setError(response.message || 'Ошибка загрузки файла')
      } else {
        setResult(response)
        setFile(null)
        setPreview(null)
        // Очищаем input
        const fileInput = document.getElementById('file-input')
        if (fileInput) fileInput.value = ''
      }
    } catch (err) {
      setError('Неожиданная ошибка при загрузке')
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={Styles.uploadsContainer}>
      <h1 className={Styles.title}>Загрузка медиаконтента</h1>
      
      <div className={Styles.uploadSection}>
        <div className={Styles.fileInputWrapper}>
          <label htmlFor="file-input" className={Styles.fileLabel}>
            {file ? file.name : 'Выберите файл'}
          </label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className={Styles.fileInput}
            accept="image/*,video/*,.pdf"
            disabled={uploading}
          />
        </div>

        {preview && (
          <div className={Styles.preview}>
            <img src={preview} alt="Preview" className={Styles.previewImage} />
          </div>
        )}

        {file && (
          <div className={Styles.fileInfo}>
            <p><strong>Имя:</strong> {file.name}</p>
            <p><strong>Размер:</strong> {formatFileSize(file.size)}</p>
            <p><strong>Тип:</strong> {file.type}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={Styles.uploadButton}
        >
          {uploading ? 'Загрузка...' : 'Загрузить файл'}
        </button>

        {error && (
          <div className={Styles.error}>
            <p>❌ {error}</p>
          </div>
        )}

        {result && (
          <div className={Styles.success}>
            <p>✅ {result.message}</p>
            <p><strong>URL:</strong> <a href={`${BASE_URL}${result.url}`} target="_blank" rel="noopener noreferrer">{BASE_URL}{result.url}</a></p>
            {result.url && (
              <div className={Styles.resultPreview}>
                {result.mimetype?.startsWith('image/') && (
                  <img src={`${BASE_URL}${result.url}`} alt="Uploaded" className={Styles.resultImage} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
