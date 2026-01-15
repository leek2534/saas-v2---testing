"use client";



import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crop, ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from '@/lib/utils';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
}

const ASPECT_RATIOS = [
  { value: 'free', label: 'Free', ratio: undefined },
  { value: '1:1', label: 'Square (1:1)', ratio: 1 },
  { value: '4:3', label: 'Standard (4:3)', ratio: 4 / 3 },
  { value: '16:9', label: 'Widescreen (16:9)', ratio: 16 / 9 },
  { value: '3:2', label: 'Photo (3:2)', ratio: 3 / 2 },
  { value: '9:16', label: 'Portrait (9:16)', ratio: 9 / 16 },
];

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropModal({ isOpen, onClose, imageUrl, onCropComplete }: ImageCropModalProps) {
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspectRatio, setAspectRatio] = useState<string>('free');
  const [zoom, setZoom] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const selectedRatio = ASPECT_RATIOS.find(r => r.value === aspectRatio);
    
    if (selectedRatio?.ratio) {
      setCrop(centerAspectCrop(width, height, selectedRatio.ratio));
    } else {
      // Free form - set initial crop to center 80% of image
      setCrop({
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10,
      });
    }
  }, [aspectRatio]);

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const selectedRatio = ASPECT_RATIOS.find(r => r.value === value);
      
      if (selectedRatio?.ratio) {
        setCrop(centerAspectCrop(width, height, selectedRatio.ratio));
      } else {
        // Free form
        setCrop({
          unit: '%',
          width: 80,
          height: 80,
          x: 10,
          y: 10,
        });
      }
    }
  };


  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = canvasRef.current;
      const crop = completedCrop;

      // Calculate scale factors
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      // Set canvas size to crop dimensions
      canvas.width = crop.width;
      canvas.height = crop.height;

      // Enable high quality rendering
      ctx.imageSmoothingQuality = 'high';

      // Calculate crop coordinates in natural image dimensions
      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;

      // Simple crop - draw the cropped section
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        crop.width,
        crop.height
      );

      // Convert to blob and then to data URL
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          
          const reader = new FileReader();
          reader.onloadend = () => {
            const croppedImageUrl = reader.result as string;
            onCropComplete(croppedImageUrl);
            setIsProcessing(false);
            onClose();
          };
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      console.error('Error cropping image:', error);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setZoom(1);
    setAspectRatio('free');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Crop Image
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* Aspect Ratio */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Aspect Ratio:</label>
              <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <ZoomOut className="w-4 h-4 text-gray-500" />
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Reset */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Crop Area */}
          <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
            {imageUrl && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIOS.find(r => r.value === aspectRatio)?.ratio}
                minWidth={50}
                minHeight={50}
                className="max-w-full max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageUrl}
                  style={{
                    transform: `scale(${zoom})`,
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                  }}
                  onLoad={onImageLoad}
                  crossOrigin="anonymous"
                />
              </ReactCrop>
            )}
          </div>

          {/* Hidden canvas for processing */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleCropComplete}
            disabled={!completedCrop || isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Apply Crop
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

