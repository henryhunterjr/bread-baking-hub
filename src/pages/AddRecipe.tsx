import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addPeachGaletteRecipe } from "@/utils/addPeachGaletteRecipe";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddRecipe = async () => {
    setLoading(true);
    try {
      await addPeachGaletteRecipe();
      toast({
        title: "Success!",
        description: "Rustic Peach Galette has been added to your recipe library.",
      });
      setTimeout(() => {
        navigate("/recipes");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Add Rustic Peach Galette</h1>
        <p className="text-muted-foreground mb-6">
          Click the button below to add the Rustic Peach Galette recipe to your recipe library.
          It will appear at the top of your Seasonal collection.
        </p>
        <Button 
          onClick={handleAddRecipe} 
          disabled={loading}
          size="lg"
          className="w-full"
        >
          {loading ? "Adding Recipe..." : "Add Recipe to Library"}
        </Button>
      </div>
    </div>
  );
};

export default AddRecipe;
