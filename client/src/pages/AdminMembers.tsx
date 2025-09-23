import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Users, Phone, Calendar, Star, Receipt, Edit, Trash2, Download, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as XLSX from 'xlsx';

type AdminMemberData = {
  id: string;
  namaLengkap: string;
  jenisKelamin: string;
  noWhatsApp: string;
  tanggalLahir: string;
  kodePos: string;
  // pinHash is excluded for security
  totalPoints: number;
  billsCount: number;
};

const memberEditSchema = z.object({
  namaLengkap: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  jenisKelamin: z.enum(['Uda', 'Uni']),
  noWhatsApp: z.string().min(10, 'Nomor WhatsApp minimal 10 digit'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir harus diisi'),
  kodePos: z.string().min(5, 'Kode pos minimal 5 digit').max(5, 'Kode pos maksimal 5 digit'),
});

type MemberEditFormData = z.infer<typeof memberEditSchema>;

export default function AdminMembers() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminMemberData | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { data: membersData, isLoading } = useQuery<{ success: boolean; data: AdminMemberData[] }>({
    queryKey: ['/api/admin/members'],
    enabled: true,
  });

  const members: AdminMemberData[] = membersData?.data || [];

  const editForm = useForm<MemberEditFormData>({
    resolver: zodResolver(memberEditSchema),
    defaultValues: {
      namaLengkap: '',
      jenisKelamin: 'Uni',
      noWhatsApp: '',
      tanggalLahir: '',
      kodePos: '',
    },
  });

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: async (data: MemberEditFormData & { id: string }) => {
      const response = await fetch(`/api/admin/members/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namaLengkap: data.namaLengkap,
          jenisKelamin: data.jenisKelamin,
          noWhatsApp: data.noWhatsApp,
          tanggalLahir: data.tanggalLahir,
          kodePos: data.kodePos,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update member');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Data member berhasil diperbarui!",
        description: "Perubahan data member telah disimpan.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/members'] });
      setIsEditDialogOpen(false);
      setEditingMember(null);
      editForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Gagal memperbarui data member",
        description: error.message || "Terjadi kesalahan saat memperbarui data member",
        variant: "destructive",
      });
    },
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member berhasil dihapus!",
        description: "Data member telah dihapus dari sistem.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/members'] });
      setDeleteMemberId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menghapus member",
        description: error.message || "Terjadi kesalahan saat menghapus member",
        variant: "destructive",
      });
    },
  });

  // Export to Excel function
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      // Prepare data for export with comprehensive format
      const exportData = members.map((member, index) => ({
        'No': index + 1,
        'ID Member': member.id,
        'Nama Lengkap': member.namaLengkap,
        'Jenis Kelamin': member.jenisKelamin,
        'No WhatsApp': formatPhoneNumber(member.noWhatsApp),
        'Tanggal Lahir': formatDate(member.tanggalLahir),
        'Usia': new Date().getFullYear() - new Date(member.tanggalLahir).getFullYear() + ' tahun',
        'Kode Pos': member.kodePos,
        'Total Points': member.totalPoints,
        'Total Transaksi': member.billsCount,
        'Rata-rata Points per Transaksi': member.billsCount > 0 ? Math.round(member.totalPoints / member.billsCount) : 0,
        'Kategori Member': member.totalPoints >= 5000 ? 'Gold' : member.totalPoints >= 2000 ? 'Silver' : 'Bronze',
        'Status Aktivitas': member.billsCount > 0 ? 'Aktif' : 'Tidak Aktif',
        'Tanggal Export': new Date().toLocaleDateString('id-ID'),
        'Segmentasi Demographics': `${member.jenisKelamin}, ${member.kodePos}`,
      }));

      // Create summary data for analysis
      const totalMembers = members.length;
      const activeMembers = members.filter(m => m.billsCount > 0).length;
      const totalPoints = members.reduce((sum, m) => sum + m.totalPoints, 0);
      const totalTransactions = members.reduce((sum, m) => sum + m.billsCount, 0);
      const avgPointsPerMember = totalMembers > 0 ? Math.round(totalPoints / totalMembers) : 0;
      const avgTransactionsPerMember = totalMembers > 0 ? Math.round(totalTransactions / totalMembers) : 0;

      const summaryData = [{
        'Metrik': 'Total Member',
        'Nilai': totalMembers,
        'Keterangan': 'Jumlah member terdaftar'
      }, {
        'Metrik': 'Member Aktif',
        'Nilai': activeMembers,
        'Keterangan': `${((activeMembers/totalMembers) * 100).toFixed(1)}% dari total member`
      }, {
        'Metrik': 'Total Points',
        'Nilai': totalPoints.toLocaleString('id-ID'),
        'Keterangan': 'Akumulasi points seluruh member'
      }, {
        'Metrik': 'Total Transaksi',
        'Nilai': totalTransactions.toLocaleString('id-ID'),
        'Keterangan': 'Total transaksi seluruh member'
      }, {
        'Metrik': 'Rata-rata Points per Member',
        'Nilai': avgPointsPerMember.toLocaleString('id-ID'),
        'Keterangan': 'Points rata-rata yang dimiliki member'
      }, {
        'Metrik': 'Rata-rata Transaksi per Member',
        'Nilai': avgTransactionsPerMember.toLocaleString('id-ID'),
        'Keterangan': 'Jumlah transaksi rata-rata per member'
      }];

      // Create demographic breakdown
      const demographicData = members.reduce((acc: any, member) => {
        const key = `${member.jenisKelamin}_${member.kodePos}`;
        if (!acc[key]) {
          acc[key] = {
            'Jenis Kelamin': member.jenisKelamin,
            'Kode Pos': member.kodePos,
            'Jumlah Member': 0,
            'Total Points': 0,
            'Total Transaksi': 0
          };
        }
        acc[key]['Jumlah Member']++;
        acc[key]['Total Points'] += member.totalPoints;
        acc[key]['Total Transaksi'] += member.billsCount;
        return acc;
      }, {});

      const demographicExport = Object.values(demographicData);

      // Create Excel workbook with multiple sheets using xlsx library
      const wb = XLSX.utils.book_new();
      
      // Create worksheets from data
      const memberSheet = XLSX.utils.json_to_sheet(exportData);
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      const demographicSheet = XLSX.utils.json_to_sheet(demographicExport);
      
      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(wb, memberSheet, 'Data Member');
      XLSX.utils.book_append_sheet(wb, summarySheet, 'Ringkasan');
      XLSX.utils.book_append_sheet(wb, demographicSheet, 'Demografis');
      
      // Generate Excel file and download
      const fileName = `data-member-gadang-barubah-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast({
        title: "Export berhasil!",
        description: `Data ${totalMembers} member berhasil diekspor dengan format lengkap untuk analisis.`,
      });
    } catch (error) {
      toast({
        title: "Export gagal",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleEditMember = (member: AdminMemberData) => {
    setEditingMember(member);
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    editForm.reset({
      namaLengkap: member.namaLengkap,
      jenisKelamin: member.jenisKelamin as 'Uda' | 'Uni',
      noWhatsApp: member.noWhatsApp,
      tanggalLahir: formatDateForInput(member.tanggalLahir),
      kodePos: member.kodePos,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteMember = (memberId: string) => {
    setDeleteMemberId(memberId);
  };

  const confirmDeleteMember = () => {
    if (deleteMemberId) {
      deleteMemberMutation.mutate(deleteMemberId);
    }
  };

  const onEditSubmit = (data: MemberEditFormData) => {
    if (editingMember) {
      updateMemberMutation.mutate({ ...data, id: editingMember.id });
    }
  };

  // Filter members based on search query
  const filteredMembers = members.filter((member: AdminMemberData) =>
    member.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.noWhatsApp.includes(searchQuery) ||
    member.kodePos.includes(searchQuery)
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    // Format phone number for display
    return phoneNumber.startsWith('62') ? `+${phoneNumber}` : phoneNumber;
  };

  return (
    <>
      <Helmet>
        <title>Data Member - Admin Gadang Barubah</title>
        <meta name="description" content="Data member dan statistik points sistem Gadang Barubah" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/admin')}
                data-testid="button-back-admin"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Logo />
                <div>
                  <h1 className="font-semibold text-lg">Data Member</h1>
                  <Badge variant="secondary" className="text-xs">
                    Administrator
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={exportToExcel}
                disabled={isExporting || members.length === 0}
                data-testid="button-export-excel"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari member (nama, WhatsApp, kode pos)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-members"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-total-members">{members.length}</p>
                  <p className="text-sm text-muted-foreground">Total Member</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-total-points">
                    {members.reduce((sum: number, member: AdminMemberData) => sum + member.totalPoints, 0).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Receipt className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-total-transactions">
                    {members.reduce((sum: number, member: AdminMemberData) => sum + member.billsCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Transaksi</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-active-members">
                    {members.filter((member: AdminMemberData) => member.billsCount > 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Member Aktif</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Members List */}
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-6 bg-muted rounded w-16"></div>
                          <div className="h-3 bg-muted rounded w-12"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'Member tidak ditemukan' : 'Belum ada member'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Coba gunakan kata kunci lain untuk pencarian' : 'Member baru akan muncul di sini setelah registrasi'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {searchQuery ? `Hasil pencarian: ${filteredMembers.length}` : `${filteredMembers.length} Member`}
                  </h2>
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSearchQuery('')}
                      data-testid="button-clear-search"
                    >
                      Hapus Filter
                    </Button>
                  )}
                </div>

                {filteredMembers.map((member: AdminMemberData) => (
                  <Card key={member.id} className="hover-elevate" data-testid={`card-member-${member.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {member.jenisKelamin === 'Uda' ? '🤵' : '👩'}
                          </span>
                        </div>

                        {/* Member Info */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold" data-testid={`text-member-name-${member.id}`}>
                              {member.namaLengkap}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {member.jenisKelamin}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span data-testid={`text-member-phone-${member.id}`}>
                              {formatPhoneNumber(member.noWhatsApp)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(member.tanggalLahir)}</span>
                            </div>
                            <div>
                              Kode Pos: {member.kodePos}
                            </div>
                          </div>
                        </div>

                        {/* Stats and Actions */}
                        <div className="text-right space-y-1">
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                              <Star className="h-3 w-3 mr-1" />
                              {member.totalPoints.toLocaleString('id-ID')} pts
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Receipt className="h-3 w-3 mr-1" />
                              {member.billsCount} transaksi
                            </Badge>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-1 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditMember(member)}
                              data-testid={`button-edit-member-${member.id}`}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteMember(member.id)}
                              data-testid={`button-delete-member-${member.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Member</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="namaLengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-nama-lengkap" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="jenisKelamin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-jenis-kelamin">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Uni">Uni (Perempuan)</SelectItem>
                        <SelectItem value="Uda">Uda (Laki-laki)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="noWhatsApp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="628xxxxx" data-testid="input-edit-no-whatsapp" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="tanggalLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-edit-tanggal-lahir" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="kodePos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Pos</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="25000" maxLength={5} data-testid="input-edit-kode-pos" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                  data-testid="button-cancel-edit"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={updateMemberMutation.isPending}
                  data-testid="button-save-edit"
                >
                  {updateMemberMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteMemberId} onOpenChange={() => setDeleteMemberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Member</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus member ini? Semua data termasuk riwayat transaksi dan points akan hilang secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMember}
              disabled={deleteMemberMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMemberMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}