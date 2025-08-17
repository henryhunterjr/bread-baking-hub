import React from "react";

const App = () => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = React.useState(false);

  return (
    <div>
      <h1>App is working</h1>
      <button onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}>
        Toggle: {isAIAssistantOpen ? 'Open' : 'Closed'}
      </button>
    </div>
  );
};

export default App;