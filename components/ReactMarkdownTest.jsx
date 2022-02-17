import ReactMarkdown from 'react-markdown'

const ReactMarkdownTest = ({ children }) => {
  return (
    <ReactMarkdown>
      {children.join('\n')}
    </ReactMarkdown>
  )
}

export default ReactMarkdownTest;