// src/utils/roadmapGenerator.js

/**
 * Converts the AI's summary and user answers into a visual format
 * that the React Flow library can understand (nodes and edges).
 * @param {object} answers - The final answers from the quiz.
 * @param {string} summary - The summary text from the AI.
 * @returns {{nodes: object[], edges: object[]}}
 */
export const generateAdviceVisual = (answers, summary) => {
  const initialNodes = [];
  const initialEdges = [];
  const nodeWidth = 300;
  const nodeSpacingX = 350;
  const nodeSpacingY = 150;

  // 1. Create the main summary node at the top
  initialNodes.push({
    id: 'summary-node',
    data: { label: `AI Career Summary: "${summary}"` },
    position: { x: 250, y: 5 },
    style: {
      background: '#007bff',
      color: 'white',
      border: '2px solid #0056b3',
      borderRadius: '12px',
      padding: '20px',
      width: nodeWidth + 100,
      textAlign: 'center',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      boxShadow: '0 8px 25px rgba(0, 123, 255, 0.3)',
    },
  });

  // 2. Create nodes for each of the user's key answers
  Object.entries(answers).forEach(([key, value], index) => {
    const nodeId = `answer-node-${index}`;
    initialNodes.push({
      id: nodeId,
      data: { label: `${key}: ${value}` },
      // Arrange nodes in a branching pattern
      position: { x: (index - (Object.keys(answers).length -1) / 2) * nodeSpacingX, y: nodeSpacingY * 2 },
       style: {
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '15px',
        width: nodeWidth,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
      },
    });

    // 3. Create an edge connecting each answer to the main summary
    initialEdges.push({
      id: `edge-summary-to-${index}`,
      source: 'summary-node',
      target: nodeId,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#007bff', strokeWidth: 2 },
    });
  });

  return { nodes: initialNodes, edges: initialEdges };
};