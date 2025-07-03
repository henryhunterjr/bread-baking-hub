import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = async () => {
    console.log('WebSocket client connected');
    
    try {
      // Connect to OpenAI Realtime API with proper protocol
      const openAIWS = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`,
        ['realtime', `openai-insecure-api-key.${openAIApiKey}`, 'openai-beta.realtime-v1']
      );

      let sessionCreated = false;

      openAIWS.onopen = () => {
        console.log('✅ Connected to OpenAI Realtime API');
      };

      openAIWS.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 OpenAI message:', data.type);

        // Send session update after session is created
        if (data.type === 'session.created' && !sessionCreated) {
          sessionCreated = true;
          console.log('🔧 Setting up session...');
          const sessionUpdate = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions: `You are Baker's Helper, an expert baking assistant created by Henry. You help users with baking questions, recipe advice, troubleshooting, and techniques. You are enthusiastic, knowledgeable, and friendly. Keep responses conversational and helpful. If you need to provide detailed instructions, break them into clear steps.`,
              voice: 'ballad',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: {
                model: 'whisper-1'
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              tools: [
                {
                  type: 'function',
                  name: 'get_baking_tip',
                  description: 'Get specific baking tips and techniques for common baking challenges',
                  parameters: {
                    type: 'object',
                    properties: {
                      topic: { type: 'string' }
                    },
                    required: ['topic']
                  }
                },
                {
                  type: 'function', 
                  name: 'suggest_substitution',
                  description: 'Suggest ingredient substitutions for baking recipes',
                  parameters: {
                    type: 'object',
                    properties: {
                      ingredient: { type: 'string' },
                      amount: { type: 'string' }
                    },
                    required: ['ingredient']
                  }
                }
              ],
              tool_choice: 'auto',
              temperature: 0.8,
              max_response_output_tokens: 'inf'
            }
          };
          openAIWS.send(JSON.stringify(sessionUpdate));
          console.log('✅ Session update sent');
        }

        // Forward OpenAI messages to client
        try {
          socket.send(event.data);
        } catch (error) {
          console.error('❌ Error forwarding message to client:', error);
        }
      };

      openAIWS.onerror = (error) => {
        console.error('❌ OpenAI WebSocket error:', error);
        try {
          socket.send(JSON.stringify({ 
            type: 'error', 
            error: 'Connection to AI failed' 
          }));
        } catch (e) {
          console.error('❌ Error sending error message:', e);
        }
      };

      openAIWS.onclose = (event) => {
        console.log('🔌 OpenAI WebSocket closed:', event.code, event.reason);
        socket.close();
      };

      // Forward client messages to OpenAI
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📤 Client message:', data.type);
          
          if (openAIWS.readyState === WebSocket.OPEN) {
            openAIWS.send(event.data);
          } else {
            console.error('❌ OpenAI WebSocket not ready, state:', openAIWS.readyState);
          }
        } catch (error) {
          console.error('❌ Error handling client message:', error);
        }
      };

      socket.onclose = () => {
        console.log('🔌 Client disconnected');
        if (openAIWS.readyState === WebSocket.OPEN) {
          openAIWS.close();
        }
      };

    } catch (error) {
      console.error('❌ Error in socket setup:', error);
      socket.close();
    }
  };

  return response;
});