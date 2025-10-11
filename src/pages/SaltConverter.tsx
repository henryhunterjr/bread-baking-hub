import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SaltFactors {
  [key: string]: number;
}

interface SaltNames {
  [key: string]: string;
}

const SaltConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [unit, setUnit] = useState<string>('tsp');
  const [fromSalt, setFromSalt] = useState<string>('table');
  const [toSalt, setToSalt] = useState<string>('fine-sea');
  const [result, setResult] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isWeightMode, setIsWeightMode] = useState<boolean>(false);

  // Volume conversion factors (relative to table salt)
  const saltFactors: SaltFactors = {
    'table': 1.0,
    'fine-sea': 0.8,
    'coarse-sea': 0.67,
    'kosher-dc': 0.67,
    'kosher-morton': 0.8
  };

  // Weight in grams per teaspoon
  const saltWeights: SaltFactors = {
    'table': 6,
    'fine-sea': 5,
    'coarse-sea': 4,
    'kosher-dc': 3,
    'kosher-morton': 4.8
  };

  const saltNames: SaltNames = {
    'table': 'Table Salt (Morton\'s)',
    'fine-sea': 'Fine Sea Salt',
    'coarse-sea': 'Coarse Sea Salt',
    'kosher-dc': 'Kosher Salt (Diamond Crystal)',
    'kosher-morton': 'Kosher Salt (Morton\'s)'
  };

  const fractions: { [key: number]: string } = {
    0.125: '⅛',
    0.25: '¼',
    0.33: '⅓',
    0.375: '⅜',
    0.5: '½',
    0.625: '⅝',
    0.67: '⅔',
    0.75: '¾',
    0.875: '⅞'
  };

  const formatResult = (value: number): string => {
    if (value < 1) {
      const roundedResult = Math.round(value * 8) / 8;
      return fractions[roundedResult] || roundedResult.toFixed(2);
    } else if (value < 2) {
      const wholePart = Math.floor(value);
      const fracPart = value - wholePart;
      const roundedFrac = Math.round(fracPart * 8) / 8;
      if (roundedFrac === 0) {
        return wholePart.toString();
      } else {
        return wholePart + (fractions[roundedFrac] ? ' ' + fractions[roundedFrac] : ' ' + roundedFrac.toFixed(2));
      }
    } else {
      return value.toFixed(1);
    }
  };

  const convertSalt = () => {
    const amountValue = parseFloat(amount);
    
    // Input validation
    if (!amount || amount.trim() === '') {
      alert('Please enter an amount');
      return;
    }
    
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid positive number');
      return;
    }
    
    if (amountValue > 1000) {
      alert('Amount seems unusually large. Please verify.');
      return;
    }
    
    if (fromSalt === toSalt) {
      alert('Please select different salt types to convert');
      return;
    }

    if (isWeightMode) {
      // Weight mode: convert grams to grams
      const resultValue = (amountValue / saltWeights[fromSalt]) * saltWeights[toSalt];
      
      setResult(
        `${amountValue}g of ${saltNames[fromSalt]} = ${resultValue.toFixed(1)}g of ${saltNames[toSalt]}`
      );
    } else {
      // Volume mode: convert teaspoons/tablespoons
      const multiplier = unit === 'tbsp' ? 3 : 1;
      const amountInTsp = amountValue * multiplier;
      
      // Convert to table salt equivalent first
      const tableEquivalent = amountInTsp * saltFactors[fromSalt];
      // Then convert to target salt
      const resultInTsp = tableEquivalent / saltFactors[toSalt];
      
      const resultText = formatResult(resultInTsp);
      const unitText = 'tsp';
      
      setResult(
        `${amountValue} ${unit === 'tsp' ? 'tsp' : 'Tbsp'} of ${saltNames[fromSalt]} = ${resultText} ${unitText} of ${saltNames[toSalt]}`
      );
    }
    setShowResult(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      convertSalt();
    }
  };

  return (
    <>
      <Helmet>
        <title>Salt Conversion Chart for Bakers | The Baker's Bench</title>
        <meta 
          name="description" 
          content="Professional salt conversion calculator for bakers. Convert between table salt, sea salt, and kosher salt with accurate measurements and fractions." 
        />
        <meta name="keywords" content="salt conversion, baking calculator, table salt, sea salt, kosher salt, baking measurements" />
        <link rel="canonical" href="https://the-bakers-bench.lovable.app/salt-converter" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Salt Conversion Chart for Bakers | The Baker's Bench" />
        <meta property="og:description" content="Professional salt conversion calculator for bakers. Convert between table salt, sea salt, and kosher salt with accurate measurements." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://the-bakers-bench.lovable.app/salt-converter" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Salt Conversion Chart for Bakers" />
        <meta name="twitter:description" content="Professional salt conversion calculator for bakers. Convert between different salt types with accurate measurements." />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header Section */}
          <header className="text-center mb-8 border-b-4 border-primary pb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
              Salt Conversion Chart for Bakers
            </h1>
            <p className="text-lg text-muted-foreground italic">
              From Baking Great Bread at Home Community
            </p>
          </header>

          {/* Conversion Table */}
          <section className="bg-card rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr style={{ backgroundColor: 'hsl(var(--accent-gold))', color: 'hsl(var(--text-dark))' }}>
                    <th className="p-3 text-center font-bold text-sm">Table Salt<br />(Morton's)</th>
                    <th className="p-3 text-center font-bold text-sm">Fine Sea Salt</th>
                    <th className="p-3 text-center font-bold text-sm">Coarse Sea Salt</th>
                    <th className="p-3 text-center font-bold text-sm">Kosher Salt<br />(Diamond Crystal)</th>
                    <th className="p-3 text-center font-bold text-sm">Kosher Salt<br />(Morton's)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="even:bg-muted/50">
                    <td className="p-3 text-center bg-yellow-100 font-bold" style={{ color: 'hsl(var(--text-dark))' }}>1 tsp</td>
                    <td className="p-3 text-center">1¼ tsp</td>
                    <td className="p-3 text-center">1½ tsp</td>
                    <td className="p-3 text-center">1½ tsp</td>
                    <td className="p-3 text-center">1¼ tsp</td>
                  </tr>
                  <tr className="even:bg-muted/50">
                    <td className="p-3 text-center bg-yellow-100 font-bold" style={{ color: 'hsl(var(--text-dark))' }}>½ tsp</td>
                    <td className="p-3 text-center">⅝ tsp</td>
                    <td className="p-3 text-center">¾ tsp</td>
                    <td className="p-3 text-center">¾ tsp</td>
                    <td className="p-3 text-center">⅝ tsp</td>
                  </tr>
                  <tr className="even:bg-muted/50">
                    <td className="p-3 text-center bg-yellow-100 font-bold" style={{ color: 'hsl(var(--text-dark))' }}>¼ tsp</td>
                    <td className="p-3 text-center">⅓ tsp</td>
                    <td className="p-3 text-center">⅜ tsp</td>
                    <td className="p-3 text-center">⅜ tsp</td>
                    <td className="p-3 text-center">⅓ tsp</td>
                  </tr>
                  <tr className="even:bg-muted/50">
                    <td className="p-3 text-center bg-yellow-100 font-bold" style={{ color: 'hsl(var(--text-dark))' }}>1 Tbsp</td>
                    <td className="p-3 text-center">1 Tbsp + ¾ tsp</td>
                    <td className="p-3 text-center">1½ Tbsp</td>
                    <td className="p-3 text-center">1½ Tbsp</td>
                    <td className="p-3 text-center">1 Tbsp + ¾ tsp</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="p-6 rounded-lg shadow-lg mb-8" style={{ backgroundColor: 'hsl(var(--bg-medium))' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'hsl(var(--accent-gold))' }}>Quick Salt Calculator</h3>
            
            {/* Mode Toggle */}
            <div className="flex items-center justify-center gap-4 mb-6 p-4 rounded-md" style={{ backgroundColor: 'hsl(var(--bg-light))' }}>
              <Label 
                htmlFor="mode-toggle" 
                className="text-base font-semibold"
                style={{ color: isWeightMode ? 'hsl(var(--text-muted))' : 'hsl(var(--accent-gold))' }}
              >
                Volume Mode (tsp/Tbsp)
              </Label>
              <Switch
                id="mode-toggle"
                checked={isWeightMode}
                onCheckedChange={setIsWeightMode}
              />
              <Label 
                htmlFor="mode-toggle" 
                className="text-base font-semibold"
                style={{ color: isWeightMode ? 'hsl(var(--accent-gold))' : 'hsl(var(--text-muted))' }}
              >
                Weight Mode (grams)
              </Label>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="font-semibold min-w-[80px]" style={{ color: 'hsl(var(--text-light))' }}>I have:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyPress={handleKeyPress}
                  step={isWeightMode ? "1" : "0.25"}
                  min="0"
                  placeholder="1"
                  className="w-20 px-3 py-2 border-2 rounded-md text-sm transition-all duration-200"
                  style={{ 
                    backgroundColor: 'hsl(var(--bg-light))', 
                    color: 'hsl(var(--text-dark))',
                    borderColor: 'hsl(var(--border-light))'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(var(--border-focus))'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border-light))'}
                />
                {!isWeightMode && (
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-3 py-2 border-2 rounded-md text-sm min-w-[120px] transition-all duration-200"
                    style={{ 
                      backgroundColor: 'hsl(var(--bg-light))', 
                      color: 'hsl(var(--text-dark))',
                      borderColor: 'hsl(var(--border-light))'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(var(--border-focus))'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border-light))'}
                  >
                    <option value="tsp">teaspoon(s)</option>
                    <option value="tbsp">tablespoon(s)</option>
                  </select>
                )}
                {isWeightMode && (
                  <span className="text-sm font-semibold" style={{ color: 'hsl(var(--text-light))' }}>grams</span>
                )}
                <span className="text-sm" style={{ color: 'hsl(var(--text-light))' }}>of</span>
                <select
                  value={fromSalt}
                  onChange={(e) => setFromSalt(e.target.value)}
                  className="flex-1 min-w-[200px] px-3 py-2 border-2 rounded-md text-sm transition-all duration-200"
                  style={{ 
                    backgroundColor: 'hsl(var(--bg-light))', 
                    color: 'hsl(var(--text-dark))',
                    borderColor: 'hsl(var(--border-light))'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(var(--border-focus))'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border-light))'}
                >
                  <option value="table">Table Salt (Morton's)</option>
                  <option value="fine-sea">Fine Sea Salt</option>
                  <option value="coarse-sea">Coarse Sea Salt</option>
                  <option value="kosher-dc">Kosher (Diamond Crystal)</option>
                  <option value="kosher-morton">Kosher (Morton's)</option>
                </select>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <label className="font-semibold min-w-[80px]" style={{ color: 'hsl(var(--text-light))' }}>Convert to:</label>
                <select
                  value={toSalt}
                  onChange={(e) => setToSalt(e.target.value)}
                  className="flex-1 min-w-[200px] px-3 py-2 border-2 rounded-md text-sm transition-all duration-200"
                  style={{ 
                    backgroundColor: 'hsl(var(--bg-light))', 
                    color: 'hsl(var(--text-dark))',
                    borderColor: 'hsl(var(--border-light))'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(var(--border-focus))'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border-light))'}
                >
                  <option value="table">Table Salt (Morton's)</option>
                  <option value="fine-sea">Fine Sea Salt</option>
                  <option value="coarse-sea">Coarse Sea Salt</option>
                  <option value="kosher-dc">Kosher (Diamond Crystal)</option>
                  <option value="kosher-morton">Kosher (Morton's)</option>
                </select>
                <button
                  onClick={convertSalt}
                  className="px-6 py-2 rounded-md font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                  style={{ 
                    backgroundColor: 'hsl(var(--accent-gold))', 
                    color: 'hsl(var(--text-dark))'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--accent-gold) / 0.9)';
                    e.currentTarget.style.boxShadow = '0 0 15px hsl(var(--accent-gold) / 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--accent-gold))';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Convert
                </button>
              </div>
            </div>
            
            {showResult && (
              <div className="mt-6 p-4 rounded-md border-2" style={{ backgroundColor: 'hsl(var(--bg-light))', borderColor: 'hsl(var(--accent-gold))' }}>
                <div className="font-bold" style={{ color: 'hsl(var(--text-dark))' }}>{result}</div>
              </div>
            )}
          </section>

          {/* Pro Tips Section */}
          <section className="border-l-4 p-6 rounded-lg mb-8" style={{ backgroundColor: 'hsl(var(--bg-medium))', borderLeftColor: 'hsl(var(--accent-gold))' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'hsl(var(--accent-gold))' }}>Pro Tips for Salt Conversion</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🧂</span>
                <div style={{ color: 'hsl(var(--text-light))' }}>
                  <strong style={{ color: 'hsl(var(--text-light))' }}>Weight is best:</strong> Use 6g per teaspoon of table salt as your baseline if you have a scale
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🧂</span>
                <div style={{ color: 'hsl(var(--text-light))' }}>
                  <strong style={{ color: 'hsl(var(--text-light))' }}>Taste and adjust:</strong> Sea salts vary in mineral content and flavor intensity
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🧂</span>
                <div style={{ color: 'hsl(var(--text-light))' }}>
                  <strong style={{ color: 'hsl(var(--text-light))' }}>Start conservative:</strong> You can always add more salt, but you can't take it back
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🧂</span>
                <div style={{ color: 'hsl(var(--text-light))' }}>
                  <strong style={{ color: 'hsl(var(--text-light))' }}>Dissolve test:</strong> Fine salts incorporate faster than coarse salts in dough
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🧂</span>
                <div style={{ color: 'hsl(var(--text-light))' }}>
                  <strong style={{ color: 'hsl(var(--text-light))' }}>Storage tip:</strong> Keep sea salts in airtight containers to prevent clumping
                </div>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <section className="text-center p-6 rounded-lg" style={{ backgroundColor: 'hsl(var(--accent-gold))', color: 'hsl(var(--text-dark))' }}>
            <p className="font-bold mb-2">Happy Baking!</p>
            <p className="mb-2">Join us at Baking Great Bread at Home on Facebook</p>
            <p className="mb-4">BakingGreatBread.com</p>
            <p className="text-sm opacity-90">
              © 2025 Henry Hunter - Baking Great Bread at Home - All Rights Reserved
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SaltConverter;