import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createGithubBranch } from "@/utils/createGithubBranch";

export default function CreateBranch() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleCreateBranch = async () => {
    setLoading(true);
    setStatus("Creating branch...");
    
    try {
      const result = await createGithubBranch("fix/pwa-cache-snag");
      setStatus(`Branch created successfully! New branch: ${result.new_branch}`);
      console.log("Branch creation result:", result);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      console.error("Failed to create branch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Create GitHub Branch</h1>
      <p className="mb-4">Click to create the `fix/pwa-cache-snag` branch in your GitHub repository.</p>
      
      <Button 
        onClick={handleCreateBranch} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? "Creating..." : "Create fix/pwa-cache-snag Branch"}
      </Button>
      
      {status && (
        <div className="p-4 border rounded-md bg-muted">
          <pre className="text-sm">{status}</pre>
        </div>
      )}
    </main>
  );
}