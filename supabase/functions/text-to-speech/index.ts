import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voiceId: overrideVoiceId } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    const elevenLabsApiKey = Deno.env.get('ELEVEN_LABS_API_KEY')
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    // Use a standard ElevenLabs voice that should work with most API keys
    const voiceId = overrideVoiceId || '9BWtsMINqrJLrRacOk9x' // Aria (known-good)

    // Generate speech using ElevenLabs with explicit-voice handling and graceful fallback
    const makeRequest = async (id: string) => {
      return await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5', // Fast, high-quality model
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.8, // More conversational style
            use_speaker_boost: true
          }
        }),
      })
    }

    let response = await makeRequest(voiceId)

    if (!response.ok) {
      const errorText = await response.text()
      const isVoiceError = /voice/i.test(errorText)

      if (isVoiceError && overrideVoiceId) {
        // Explicit voice requested and failed — surface actionable message without fallback
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
      }
    }

    if (!response.ok) {
      const errorText2 = await response.text()
      console.error(`ElevenLabs API error (${response.status}):`, errorText2)
      throw new Error(`ElevenLabs API error: ${errorText2}`)
    }

    // Convert audio buffer to base64 (chunked to avoid stack overflow)
    const arrayBuffer = await response.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const chunkSize = 0x8000
    let binary = ''
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize)
      binary += String.fromCharCode.apply(null, Array.from(chunk) as unknown as number[])
    }
    const base64Audio = btoa(binary)

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})