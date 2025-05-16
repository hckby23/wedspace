
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Image, Video } from 'lucide-react';
import { toast } from 'sonner';

interface MediaUploaderProps {
  maxFiles?: number;
  allowedTypes?: string[];
  onUpload?: (files: File[]) => void;
  onDelete?: (fileIndex: number) => void;
  existingMedia?: Array<{ type: 'image' | 'video'; url: string }>;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  maxFiles = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
  onUpload,
  onDelete,
  existingMedia = [],
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string }>>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length + files.length + existingMedia.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== selectedFiles.length) {
      toast.error('Some files were not added because they have unsupported formats.');
    }
    
    // Create previews for valid files
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    
    if (onUpload) {
      onUpload([...files, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index].preview);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    
    if (onDelete) {
      onDelete(index);
    }
  };

  const handleDeleteExisting = (index: number) => {
    if (onDelete) {
      onDelete(index);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Upload Media</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload photos and videos to showcase your business. You can upload up to {maxFiles} files.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <div className="flex justify-center mb-4">
            <Image className="h-10 w-10 text-gray-400 mr-2" />
            <Video className="h-10 w-10 text-gray-400" />
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your images or videos, or click to browse
          </p>
          
          <Label 
            htmlFor="media-upload" 
            className="bg-wed text-white px-4 py-2 rounded cursor-pointer hover:bg-wed/90 transition-colors"
          >
            Select Files
          </Label>
          
          <input
            id="media-upload"
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />
          
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, WEBP, MP4
          </p>
        </div>
      </div>

      {/* Preview section for existing media */}
      {existingMedia.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Existing Media</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingMedia.map((media, index) => (
              <div key={`existing-${index}`} className="relative group">
                {media.type === 'image' ? (
                  <img 
                    src={media.url} 
                    alt="Uploaded content" 
                    className="h-32 w-full object-cover rounded-md"
                  />
                ) : (
                  <video 
                    src={media.url} 
                    className="h-32 w-full object-cover rounded-md"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(index)}
                  className="absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview section for new uploads */}
      {previews.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">New Uploads</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((item, index) => (
              <div key={index} className="relative group">
                {item.file.type.startsWith('image/') ? (
                  <img 
                    src={item.preview} 
                    alt="Preview" 
                    className="h-32 w-full object-cover rounded-md"
                  />
                ) : (
                  <video 
                    src={item.preview} 
                    className="h-32 w-full object-cover rounded-md"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
