import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { PDFDocument, StandardFonts, rgb } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const { title = 'recipe', text = '' } = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSizeTitle = 18;
    const fontSizeBody = 12;
    const margin = 40;
    let cursorY = height - margin;

    // Draw title
    const safeTitle = String(title).slice(0, 200);
    const titleWidth = titleFont.widthOfTextAtSize(safeTitle, fontSizeTitle);
    page.drawText(safeTitle, {
      x: margin,
      y: cursorY,
      size: fontSizeTitle,
      font: titleFont,
      color: rgb(0, 0, 0),
    });
    cursorY -= fontSizeTitle + 16;

    // Simple word-wrap for body text
    const wrapText = (input: string, maxWidth: number) => {
      const words = input.replace(/\r\n|\r/g, '\n').split(/\s+/);
      const lines: string[] = [];
      let line = '';
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSizeBody);
        if (testWidth > maxWidth && line) {
          lines.push(line);
          line = word;
        } else if (testLine.includes('\n')) {
          const parts = testLine.split('\n');
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const w = font.widthOfTextAtSize(part, fontSizeBody);
            if (w > maxWidth && line) {
              lines.push(line);
              line = part;
            } else {
              line = part;
            }
            if (i < parts.length - 1) {
              lines.push(line);
              line = '';
            }
          }
        } else {
          line = testLine;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    const maxWidth = width - margin * 2;
    const lines = wrapText(String(text), maxWidth);

    const lineHeight = fontSizeBody + 4;
    for (const l of lines) {
      if (cursorY < margin + lineHeight) {
        // new page
        const p = pdfDoc.addPage([612, 792]);
        cursorY = 792 - margin;
        p.drawText(l, { x: margin, y: cursorY, size: fontSizeBody, font, color: rgb(0, 0, 0) });
        page.drawText('', { x: 0, y: 0 }); // keep page referenced
      } else {
        page.drawText(l, { x: margin, y: cursorY, size: fontSizeBody, font, color: rgb(0, 0, 0) });
      }
      cursorY -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();
    const fileName = `${safeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('export-pdf error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate PDF' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});