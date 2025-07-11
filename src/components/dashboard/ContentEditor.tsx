import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Edit3, MousePointer } from 'lucide-react';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const ContentEditor = ({ content, onChange }: ContentEditorProps) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'live'>('edit');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const insertButton = () => {
    if (buttonText && buttonUrl) {
      const buttonSyntax = `[button:${buttonText}](${buttonUrl})`;
      const newContent = content + '\n\n' + buttonSyntax;
      onChange(newContent);
      setButtonText('');
      setButtonUrl('');
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Content Editor
          </CardTitle>
          <div className="flex gap-1">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <MousePointer className="w-4 h-4 mr-1" />
                  Button
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Button</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="button-text">Button Text</Label>
                    <Input
                      id="button-text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Learn More"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="button-url">Button URL</Label>
                    <Input
                      id="button-url"
                      value={buttonUrl}
                      onChange={(e) => setButtonUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <Button onClick={insertButton} disabled={!buttonText || !buttonUrl}>
                    Insert Button
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              size="sm"
              variant={viewMode === 'edit' ? 'default' : 'outline'}
              onClick={() => setViewMode('edit')}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              onClick={() => setViewMode('preview')}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'live' ? 'default' : 'outline'}
              onClick={() => setViewMode('live')}
            >
              Live
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[400px]">
          <MDEditor
            value={content}
            onChange={(val) => onChange(val || '')}
            preview={viewMode === 'edit' ? 'edit' : viewMode === 'preview' ? 'preview' : 'live'}
            hideToolbar={viewMode === 'preview'}
            visibleDragbar={false}
            data-color-mode="dark"
            height={400}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentEditor;