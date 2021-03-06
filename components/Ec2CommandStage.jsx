import {
  TWButton, TWCircleSpinner
} from '.'

import { useEffect, useMemo, useRef, useState } from 'react';

const Ec2CommandStage = ({ stage, sendCommands, data }) => {
  const [subStageIndex, setSubStageIndex] = useState(0)
  const subStageIndexRef = useRef(0)
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const dataRef = useRef(data)

  const handleComplete = useMemo(() => () => {
    const subStage = stage.subStages?.[subStageIndexRef.current]
    if (subStage) {
      run(subStage)
    }

    subStageIndexRef.current = subStageIndexRef.current + 1
    setSubStageIndex(subStageIndexRef.current)
  }, [stage, run]);

  const handleMessage = useMemo(() => (message, logger) => {
    let _stage = subStageIndexRef.current === 0 ?
      stage :
      stage.subStages?.[subStageIndexRef.current - 1]

    if (!_stage) {
      _stage = stage.subStages?.[subStageIndexRef.current - 2] || stage
    }

    if (_stage.messageHandler) {
      _stage.messageHandler(
        message, 
        logger,
        handleComplete
      )
    } else {
      logger(message)
      handleComplete()
    }        
  }, [stage, handleComplete])

  const sendCommandsProxy = useMemo(() => (commands, directory) => {
    sendCommands(
      commands, 
      directory,
      handleMessage
    )
  }, [sendCommands, handleMessage])

  const handleError = useMemo(() => (errorMessage) => {
    setErrorMessage(errorMessage)
    setRunning(false)
    setComplete(false)
  }, [])

  const run = useMemo(() => (_stage) => {
    setErrorMessage(null)
    setRunning(true)
    setComplete(false)

    if (_stage.start) {
      _stage.start(sendCommandsProxy, dataRef.current, handleError)
    } else if (_stage.subStages) {
      run(_stage.subStages[subStageIndex])
      subStageIndexRef.current = subStageIndexRef.current + 1
      setSubStageIndex(subStageIndexRef.current)
    }
  }, [sendCommandsProxy, handleError, subStageIndex])

  useEffect(() => {
    if (stage.type === 'automatic') {
      run(stage);
    }  
  }, [stage, run])

  useEffect(() => {
    dataRef.current = data;
  }, [data])

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
              onClick={() => run(info)}
            >
              Start
            </TWButton>
          }
        </div>
      </div>
    )
  }

  return (
    <div>
      {errorMessage && 
        <div className='text-red-600 py-3 text-center'>
          {errorMessage}
        </div>
      }
      <div className='flex'>
        {item(
          stage, 
          subStageIndex === 0 ? running : false, 
          subStageIndex === 0 ? complete : true
        )}
        {stage.subStages && stage.subStages.slice(0, subStageIndex).map((subStage, index) => {
          return (
            <div key={`substage-${index}`} className='ml-3'>
              {item(
                subStage,
                subStageIndex === index + 1 ? running : false, 
                subStageIndex === index + 1 ? complete : true
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Ec2CommandStage;