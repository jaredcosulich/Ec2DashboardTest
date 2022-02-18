import {
  TWButton, TWCircleSpinner
} from '.'

import { useEffect, useMemo, useState } from 'react';

const Ec2CommandStage = ({ stage, sendCommands, data }) => {
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)
  const [subStageIndex, setSubStageIndex] = useState(0)
  const [subStageRunning, setSubStageRunning] = useState(false)
  const [subStageComplete, setSubStageComplete] = useState(false)

  const handleMessage = useMemo(() => (message, logger) => {
    console.log("HI", message)
    if (stage.messageHandler) {
      stage.messageHandler(
        message, 
        logger,
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
  }, [stage])

  const sendCommandsProxy = useMemo(() => (commands, directory) => {
    sendCommands(
      commands, 
      directory,
      handleMessage
    )
  }, [sendCommands, handleMessage])

  const run = useMemo(() => () => {
    setRunning(true)
    stage.start(sendCommandsProxy, data)
  }, [stage, sendCommandsProxy, data])

  useEffect(() => {
    if (stage.type === 'automatic') {
      run();
    }  
  }, [stage, run])

  const item = (info, running, complete) => {
    return (
      <div 
        className='border rounded p-3 mb-3 w-40'
      >
        <h3 className='text-lg mb-1'>
          {info.name}
        </h3>
        <div className='text-xs mb-3 h-9'>
          {info.blurb}
        </div>
        <div className='text-center'>
          {running && 
            <TWCircleSpinner />
          }
          {!running && complete && 
            <div className='inline-block rounded-full w-8 h-8 bg-green-600 text-white text-center text-2xl font-bold'>
              &#10003;
            </div>
          }
          {!running && !complete && stage.type === 'button' &&
            <TWButton
              onClick={run}
            >
              Start
            </TWButton>
          }
        </div>
      </div>
    )
  }

  return (
    <div className='flex'>
      {item(stage, running, complete)}
      {stage.subStages && stage.subStages.slice(0, subStageIndex).map((subStage, index) => {
        return (
          <div key={`substage-${index}`} className='ml-3'>
            {item(subStage, true, subStageComplete)}
          </div>
        )
      })}
    </div>
  )
}

export default Ec2CommandStage;