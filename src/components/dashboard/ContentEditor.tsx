import { useState, useRef } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, ExternalLink } from 'lucide-react';
import KrustyAssistant from './KrustyAssistant';
import FloatingCTAPanel from './FloatingCTAPanel';
import ReactMarkdown from 'react-markdown';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const ContentEditor = ({ content, onChange }: ContentEditorProps) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'live'>('edit');
  const editorRef = useRef<HTMLDivElement>(null);

  const insertButtonAtCursor = (buttonText: string, buttonUrl: string, openInNewTab: boolean) => {
    const target = openInNewTab ? '{target="_blank"}' : '';
    const buttonSyntax = `[button:${buttonText}](${buttonUrl})${target}`;
    
    // Try to find the MDEditor textarea and insert at cursor position
    const textarea = editorRef.current?.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = content.substring(0, start);
      const after = content.substring(end);
      const newContent = before + buttonSyntax + after;
      
      onChange(newContent);
      
      // Restore cursor position after the inserted button
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + buttonSyntax.length, start + buttonSyntax.length);
      }, 0);
    } else {
      // Fallback: append to end of content
      const newContent = content + '\n\n' + buttonSyntax;
      onChange(newContent);
    }
  };

  const handleKrustyInsert = (insertedContent: string) => {
    const newContent = content + insertedContent;
    onChange(newContent);
  };

  // Custom renderer for buttons in markdown
  const renderButtonMarkdown = (markdown: string) => {
    // Replace button syntax with actual buttons
    const buttonRegex = /\[button:([^\]]+)\]\(([^)]+)\)(\{target="_blank"\})?/g;
    
    // Split content by button occurrences
    const parts = markdown.split(buttonRegex);
    const renderedParts = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 4 === 0) {
        // Regular markdown content
        if (parts[i]) {
          renderedParts.push(
            <div key={`content-${i}`} className="markdown-content">
              <ReactMarkdown>{parts[i]}</ReactMarkdown>
            </div>
          );
        }
      } else if (i % 4 === 1) {
        // Button text (parts[i]), URL (parts[i+1]), target (parts[i+2])
        const buttonText = parts[i];
        const buttonUrl = parts[i + 1];
        const isNewTab = parts[i + 2] === '{target="_blank"}';
        
        if (buttonText && buttonUrl) {
          renderedParts.push(
            <div key={`button-${i}`} className="my-6 text-center">
              <Button
                variant="warm"
                size="lg"
                asChild
                className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold"
              >
                <a
                  href={buttonUrl}
                  target={isNewTab ? "_blank" : "_self"}
                  rel={isNewTab ? "noopener noreferrer" : undefined}
                >
                  {buttonText}
                  {isNewTab && <ExternalLink className="w-5 h-5" />}
                </a>
              </Button>
            </div>
          );
        }
        // Skip the next two parts (URL and target) as they're handled above
        i += 2;
      }
    }

    return <div className="space-y-4">{renderedParts}</div>;
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
              <div className="min-h-[400px]" ref={editorRef}>
                {viewMode === 'preview' ? (
                  <div className="prose prose-lg max-w-none p-4 bg-background rounded border min-h-[400px]">
                    {renderButtonMarkdown(content)}
                  </div>
                ) : (
                  <MDEditor
                    value={content}
                    onChange={(val) => onChange(val || '')}
                    preview={viewMode === 'live' ? 'live' : 'edit'}
                    hideToolbar={false}
                    visibleDragbar={false}
                    data-color-mode="dark"
                    height={400}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <KrustyAssistant 
            content={content}
            onInsertContent={handleKrustyInsert}
          />
        </div>
      </div>

      <FloatingCTAPanel onButtonInsert={insertButtonAtCursor} />
    </div>
  );
};

export default ContentEditor;