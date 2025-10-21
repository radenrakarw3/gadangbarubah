import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MemberSummaryPanelProps {
  member: {
    id: string;
    namaLengkap: string;
    noWhatsApp: string;
  };
  points: number;
  compact?: boolean;
  className?: string;
}

export default function MemberSummaryPanel({ 
  member, 
  points, 
  compact = false,
  className 
}: MemberSummaryPanelProps) {
  if (compact) {
    return (
      <Card className={cn("", className)} data-testid="member-summary-compact">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium" data-testid="text-member-name-compact">{member.namaLengkap}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground" data-testid="text-member-phone-compact">{member.noWhatsApp}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-md px-3 py-2 border border-primary/20">
              <Gift className="h-4 w-4 text-primary" />
              <div className="text-right">
                <p className="text-lg font-bold text-primary" data-testid="text-member-points-compact">{points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)} data-testid="member-summary-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profil Member
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Nama Lengkap</p>
          <p className="text-lg font-medium" data-testid="text-member-name">{member.namaLengkap}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Nomor WhatsApp</p>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <p className="text-lg" data-testid="text-member-phone">{member.noWhatsApp}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Points</p>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <p className="text-3xl font-bold text-primary" data-testid="text-member-points">{points.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Points tersedia</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
