import { StandardRecipe } from '@/types/recipe';

interface PrintableRecipeProps {
  recipe: StandardRecipe;
}

export const PrintableRecipe = ({ recipe }: PrintableRecipeProps) => {
  return (
    <div className="max-w-4xl mx-auto p-8 print:p-0 bg-white text-black">
      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
            .avoid-break { page-break-inside: avoid; }
            img { max-width: 100%; height: auto; }
          }
        `}
      </style>

      {/* Header with Image */}
      <header className="mb-8 text-center border-b-2 border-gray-300 pb-6">
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        
        {/* Recipe Image */}
        {recipe.imageUrl && (
          <div className="mb-4 avoid-break">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        )}
        
        {recipe.summary && (
          <p className="text-lg text-gray-600 mb-2">{recipe.summary}</p>
        )}
        <div className="flex justify-center items-center gap-4 text-sm text-gray-500 flex-wrap">
          <span>By {recipe.author.name}</span>
          <span>•</span>
          <span>Serves {recipe.servings}</span>
          {recipe.totalTime && (
            <>
              <span>•</span>
              <span>{recipe.totalTime} total</span>
            </>
          )}
        </div>
      </header>

      {/* Recipe Info */}
      <section className="mb-8 avoid-break">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {recipe.prepTime && (
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-600">Prep Time</h3>
              <p className="text-lg font-bold">{recipe.prepTime}</p>
            </div>
          )}
          {recipe.cookTime && (
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-600">Cook Time</h3>
              <p className="text-lg font-bold">{recipe.cookTime}</p>
            </div>
          )}
          <div className="text-center p-4 bg-gray-50 rounded">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-600">Yield</h3>
            <p className="text-lg font-bold">{recipe.yield}</p>
          </div>
        </div>

        {recipe.categories.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-600">Categories: </span>
            <span className="text-sm">{recipe.categories.join(', ')}</span>
          </div>
        )}
      </section>

      {/* Ingredients */}
      <section className="mb-8 avoid-break">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start">
              <span className="w-4 h-4 border border-gray-400 rounded-sm mr-3 mt-1 flex-shrink-0"></span>
              <span>
                {ingredient.amount && <strong>{ingredient.amount} </strong>}
                {ingredient.item}
                {ingredient.note && <em className="text-gray-600"> ({ingredient.note})</em>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Instructions</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, index) => (
            <li key={index} className="avoid-break">
              <div className="flex items-start">
                <span className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">
                  {step.step}
                </span>
                <p className="text-gray-800 leading-relaxed">{step.instruction}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Equipment */}
      {recipe.equipment && recipe.equipment.length > 0 && (
        <section className="mb-8 avoid-break">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Equipment</h2>
          <ul className="space-y-2">
            {recipe.equipment.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="w-4 h-4 border border-gray-400 rounded-sm mr-3 mt-1 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <section className="mb-8 avoid-break">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Tips & Notes</h2>
          <ul className="space-y-3">
            {recipe.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-600 mr-2 text-lg flex-shrink-0">💡</span>
                <span className="text-gray-800">{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Troubleshooting */}
      {recipe.troubleshooting && recipe.troubleshooting.length > 0 && (
        <section className="mb-8 avoid-break">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Troubleshooting</h2>
          <div className="space-y-4">
            {recipe.troubleshooting.map((item, index) => (
              <div key={index} className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
                <p className="font-semibold text-gray-800 mb-1">
                  <span className="text-yellow-600">⚠️</span> {item.issue}
                </p>
                <p className="text-gray-700 ml-6">{item.solution}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nutrition Info */}
      {recipe.nutrition && (
        <section className="mb-8 avoid-break">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Nutrition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipe.nutrition.calories && (
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm text-gray-600">Calories</h4>
                <p className="text-lg font-bold">{recipe.nutrition.calories}</p>
              </div>
            )}
            {recipe.nutrition.protein && (
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm text-gray-600">Protein</h4>
                <p className="text-lg font-bold">{recipe.nutrition.protein}</p>
              </div>
            )}
            {recipe.nutrition.carbs && (
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm text-gray-600">Carbs</h4>
                <p className="text-lg font-bold">{recipe.nutrition.carbs}</p>
              </div>
            )}
            {recipe.nutrition.fat && (
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm text-gray-600">Fat</h4>
                <p className="text-lg font-bold">{recipe.nutrition.fat}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>Recipe from Baking Great Bread</p>
        <p>Find more recipes at bakinggreatbread.com</p>
        <p className="mt-2">Printed on {new Date().toLocaleDateString()}</p>
      </footer>

      {/* Print instructions for users */}
      <div className="no-print mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Print Instructions</h3>
        <p className="text-blue-700 text-sm">
          This page will automatically open your browser's print dialog. 
          To save as PDF, choose "Save as PDF" in the destination options.
        </p>
      </div>
    </div>
  );
};