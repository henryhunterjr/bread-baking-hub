import { useEffect } from 'react';
import { useA2HS } from '@/hooks/useA2HS';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import { hapticSuccess } from '@/utils/haptics';

const PwaInstallPrompt = () => {
  const { isSupported, promptInstall } = useA2HS();

  useEffect(() => {
    if (!isSupported) return;

    const id = toast({
      title: 'Install app',
      description: 'Add Baking Great Bread to your home screen for a better mobile experience.',
      action: (
        <Button
          size="sm"
          onClick={async () => {
            const accepted = await promptInstall();
            if (accepted) {
              hapticSuccess();
              toast({ title: 'Installed', description: 'App added to your home screen.' });
            }
          }}
          className="gap-2"
        >
          <Download className="h-4 w-4" /> Install
        </Button>
      ),
    });

    return () => {
      // dismiss is handled internally by the toast system
    };
  }, [isSupported, promptInstall]);

  return null;
};

export default PwaInstallPrompt;
