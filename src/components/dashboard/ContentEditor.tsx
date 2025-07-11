import { useState } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
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

  // Debug the dialog state
  console.log('Dialog state:', isDialogOpen);

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

  // Custom button command for MDEditor toolbar
  const buttonCommand = {
    name: 'button',
    keyCommand: 'button',
    buttonProps: {
      'aria-label': 'Insert Button',
      title: 'Insert Button'
    },
    icon: (
      <MousePointer style={{ width: 12, height: 12 }} />
    ),
    execute: () => {
      console.log('Opening button dialog...'); // Debug log
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Content Editor
          </CardTitle>
          <div className="flex gap-1">
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
              commands={[
                ...commands.getCommands(),
                commands.divider,
                buttonCommand
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Button</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Position your cursor where you want the button to appear, then fill out the form below.
          </p>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Shop Wire Monkey Tools"
                onKeyDown={(e) => e.key === 'Enter' && buttonUrl && insertButton()}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="button-url">Button URL</Label>
              <Input
                id="button-url"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="https://wiremonkeyshop.com/?ref=bakinggreatbread"
                onKeyDown={(e) => e.key === 'Enter' && buttonText && insertButton()}
              />
            </div>
            <Button onClick={insertButton} disabled={!buttonText || !buttonUrl}>
              Insert Button
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentEditor;