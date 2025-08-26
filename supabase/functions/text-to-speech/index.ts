import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Text-to-speech request received:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Reading request body...');
    const { text, voiceId: overrideVoiceId } = await req.json()
    console.log('Request data:', { text: text?.substring(0, 100) + '...', voiceId: overrideVoiceId });

    if (!text) {
      console.error('No text provided');
      throw new Error('Text is required')
    }

    const elevenLabsApiKey = Deno.env.get('ELEVEN_LABS_API_KEY')
    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not found in environment');
      throw new Error('ElevenLabs API key not configured')
    }
    console.log('ElevenLabs API key found');

    // Use user's custom voice as default, with Aria as fallback
    const voiceId = overrideVoiceId || 'wAGzRVkxKEs8La0lmdrE' // User's preferred custom voice
    console.log('Using voice ID:', voiceId);

    // Generate speech using ElevenLabs with explicit-voice handling and graceful fallback
    const makeRequest = async (id: string) => {
      console.log('Making ElevenLabs request with voice ID:', id);
      const requestBody = {
        text,
        model_id: 'eleven_turbo_v2_5', // Fast, high-quality model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.8, // More conversational style
          use_speaker_boost: true
        }
      };
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      return await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
    }

    let response = await makeRequest(voiceId)
    console.log('Initial response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', response.status, errorText);
      const isVoiceError = /voice/i.test(errorText)

      if (isVoiceError && overrideVoiceId) {
        // Explicit voice requested and failed — surface actionable message without fallback
        console.log('Explicit voice request failed, returning voice unavailable error');
        return new Response(
          JSON.stringify({
            code: 'ELEVEN_VOICE_UNAVAILABLE',
            message: 'Requested ElevenLabs voice is not available to your account. Add it to your library and ensure you are under your custom voice limit, then try again.'
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // If voice-related and no explicit override, fall back to a reliable default voice
      if (isVoiceError) {
        console.warn('ElevenLabs voice error, falling back to Aria voice. Details:', errorText)
        response = await makeRequest('9BWtsMINqrJLrRacOk9x') // Aria
        console.log('Fallback response status:', response.status);
      }
    }

    if (!response.ok) {
      const errorText2 = await response.text()
      console.error(`ElevenLabs API error after fallback (${response.status}):`, errorText2)
      throw new Error(`ElevenLabs API error: ${errorText2}`)
    }

    console.log('Speech generation successful, processing audio...');
    // Convert audio buffer to base64 (chunked to avoid stack overflow)
    const arrayBuffer = await response.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    console.log('Audio buffer size:', bytes.length);
    
    const chunkSize = 0x8000
    let binary = ''
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize)
      binary += String.fromCharCode.apply(null, Array.from(chunk) as unknown as number[])
    }
    const base64Audio = btoa(binary)
    console.log('Base64 audio encoded, size:', base64Audio.length);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Text-to-speech function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})