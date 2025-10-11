import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { CheckCircle2, XCircle, Server, Clock, AlertCircle, Award } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface VerificationResultProps {
  result: {
    valid: boolean;
    credential?: any;
    verifiedBy: string;
    verifiedAt: string;
    message: string;
  };
}

export function VerificationResult({ result }: VerificationResultProps) {
  return (
    <Card className={`border-0 shadow-2xl overflow-hidden ${
      result.valid 
        ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/50 dark:via-emerald-950/50 dark:to-teal-950/50' 
        : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950/50 dark:via-rose-950/50 dark:to-pink-950/50'
    }`}>
      <CardHeader className={`text-center py-8 ${
        result.valid 
          ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500' 
          : 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500'
      } text-white`}>
        <div className="flex justify-center mb-2">
          {result.valid ? (
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
          ) : (
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
              <XCircle className="h-16 w-16 text-white" />
            </div>
          )}
        </div>
        <CardTitle className="text-3xl font-bold mb-4">
          {result.valid ? 'Verification Successful' : 'Verification Failed'}
        </CardTitle>
        <Badge variant={result.valid ? 'success' : 'destructive'} className="bg-white/30 backdrop-blur-sm text-white border-white/50 text-base px-4 py-1">
          {result.valid ? '✓ Valid Credential' : '✗ Invalid Credential'}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6 p-8">
        <div className={`p-4 rounded-xl ${
          result.valid 
            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
              result.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`} />
            <div>
              <p className="font-semibold mb-1">Status Message</p>
              <p className="text-sm">{result.message}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/70 dark:bg-black/20 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Server className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-semibold text-muted-foreground">Verified By</span>
            </div>
            <p className="font-mono font-medium text-lg">{result.verifiedBy}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-black/20 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-semibold text-muted-foreground">Verified At</span>
            </div>
            <p className="font-medium">{formatDate(result.verifiedAt)}</p>
          </div>
        </div>

        {result.valid && result.credential && (
          <div className="p-6 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-950/30 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Credential Details
              </h3>
            </div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credential ID</p>
                  <p className="font-mono text-sm font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                    {result.credential.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="font-semibold text-lg">{result.credential.credentialType}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Holder Name</p>
                  <p className="font-semibold">{result.credential.holderName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold">{result.credential.holderEmail}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issued By</p>
                  <p className="font-mono font-medium">{result.credential.issuedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issued At</p>
                  <p className="font-medium">{formatDate(result.credential.issuedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}