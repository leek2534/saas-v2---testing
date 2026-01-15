import { useState } from 'react';
import {
  Upload,
  Plus,
  X,
  Palette,
  Type,
  Sparkles,
  Crown,
  Image as ImageIcon,
  Check,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GoogleFontSelector } from '../../components/GoogleFontSelector';

interface BrandColor {
  id: string;
  hex: string;
  name: string;
}

interface BrandLogo {
  id: string;
  url: string;
  type: 'primary' | 'secondary' | 'favicon';
  name: string;
}

interface BrandFont {
  id: string;
  name: string;
  type: 'heading' | 'body';
  family: string;
}

export function BrandKitTab() {
  const [colors, setColors] = useState<BrandColor[]>([
    { id: '1', hex: '#6366F1', name: 'Primary' },
    { id: '2', hex: '#8B5CF6', name: 'Secondary' },
    { id: '3', hex: '#EC4899', name: 'Accent' },
  ]);
  const [logos, setLogos] = useState<BrandLogo[]>([]);
  const [fonts, setFonts] = useState<BrandFont[]>([
    { id: '1', name: 'Montserrat', type: 'heading', family: 'Montserrat, sans-serif' },
    { id: '2', name: 'Open Sans', type: 'body', family: 'Open Sans, sans-serif' },
  ]);
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [editingFontType, setEditingFontType] = useState<'heading' | 'body' | null>(null);

  const handleUploadLogo = (type: 'primary' | 'secondary' | 'favicon') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const newLogo: BrandLogo = {
          id: Date.now().toString(),
          url,
          type,
          name: file.name,
        };
        setLogos([...logos, newLogo]);
        alert(`${type} logo uploaded!`);
      }
    };
    input.click();
  };

  const handleAddColor = () => {
    if (newColorHex) {
      const newColor: BrandColor = {
        id: Date.now().toString(),
        hex: newColorHex,
        name: `Color ${colors.length + 1}`,
      };
      setColors([...colors, newColor]);
      setNewColorHex('#000000');
      setShowColorPicker(false);
    }
  };

  const handleRemoveColor = (id: string) => {
    setColors(colors.filter(c => c.id !== id));
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    alert(`Copied ${hex} to clipboard!`);
  };

  const handleGenerateShades = () => {
    alert('Generating color shades... (AI feature)');
  };

  const handleApplyBrandKit = () => {
    if (confirm('Apply brand kit to all existing designs?')) {
      alert('Brand kit applied to all designs! 🎨');
    }
  };

  const handleAutoApplyToTemplate = () => {
    alert('Brand kit will auto-apply to new templates! ✨');
  };

  const handleFontChange = (type: 'heading' | 'body') => {
    setEditingFontType(type);
    setShowFontSelector(true);
  };

  const handleFontSelect = (fontFamily: string) => {
    if (!editingFontType) return;
    
    const updatedFonts = fonts.map(font => {
      if (font.type === editingFontType) {
        return {
          ...font,
          name: fontFamily,
          family: `${fontFamily}, ${font.type === 'heading' ? 'sans-serif' : 'sans-serif'}`
        };
      }
      return font;
    });
    
    setFonts(updatedFonts);
    setShowFontSelector(false);
    setEditingFontType(null);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">Brand Kit</h1>
                <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  PRO
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                Consistent branding across all your designs
              </p>
            </div>
          </div>
          <Button
            onClick={handleApplyBrandKit}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Sparkles className="w-4 h-4" />
            Apply to All Designs
          </Button>
        </div>

        {/* Logos Section */}
        <section className="mb-8 p-6 border-2 border-border/50 rounded-xl bg-card">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5" />
            <h2 className="text-xl font-bold">Logos</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Upload your brand logos in PNG or SVG format
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Logo */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              {logos.find(l => l.type === 'primary') ? (
                <div className="relative">
                  <img
                    src={logos.find(l => l.type === 'primary')?.url}
                    alt="Primary Logo"
                    className="max-h-32 mx-auto mb-2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogos(logos.filter(l => l.type !== 'primary'))}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm font-semibold mb-2">Primary Logo</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadLogo('primary')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </>
              )}
            </div>

            {/* Secondary Logo */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              {logos.find(l => l.type === 'secondary') ? (
                <div className="relative">
                  <img
                    src={logos.find(l => l.type === 'secondary')?.url}
                    alt="Secondary Logo"
                    className="max-h-32 mx-auto mb-2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogos(logos.filter(l => l.type !== 'secondary'))}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm font-semibold mb-2">Secondary Logo</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadLogo('secondary')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </>
              )}
            </div>

            {/* Favicon */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              {logos.find(l => l.type === 'favicon') ? (
                <div className="relative">
                  <img
                    src={logos.find(l => l.type === 'favicon')?.url}
                    alt="Favicon"
                    className="max-h-32 mx-auto mb-2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogos(logos.filter(l => l.type !== 'favicon'))}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm font-semibold mb-2">Favicon</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadLogo('favicon')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="mb-8 p-6 border-2 border-border/50 rounded-xl bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              <h2 className="text-xl font-bold">Brand Colors</h2>
            </div>
            <Button variant="outline" size="sm" onClick={handleGenerateShades}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Shades
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Add your brand colors and generate complementary shades
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
            {colors.map((color) => (
              <div
                key={color.id}
                className="group relative rounded-xl overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all"
              >
                <div
                  className="aspect-square cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleCopyColor(color.hex)}
                />
                <div className="p-2 bg-card">
                  <p className="text-xs font-semibold truncate">{color.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                </div>
                <button
                  onClick={() => handleRemoveColor(color.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleCopyColor(color.hex)}
                  className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}

            {/* Add Color */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary/50 transition-all"
            >
              <Plus className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs font-semibold">Add Color</span>
            </button>
          </div>

          {showColorPicker && (
            <div className="flex items-center gap-3 p-4 border border-border/50 rounded-lg bg-muted/20">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-16 h-16 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                placeholder="#000000"
                className="flex-1 font-mono"
              />
              <Button onClick={handleAddColor}>
                <Check className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button variant="ghost" onClick={() => setShowColorPicker(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Fonts Section */}
        <section className="mb-8 p-6 border-2 border-border/50 rounded-xl bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5" />
            <h2 className="text-xl font-bold">Typography</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Choose fonts for headings and body text
          </p>

          <div className="space-y-4">
            {fonts.map((font) => (
              <div
                key={font.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-all"
              >
                <div>
                  <p className="text-sm font-semibold capitalize">{font.type} Font</p>
                  <p className="text-2xl font-bold mt-1" style={{ fontFamily: font.family }}>
                    {font.name}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleFontChange(font.type)}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Change Font
                </Button>
              </div>
            ))}

            <Button variant="outline" className="w-full gap-2">
              <Upload className="w-4 h-4" />
              Upload Custom Font
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded">
                PRO
              </span>
            </Button>
          </div>
        </section>

        {/* Autobrander Section */}
        <section className="p-6 border-2 border-primary/50 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">🔥 Autobrander</h2>
              <p className="text-sm text-muted-foreground">
                Apply your brand automatically to any template
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <label className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm font-medium">Auto-apply to new templates</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium">Apply to social media posts</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium">Apply to website funnels</span>
            </label>
          </div>

          <Button
            onClick={handleAutoApplyToTemplate}
            className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Sparkles className="w-4 h-4" />
            Enable Autobrander
          </Button>
        </section>
      </div>

      {/* Font Selector Dialog */}
      <Dialog open={showFontSelector} onOpenChange={setShowFontSelector}>
        <DialogContent className="max-w-2xl h-[600px] p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>
              Choose {editingFontType === 'heading' ? 'Heading' : 'Body'} Font
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Browse 1000+ Google Fonts
            </p>
          </DialogHeader>
          <div className="h-[calc(600px-80px)]">
            <GoogleFontSelector
              selectedFont={fonts.find(f => f.type === editingFontType)?.name || 'Inter'}
              onFontSelect={handleFontSelect}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
