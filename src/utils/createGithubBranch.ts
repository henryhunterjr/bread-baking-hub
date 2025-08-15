import { supabase } from '@/integrations/supabase/client';

export async function createGithubBranch(branchName: string) {
  const owner = "devinhalladay"; // From your existing GitHub pages
  const repo = "bread-baking-hub"; // From your existing GitHub pages
  
  try {
    const response = await supabase.functions.invoke("github-proxy", {
      body: {
        action: "branch_and_commit",
        params: {
          owner,
          repo,
          new_branch: branchName,
          path: "branch-created.txt",
          content: `Branch ${branchName} created via Lovable GitHub proxy`,
          message: `Create ${branchName} branch`,
        },
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to create branch");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating branch:", error);
    throw error;
  }
}