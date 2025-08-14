import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';

interface UrlInputProps {
  onUrlsSubmit: (urls: string[]) => void;
  isProcessing: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onUrlsSubmit, isProcessing }) => {
  const [manualUrls, setManualUrls] = useState('');
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const handleManualSubmit = () => {
    if (!manualUrls.trim()) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL",
        variant: "destructive",
      });
      return;
    }

    const urls = manualUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      });

    onUrlsSubmit(urls);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv' || fileExtension === 'txt') {
      Papa.parse(file, {
        complete: (results) => {
          const urls: string[] = [];
          results.data.forEach((row: any) => {
            if (Array.isArray(row)) {
              row.forEach(cell => {
                if (typeof cell === 'string' && cell.trim()) {
                  const url = cell.trim();
                  if (url.includes('.') && !url.includes(' ')) {
                    urls.push(url.startsWith('http') ? url : `https://${url}`);
                  }
                }
              });
            }
          });
          
          if (urls.length > 0) {
            setFileUrls(urls);
            toast({
              title: "File uploaded successfully",
              description: `Found ${urls.length} URLs`,
            });
          } else {
            toast({
              title: "No URLs found",
              description: "Please check your file format",
              variant: "destructive",
            });
          }
        },
        error: (error) => {
          toast({
            title: "File parsing error",
            description: error.message,
            variant: "destructive",
          });
        }
      });
    } else {
      toast({
        title: "Unsupported file format",
        description: "Please upload a CSV or TXT file",
        variant: "destructive",
      });
    }

    // Reset the input
    event.target.value = '';
  };

  const handleFileSubmit = () => {
    if (fileUrls.length === 0) {
      toast({
        title: "No file uploaded",
        description: "Please upload a file with URLs",
        variant: "destructive",
      });
      return;
    }

    onUrlsSubmit(fileUrls);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Website URLs Input
        </CardTitle>
        <CardDescription>
          Add websites to test performance on both mobile and desktop devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-urls">Enter URLs (one per line)</Label>
              <Textarea
                id="manual-urls"
                placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
                value={manualUrls}
                onChange={(e) => setManualUrls(e.target.value)}
                className="min-h-[120px]"
                disabled={isProcessing}
              />
            </div>
            <Button 
              onClick={handleManualSubmit} 
              disabled={isProcessing || !manualUrls.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Testing
            </Button>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload CSV or TXT file</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Click to upload CSV or TXT file
                  </div>
                </Label>
              </div>
              {fileUrls.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  ✓ {fileUrls.length} URLs loaded from file
                </div>
              )}
            </div>
            <Button 
              onClick={handleFileSubmit} 
              disabled={isProcessing || fileUrls.length === 0}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Testing
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};