import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Trash2, ImageIcon, Eye, Power, PowerOff } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import type { Campaign } from '@shared/schema';

export default function AdminCampaigns() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    validFrom: '',
    validUntil: '',
  });

  const { data: campaignsData } = useQuery<{ success: boolean; campaigns: Campaign[] }>({
    queryKey: ['/api/admin/campaigns'],
  });

  const campaigns = campaignsData?.campaigns || [];

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        body: data,
        credentials: 'include',
        // Don't set Content-Type - browser will set it with boundary for FormData
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Campaign berhasil dibuat",
        description: "Popup campaign telah ditambahkan ke sistem",
      });
      setFormData({ title: '', validFrom: '', validUntil: '' });
      setSelectedFile(null);
      setPreviewUrl(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal membuat campaign",
        description: error.message || "Terjadi kesalahan saat mengupload campaign",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      return apiRequest(`/api/admin/campaigns/${id}/status`, 'PATCH', { status });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Status berhasil diubah",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal mengubah status",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/campaigns/${id}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Campaign berhasil dihapus",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menghapus campaign",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.type !== 'image/png') {
      toast({
        title: "Format file salah",
        description: "Hanya file PNG yang diperbolehkan",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File terlalu besar",
        description: "Maksimal ukuran file adalah 2MB",
        variant: "destructive",
      });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      if (img.width === 600 && img.height === 600) {
        setSelectedFile(file);
        setPreviewUrl(url);
      } else {
        toast({
          title: "Ukuran gambar salah",
          description: `Gambar harus exactly 600x600px. File Anda: ${img.width}x${img.height}px`,
          variant: "destructive",
        });
        URL.revokeObjectURL(url);
      }
    };
    
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Gambar belum dipilih",
        description: "Silakan pilih file gambar PNG 600x600px",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append('image', selectedFile);
    data.append('title', formData.title);
    data.append('validFrom', formData.validFrom);
    data.append('validUntil', formData.validUntil);

    uploadMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Kelola Popup Campaign - Admin Gadang Barubah</title>
        <meta name="description" content="Kelola popup campaign untuk landing page Gadang Barubah" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto">
          <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center gap-3 p-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/admin')}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="font-semibold text-lg">Kelola Popup Campaign</h1>
                <p className="text-xs text-muted-foreground">Upload popup untuk landing page</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Campaign Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Judul Campaign</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Contoh: Promo Ramadan 2025"
                      required
                      data-testid="input-campaign-title"
                    />
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center hover-elevate cursor-pointer transition-colors ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                    data-testid="dropzone-campaign-image"
                  >
                    {previewUrl ? (
                      <div className="space-y-3">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="mx-auto rounded-lg shadow-lg max-w-full"
                        />
                        <p className="text-sm text-muted-foreground">
                          {selectedFile?.name} ({(selectedFile!.size / 1024).toFixed(1)} KB)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                        >
                          Ganti Gambar
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Klik atau drag & drop gambar</p>
                          <p className="text-sm text-muted-foreground">PNG, 600x600px, max 2MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="validFrom">Tanggal Mulai</Label>
                      <Input
                        id="validFrom"
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                        required
                        data-testid="input-valid-from"
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Tanggal Berakhir</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        required
                        data-testid="input-valid-until"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={uploadMutation.isPending}
                    data-testid="button-create-campaign"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadMutation.isPending ? 'Mengupload...' : 'Upload Campaign'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Campaign Terdaftar</h2>
              {campaigns.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Belum ada campaign. Upload campaign pertama Anda!
                  </CardContent>
                </Card>
              ) : (
                campaigns.map((campaign) => (
                  <Card key={campaign.id} data-testid={`card-campaign-${campaign.id}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={campaign.imagePath} 
                          alt={campaign.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{campaign.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(campaign.validFrom), 'dd MMM yyyy')} - {format(new Date(campaign.validUntil), 'dd MMM yyyy')}
                              </p>
                            </div>
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                              {campaign.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            <span>{campaign.viewCount} tayangan</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={campaign.status === 'active' ? 'outline' : 'default'}
                              onClick={() => toggleStatusMutation.mutate({ 
                                id: campaign.id, 
                                status: campaign.status === 'active' ? 'inactive' : 'active' 
                              })}
                              disabled={toggleStatusMutation.isPending}
                              data-testid={`button-toggle-${campaign.id}`}
                            >
                              {campaign.status === 'active' ? (
                                <><PowerOff className="h-4 w-4 mr-1" /> Nonaktifkan</>
                              ) : (
                                <><Power className="h-4 w-4 mr-1" /> Aktifkan</>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (confirm('Yakin ingin menghapus campaign ini?')) {
                                  deleteMutation.mutate(campaign.id);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-${campaign.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
