import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ProcessingStats } from '@/types/lighthouse';

interface ProgressTrackerProps {
  stats: ProcessingStats;
  isProcessing: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stats, isProcessing }) => {
  const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const inProgress = stats.total - stats.completed - stats.errors;

  if (!isProcessing && stats.total === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
          Testing Progress
        </CardTitle>
        <CardDescription>
          {isProcessing ? `Currently testing: ${stats.currentUrl}` : 'Testing completed'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Total</div>
              <div className="text-muted-foreground">{stats.total}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {inProgress > 0 ? (
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="text-sm">
              <div className="font-medium">In Progress</div>
              <div className="text-muted-foreground">{inProgress}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <div className="text-sm">
              <div className="font-medium">Completed</div>
              <div className="text-muted-foreground">{stats.completed}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <div className="text-sm">
              <div className="font-medium">Errors</div>
              <div className="text-muted-foreground">{stats.errors}</div>
            </div>
          </div>
        </div>
        
        {stats.errors > 0 && (
          <Badge variant="destructive" className="w-fit">
            {stats.errors} {stats.errors === 1 ? 'URL' : 'URLs'} failed to test
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};