'use client'

import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface ScreenshotUploadProps {
  onAnalysis?: (result: any) => void
  className?: string
}

export function ScreenshotUpload({ onAnalysis, className }: ScreenshotUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, GIF, etc.)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Convert to base64
      const base64 = await fileToBase64(file)
      
      // Send to OCR API
      const response = await fetch('/api/ocr-explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          extractText: true
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed')
      }

      // Call callback with results
      onAnalysis?.(result)

    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Upload failed')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    if (e.dataTransfer.files?.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          const dt = new DataTransfer()
          dt.items.add(file)
          handleFiles(dt.files)
        }
        break
      }
    }
  }

  const clearPreview = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <Card className="p-6">
        {!preview ? (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
              }
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            onPaste={handlePaste}
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              disabled={isUploading}
            />

            <div className="space-y-4">
              <div className="text-4xl">📸</div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Upload Error Screenshot
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Drag & drop, click to browse, or paste from clipboard
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  variant="outline"
                  disabled={isUploading}
                  className="cursor-pointer"
                >
                  {isUploading ? 'Analyzing...' : 'Choose File'}
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Focus for paste functionality
                    e.currentTarget.focus()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
                      // Paste will be handled by onPaste on the container
                    }
                  }}
                >
                  Or paste with Ctrl+V
                </Button>
              </div>

              <div className="text-xs text-gray-500">
                Supports PNG, JPG, GIF • Max 10MB
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={preview} 
                alt="Uploaded screenshot" 
                className="w-full h-48 object-contain border rounded-lg bg-gray-50 dark:bg-gray-900"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={clearPreview}
                className="absolute top-2 right-2"
              >
                ×
              </Button>
            </div>
            
            {isUploading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  Analyzing screenshot...
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}