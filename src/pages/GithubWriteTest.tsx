import { useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";

const owner = "henryhunterjr";
const repo = "bread-baking-hub";

export default function GithubWriteTest() {
  const [debug, setDebug] = useState<{ status?: number; bodyText?: string; bodyJson?: any; requestPayload?: any; error?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const requestPayload = {
        action: "branch_and_commit",
        params: {
          owner,
          repo,
          new_branch: "lovable-access-test",
          path: "lovable-test.txt",
          content: "GitHub proxy write test successful",
          message: "Add lovable-test.txt via github-proxy",
        },
      };

      const functionsUrl = "https://ojyckskucneljvuqzrsw.functions.supabase.co/github-proxy";

      try {
        const res = await fetch(functionsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });

        const status = res.status;
        const text = await res.text();
        let json: any = null;
        try {
          json = JSON.parse(text);
        } catch (_) {}

        const debugInfo = { status, bodyText: text, bodyJson: json, requestPayload };
        console.log("github-proxy branch_and_commit result:", debugInfo);
        setDebug(debugInfo);
      } catch (e: any) {
        const debugInfo = { error: e?.message || String(e), requestPayload };
        console.error("github-proxy branch_and_commit error:", debugInfo);
        setDebug(debugInfo);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <Helmet>
        <title>GitHub Write Test - BakingGreatBread</title>
        <meta name="description" content="Create branch and commit a test file via github-proxy." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ""} />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">GitHub Write Test</h1>
      <p className="mb-2"><strong>Repo:</strong> {owner}/{repo}</p>
      {loading && <p>Executing…</p>}
      {!loading && debug && (
        <section className="space-y-4">
          <p><strong>Status:</strong> {debug.status ?? "N/A"}</p>
          <div>
            <h2 className="text-lg font-medium mb-2">Request Payload</h2>
            <pre className="whitespace-pre-wrap rounded-md p-4 bg-muted/30 text-sm">{JSON.stringify(debug.requestPayload, null, 2)}</pre>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">Response Body (text)</h2>
            <pre className="whitespace-pre-wrap rounded-md p-4 bg-muted/30 text-sm">{debug.bodyText || ""}</pre>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">Response Body (JSON)</h2>
            <pre className="whitespace-pre-wrap rounded-md p-4 bg-muted/30 text-sm">{JSON.stringify(debug.bodyJson, null, 2)}</pre>
          </div>
          {debug.error && <p>Error: {debug.error}</p>}
        </section>
      )}
    </main>
  );
}
