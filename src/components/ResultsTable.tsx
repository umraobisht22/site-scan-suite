import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { LighthouseResult } from '@/types/lighthouse';
import { ExcelService } from '@/services/excelService';
import { useToast } from '@/hooks/use-toast';

interface ResultsTableProps {
  results: LighthouseResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const { toast } = useToast();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-excellent';
    if (score >= 70) return 'text-good';
    if (score >= 50) return 'text-needs-improvement';
    return 'text-poor';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  };

  const handleExport = async () => {
    try {
      await ExcelService.exportResults(results);
      toast({
        title: "Export successful",
        description: "Results have been exported to Excel file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the results",
        variant: "destructive",
      });
    }
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Performance metrics for {results.length} URL{results.length === 1 ? '' : 's'}
            </CardDescription>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[300px]">URL</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Accessibility</TableHead>
                <TableHead>Best Practices</TableHead>
                <TableHead>SEO</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-[280px] truncate" title={result.name}>
                      {result.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={result.pageStatus === 200 ? "default" : "destructive"}
                    >
                      {result.pageStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[280px] truncate text-sm text-muted-foreground" title={result.url}>
                      {result.url}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {result.device === 'mobile' ? (
                        <Smartphone className="h-4 w-4" />
                      ) : (
                        <Monitor className="h-4 w-4" />
                      )}
                      <span className="capitalize">{result.device}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(result.performance)}`}>
                      {result.performance}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(result.accessibility)}`}>
                      {result.accessibility}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(result.bestPractices)}`}>
                      {result.bestPractices}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(result.seo)}`}>
                      {result.seo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(result.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};