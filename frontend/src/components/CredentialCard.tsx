import { IssuedCredential } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatDate } from '@/lib/utils';
import { Calendar, Mail, User, FileText, Server, Clock } from 'lucide-react';

interface CredentialCardProps {
  credential: IssuedCredential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
  const isExpired = credential.expiryDate && new Date(credential.expiryDate) < new Date();

  return (
    <Card className="hover:shadow-lg transition-all border-2 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 hover:border-blue-400 dark:hover:border-blue-600">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white -m-[1px] rounded-t-lg">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{credential.credentialType}</CardTitle>
          <Badge variant={isExpired ? 'destructive' : 'success'} className="bg-white/20 backdrop-blur-sm">
            {isExpired ? 'Expired' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono text-xs">{credential.id}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Server className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Worker:</span>
            <span className="font-medium">{credential.issuedBy}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Holder:</span>
            <span className="font-medium">{credential.holderName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-xs">{credential.holderEmail}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Issued:</span>
            <span className="text-xs">{formatDate(credential.issueDate)}</span>
          </div>
          
          {credential.expiryDate && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expires:</span>
              <span className="text-xs">{formatDate(credential.expiryDate)}</span>
            </div>
          )}
        </div>

        {credential.metadata && Object.keys(credential.metadata).length > 0 && (
          <div className="mt-2 p-3 bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium mb-2">Metadata:</p>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(credential.metadata, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}