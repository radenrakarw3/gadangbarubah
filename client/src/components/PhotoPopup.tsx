import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Upload, X } from 'lucide-react';

export function PhotoPopup() {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedPhoto(result);
        setIsOpen(true); // Langsung buka popup setelah upload
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          data-testid="input-photo-upload"
        />
        <Button 
          className="bg-gold hover:bg-gold/90 text-[#3f1113] shadow-lg"
          data-testid="button-upload-photo"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Foto
        </Button>
      </div>

      {/* Photo Popup */}
      {uploadedPhoto && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md">
            <div className="relative bg-white rounded-lg overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                data-testid="button-close-photo"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Photo - 1:1 Aspect Ratio */}
              <div className="aspect-square w-full">
                <img
                  src={uploadedPhoto}
                  alt="Uploaded photo"
                  className="w-full h-full object-cover"
                  data-testid="img-popup-photo"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}