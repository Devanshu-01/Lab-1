// Shows the AI-generated summary text and the issue tags for an apartment.
function AISummary({ summary, issues = [] }) {
  return (
    <div className="ai-summary">
      <div className="ai-summary-label">
        <span className="ai-badge">AI Summary</span>
      </div>
      <p className="ai-summary-text">{summary}</p>
      {issues.length > 0 && (
        <div className="ai-issues">
          {issues.map(issue => (
            <span key={issue} className="tag">{issue}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default AISummary
