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

    // Use preferred ElevenLabs voice by default, allow override via request
    const voiceId = overrideVoiceId || 'wAGzRVkxKEs8La0lmdrE' // AI Krusty default voice

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

      if (isVoiceError) {
        // Fallback to a reliable male default voice (Daniel) to keep UX smooth
        console.warn('Requested ElevenLabs voice failed; falling back to Daniel. Details:', errorText)
        const fallbackId = 'onwK4e9ZLuTAKqWW03F9' // Daniel
        const fallbackResponse = await makeRequest(fallbackId)
        if (!fallbackResponse.ok) {
          const err2 = await fallbackResponse.text()
          console.error(`Fallback voice failed (${fallbackResponse.status}):`, err2)
          throw new Error(`ElevenLabs API error after fallback: ${err2}`)
        }
        response = fallbackResponse
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