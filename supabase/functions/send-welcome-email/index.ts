import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  facebookGroupMember: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, facebookGroupMember }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email} (Facebook member: ${facebookGroupMember})`);

    const facebookContent = facebookGroupMember
      ? `
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2563eb; margin: 0 0 10px 0;">👥 Facebook Group Member Benefits</h3>
          <p style="margin: 0; color: #64748b;">
            Thanks for being part of our Facebook community! You'll receive exclusive content 
            and early access to new recipes designed especially for our group members.
          </p>
        </div>
      `
      : `
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #d97706; margin: 0 0 10px 0;">🌟 Join Our Facebook Community</h3>
          <p style="margin: 0 0 10px 0; color: #92400e;">
            Want even more baking support? Join our "Baking Great Bread at Home" Facebook group 
            with over 15,000 passionate bakers!
          </p>
          <a href="https://bit.ly/3srdSYS" style="color: #2563eb; text-decoration: none; font-weight: bold;">
            Join the Facebook Group →
          </a>
        </div>
      `;

    const emailResponse = await resend.emails.send({
      from: "Henry from Baking Great Bread <henrysbreadkitchen@gmail.com>",
      to: [email],
      subject: `Welcome to our baking community, ${name}! 🍞`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Baking Great Bread</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B4513; margin: 0;">🍞 Baking Great Bread</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Your journey to artisan bread starts here!</p>
          </div>

          <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <h2 style="color: #8B4513; margin: 0 0 20px 0;">Welcome, ${name}! 👋</h2>
            
            <p>Thank you for joining our baking community! I'm Henry, and I'm excited to help you on your bread baking journey.</p>
            
            <p>Here's what you can expect from us:</p>
            
            <ul style="color: #555;">
              <li><strong>Weekly Tips:</strong> Practical advice to improve your bread baking</li>
              <li><strong>New Recipes:</strong> Carefully tested recipes with detailed instructions</li>
              <li><strong>Troubleshooting Guides:</strong> Solutions to common baking challenges</li>
              <li><strong>Community Support:</strong> Access to our helpful community of bakers</li>
            </ul>

            ${facebookContent}

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #475569; margin: 0 0 10px 0;">🚀 Get Started Right Away</h3>
              <p style="margin: 0 0 15px 0;">Visit our website to explore:</p>
              <ul style="margin: 0; padding-left: 20px;">
                <li><a href="https://bread-baking-hub.vercel.app/recipes" style="color: #2563eb;">Browse Recipes</a></li>
                <li><a href="https://bread-baking-hub.vercel.app/troubleshooting" style="color: #2563eb;">Troubleshooting Guide</a></li>
                <li><a href="https://bread-baking-hub.vercel.app/recipe-workspace" style="color: #2563eb;">Recipe Workspace</a></li>
              </ul>
            </div>

            <p>Questions? Just reply to this email - I personally read and respond to every message.</p>
            
            <p style="margin-top: 30px;">
              Happy baking!<br>
              <strong>Henry Hunter Jr.</strong><br>
              <em>Founder, Baking Great Bread at Home</em>
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">
            <p>
              © 2025 Baking Great Bread at Home | 
              <a href="https://bread-baking-hub.vercel.app/my-favorites" style="color: #2563eb;">Manage Subscription</a>
            </p>
            <p>You received this email because you subscribed to our newsletter.</p>
          </div>

        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);