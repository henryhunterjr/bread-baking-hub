import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

const owner = "henryhunterjr";
const repo = "bread-baking-hub";

export default function GithubWriteTest() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("github-proxy", {
          body: {
            action: "branch_and_commit",
            params: {
              owner,
              repo,
              new_branch: "lovable-access-test",
              path: "lovable-test.txt",
              content: "GitHub proxy write test successful",
              message: "Add lovable-test.txt via github-proxy",
            },
          },
        });
        if (error) throw new Error(error.message);
        setResult(data);
      } catch (e: any) {
        setError(e?.message || "Failed to write to repository");
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
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <pre className="whitespace-pre-wrap rounded-md p-4 bg-muted/30 text-sm">{JSON.stringify(result, null, 2)}</pre>
      )}
    </main>
  );
}
