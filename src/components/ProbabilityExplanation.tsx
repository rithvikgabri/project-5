import React from 'react';

export default function ProbabilityExplanation() {
  return (
    <div className="retro-card p-6">
      <h2 className="text-2xl font-bold mb-6 tracking-tight flex items-center gap-2">
        <span className="text-3xl">📚</span> How It Works
      </h2>
      
      <div className="space-y-6">
        <div className="retro-card p-4">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span> Multinomial Distribution
          </h3>
          <p className="text-sm">
            Models the probability of demand across multiple food categories simultaneously. 
            Considers how demand for one category affects others, creating a more realistic 
            distribution model.
          </p>
        </div>

        <div className="retro-card p-4">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span> Beta Distribution
          </h3>
          <p className="text-sm">
            Used to model pickup success rates based on historical data. Updates our confidence 
            in pickup probabilities as we gather more success/failure data.
          </p>
        </div>

        <div className="retro-card p-4">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span> Conditional Probability
          </h3>
          <p className="text-sm">
            Calculates shelf life probabilities by considering multiple factors: 
            category-specific storage requirements, days until expiry, and optimal conditions.
          </p>
        </div>

        <div className="retro-card p-4">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span> Expected Value
          </h3>
          <p className="text-sm">
            Combines all probabilities to optimize distribution and minimize waste. 
            Balances demand likelihood, pickup success, and shelf life constraints.
          </p>
        </div>
      </div>
    </div>
  );
}