import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

interface Item {
  name: string;
  type: "file" | "dir" | string;
}

const owner = "henryhunterjr";
const repo = "bread-baking-hub";

export default function GithubRoot() {
  const [branch, setBranch] = useState<string>("");
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        // 1) Get repo to read default branch
        const repoRes = await supabase.functions.invoke("github-proxy", {
          body: { action: "get_repo", params: { owner, repo } },
        });
        if (repoRes.error) throw new Error(repoRes.error.message);
        const defaultBranch = (repoRes.data?.default_branch as string) || "main";
        setBranch(defaultBranch);

        // 2) List root contents of that branch
        const listRes = await supabase.functions.invoke("github-proxy", {
          body: { action: "list_contents", params: { owner, repo, path: "", ref: defaultBranch } },
        });
        if (listRes.error) throw new Error(listRes.error.message);
        const simple: Item[] = (listRes.data as any[]).map((i) => ({ name: i.name, type: i.type }));
        setItems(simple);
      } catch (e: any) {
        setError(e?.message || "Failed to load repository info");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <Helmet>
        <title>GitHub Root - BakingGreatBread</title>
        <meta name="description" content="Default branch and root files for the connected GitHub repository." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ""} />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Repository Root</h1>
      <p className="mb-2"><strong>Repo:</strong> {owner}/{repo}</p>
      {loading && <p>Loading…</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <section>
          <p className="mb-4"><strong>Default branch:</strong> {branch}</p>
          <ul className="list-disc pl-6 space-y-1">
            {items?.map((i) => (
              <li key={i.name}>{i.type === "dir" ? "📁" : "📄"} {i.name}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
