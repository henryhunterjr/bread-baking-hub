import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

const owner = "henryhunterjr";
const repo = "bread-baking-hub";

export default function GithubReadme() {
  const [branch, setBranch] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("github-proxy", {
          body: { action: "get_repo_file", params: { owner, repo, path: "README.md" } },
        });
        if (error) throw new Error(error.message);
        setBranch(data?.ref || "");
        setText(data?.text || "");
      } catch (e: any) {
        setError(e?.message || "Failed to load README.md");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <Helmet>
        <title>GitHub README - BakingGreatBread</title>
        <meta name="description" content="View README.md from the default branch of the connected repository." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ""} />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Repository README.md</h1>
      <p className="mb-2"><strong>Repo:</strong> {owner}/{repo}</p>
      {loading && <p>Loading…</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <section>
          <p className="mb-4"><strong>Default branch:</strong> {branch}</p>
          <pre className="whitespace-pre-wrap rounded-md p-4 bg-muted/30 text-sm">{text}</pre>
        </section>
      )}
    </main>
  );
}
