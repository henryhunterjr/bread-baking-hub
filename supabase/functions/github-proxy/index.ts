import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const GITHUB_API = "https://api.github.com";

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const token = Deno.env.get("GITHUB_PAT");
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Missing GITHUB_PAT secret. Please add it in Supabase secrets." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { action, params } = (await req.json()) as {
      action: string;
      params: Record<string, unknown>;
    };

    if (!action) {
      return new Response(JSON.stringify({ error: "Missing 'action' in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Simple allowlist of supported actions (add more as needed)
    switch (action) {
      case "get_file": {
        const owner = String(params?.owner || "").trim();
        const repo = String(params?.repo || "").trim();
        const path = String(params?.path || "").replace(/^\/+/, "");
        const ref = params?.ref ? String(params.ref) : undefined;
        if (!owner || !repo || !path) {
          return new Response(JSON.stringify({ error: "owner, repo and path are required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const url = new URL(`${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`);
        if (ref) url.searchParams.set("ref", ref);
        const ghRes = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const data = await ghRes.json();
        if (!ghRes.ok) {
          return new Response(JSON.stringify({ error: data?.message || "GitHub error", status: ghRes.status }), {
            status: ghRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_contents": {
        const owner = String(params?.owner || "").trim();
        const repo = String(params?.repo || "").trim();
        const path = params?.path ? String(params.path).replace(/^\/+/, "") : "";
        const ref = params?.ref ? String(params.ref) : undefined;
        if (!owner || !repo) {
          return new Response(JSON.stringify({ error: "owner and repo are required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const base = path
          ? `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`
          : `${GITHUB_API}/repos/${owner}/${repo}/contents`;
        const url = new URL(base);
        if (ref) url.searchParams.set("ref", ref);
        const ghRes = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const data = await ghRes.json();
        if (!ghRes.ok) {
          return new Response(JSON.stringify({ error: data?.message || "GitHub error", status: ghRes.status }), {
            status: ghRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_repo": {
        const owner = String(params?.owner || "").trim();
        const repo = String(params?.repo || "").trim();
        if (!owner || !repo) {
          return new Response(JSON.stringify({ error: "owner and repo are required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const ghRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const data = await ghRes.json();
        if (!ghRes.ok) {
          return new Response(JSON.stringify({ error: data?.message || "GitHub error", status: ghRes.status }), {
            status: ghRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_branches": {
        const owner = String(params?.owner || "").trim();
        const repo = String(params?.repo || "").trim();
        if (!owner || !repo) {
          return new Response(JSON.stringify({ error: "owner and repo are required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const ghRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/branches`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const data = await ghRes.json();
        if (!ghRes.ok) {
          return new Response(JSON.stringify({ error: data?.message || "GitHub error", status: ghRes.status }), {
            status: ghRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_issue": {
        const owner = String(params?.owner || "").trim();
        const repo = String(params?.repo || "").trim();
        const title = String(params?.title || "").trim();
        const body = params?.body ? String(params.body) : undefined;
        const labels = Array.isArray(params?.labels) ? (params!.labels as string[]) : undefined;

        if (!owner || !repo || !title) {
          return new Response(JSON.stringify({ error: "owner, repo and title are required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const ghRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/issues`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body, labels }),
        });
        const data = await ghRes.json();
        if (!ghRes.ok) {
          return new Response(JSON.stringify({ error: data?.message || "GitHub error", status: ghRes.status }), {
            status: ghRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unsupported action: ${action}`, allowed: [
            "get_file",
            "list_contents",
            "get_repo",
            "get_branches",
            "create_issue",
          ] }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (err) {
    console.error("github-proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: (err as Error)?.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
