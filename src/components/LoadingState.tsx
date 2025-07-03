import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LoadingStateProps {
  loadingRecipes: boolean;
}

export const LoadingState = ({ loadingRecipes }: LoadingStateProps) => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-muted-foreground">
            {loadingRecipes ? 'Loading your recipes...' : 'Loading...'}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};