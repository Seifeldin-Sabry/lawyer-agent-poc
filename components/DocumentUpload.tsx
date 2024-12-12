'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from "axios";

export default function DocumentUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target?.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.status === 200) {
                alert('Document uploaded successfully')
                router.refresh()
            } else {
                throw new Error('Upload failed')
            }
        } catch (error) {
            console.error('Error uploading document:', error)
            alert('Failed to upload document')
        } finally {
            setUploading(false)
            setFile(null)
        }
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    )
}

