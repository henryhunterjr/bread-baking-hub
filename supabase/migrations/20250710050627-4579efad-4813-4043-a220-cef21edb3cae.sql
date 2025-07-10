-- Create ai_drafts table for incoming AI-generated content
CREATE TABLE public.ai_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('blog', 'newsletter')),
  payload JSONB NOT NULL,
  imported BOOLEAN NOT NULL DEFAULT false,
  discarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_drafts ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_drafts
CREATE POLICY "Service role can insert ai_drafts" 
ON public.ai_drafts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view ai_drafts" 
ON public.ai_drafts 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update ai_drafts" 
ON public.ai_drafts 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete ai_drafts" 
ON public.ai_drafts 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_drafts_updated_at
BEFORE UPDATE ON public.ai_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();