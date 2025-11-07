import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Edit3, MousePointer, Video } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import rehypeRaw from 'rehype-raw';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const ContentEditor = ({ content, onChange }: ContentEditorProps) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'live'>('edit');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoAltText, setVideoAltText] = useState('');
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  type MDEModule = typeof import('@uiw/react-md-editor');
  const [mdModule, setMdModule] = useState<MDEModule | null>(null);

  useEffect(() => {
    let mounted = true;
    import('@uiw/react-md-editor').then((mod) => {
      if (mounted) setMdModule(mod);
    });
    return () => { mounted = false; };
  }, []);

  const insertButton = () => {
    if (buttonText && buttonUrl) {
      const buttonSyntax = `\n\n[button:${buttonText}](${buttonUrl})\n\n`;
      const newContent = content.slice(0, cursorPosition) + buttonSyntax + content.slice(cursorPosition);
      onChange(newContent);
      setButtonText('');
      setButtonUrl('');
      setIsDialogOpen(false);
    }
  };

  const insertVideo = () => {
    if (videoUrl) {
      const videoEmbed = `\n\n<video controls width="100%" style="max-width: 100%; height: auto;">\n  <source src="${videoUrl}" type="video/mp4" />\n  Your browser does not support the video tag.\n</video>\n\n`;
      const newContent = content.slice(0, cursorPosition) + videoEmbed + content.slice(cursorPosition);
      onChange(newContent);
      setVideoUrl('');
      setVideoAltText('');
      setIsVideoDialogOpen(false);
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
    execute: (state: any) => {
      const cursorPos = state?.selection?.start || content.length;
      setCursorPosition(cursorPos);
      setIsDialogOpen(true);
    }
  };

  // Custom video command for MDEditor toolbar
  const videoCommand = {
    name: 'video',
    keyCommand: 'video',
    buttonProps: {
      'aria-label': 'Insert Video',
      title: 'Insert Video'
    },
    icon: (
      <Video style={{ width: 12, height: 12 }} />
    ),
    execute: (state: any) => {
      const cursorPos = state?.selection?.start || content.length;
      setCursorPosition(cursorPos);
      setIsVideoDialogOpen(true);
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
            {mdModule ? (
              <mdModule.default
                value={content}
                onChange={(val) => onChange(val || '')}
                preview={viewMode === 'edit' ? 'edit' : viewMode === 'preview' ? 'preview' : 'live'}
                hideToolbar={viewMode === 'preview'}
                visibleDragbar={false}
                data-color-mode="dark"
                height={400}
                previewOptions={{
                  rehypePlugins: [rehypeRaw],
                }}
                textareaProps={{
                  placeholder: 'Write your newsletter content here...'
                }}
                commands={[
                  ...mdModule.commands.getCommands(),
                  mdModule.commands.divider,
                  buttonCommand,
                  videoCommand
                ]}
              />
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-96 w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
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
                autoFocus
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

      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen} modal={true}>
        <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Insert Video</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Position your cursor where you want the video to appear, then paste the video URL below.
          </p>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://yoursite.com/videos/video.mp4"
                onKeyDown={(e) => e.key === 'Enter' && videoUrl && insertVideo()}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Upload videos in the Media Library tab first, then copy the URL here.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video-alt">Video Description (Optional)</Label>
              <Input
                id="video-alt"
                value={videoAltText}
                onChange={(e) => setVideoAltText(e.target.value)}
                placeholder="Describe the video content"
                onKeyDown={(e) => e.key === 'Enter' && videoUrl && insertVideo()}
              />
            </div>
            <Button onClick={insertVideo} disabled={!videoUrl}>
              Insert Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentEditor;