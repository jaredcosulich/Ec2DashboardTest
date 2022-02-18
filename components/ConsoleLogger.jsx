import { useEffect } from 'react';

const ConsoleLogger = ({ text="" }) => {
  useEffect(() => {
    const outputElement = document.getElementById('output-bottom')
    if (outputElement?.scrollIntoView) {
      outputElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [text])

  return (
    <div className='w-full h-96 bg-black text-white p-3 overflow-y-scroll'>
      {text.split(/\n/).map(
        (textLine, index) => (
          <div 
            key={`text-${index}`}
            className='pb-1'
          >
            {textLine}
          </div>
        )
      )}
      <div id='output-bottom' className='py-3'></div>
    </div>
  )
}

export default ConsoleLogger;