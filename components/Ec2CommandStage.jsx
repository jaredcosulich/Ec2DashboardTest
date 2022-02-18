import {
  TWButton, TWCircleSpinner
} from '.'

import { useEffect, useState } from 'react';

const Ec2CommandStage = ({ stage, sendCommands }) => {
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)

  const run = () => {
    setRunning(true)
  }

  useEffect(() => {
    if (stage.type === 'automatic') {
      run();

      const handleMessage = (message, logger) => {
        console.log("HI", message)
        if (stage.messageHandler) {
          stage.messageHandler(
            message, 
            logger, 
            sendCommands,
            () => {
              setRunning(false)
              setComplete(true)
            }
          )
        } else {
          logger(message)
          setRunning(false)
          setComplete(true)
        }        
      }

      for (const commandsInstructions of stage.commands || []) {
        const { commands, directory } = commandsInstructions;
        sendCommands(
          commands, 
          directory,
          handleMessage
        )
      }
    }  
  }, [stage, sendCommands])

  return (
    <div 
      className='border rounded p-3 mb-3 w-48'
    >
      <h3 className='text-lg mb-1'>
        {stage.name}
      </h3>
      <div className='text-sm mb-3'>
        {stage.blurb}
      </div>
      <div className='text-center'>
        {running && 
          <TWCircleSpinner />
        }
        {complete && 
          <div className='inline-block rounded-full w-8 h-8 bg-green-600 text-white text-center text-2xl font-bold'>
            &#10003;
          </div>
        }
        {!complete && stage.type === 'button' &&
          <TWButton
          >
            Start
          </TWButton>
        }
      </div>
    </div>
  )
}

export default Ec2CommandStage;