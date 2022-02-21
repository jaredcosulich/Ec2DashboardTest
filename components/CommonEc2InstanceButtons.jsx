import {
  startEc2Instance,
  terminateEc2Instances
} from '../lib'

import {
  TWButtonWithSpinner
} from '.'

const CommonEc2InstanceButtons = ({ instances, checkInstances, sendCommands, logMessage }) => {

  const instanceIds = () => instances.map(
    (instance) => instance.id
  )

  const startInstance = async (_event, reset) => {
    await startEc2Instance()
    waitFor(1, reset, 'running')
  }

  const loadInstance = async (_event, reset) => {
    if (!instances?.length) return;
    logMessage("Cloning Logger")
    await sendCommands([
      `nodClone NodLabsXYZ/FileToStream.git`
    ])
    logMessage("Install Logger dependencies")
    await sendCommands([
      'npm install' 
    ], 'FileToStream')
    logMessage("Starting Logger...")
    await sendCommands([
      'touch ../log.txt',
      'node app.js'
    ], 'FileToStream')
    await sendCommands([
      'pwd'
    ])
    reset()
  }

  const terminateAll = async (_event, reset) => {
    await terminateEc2Instances(instanceIds())
    clearLog()
    waitFor(0, reset)
  }

  const clearLog = (_event, reset) => {
    setLog([])
    if (reset) {
      reset()
    }
  }

  const waitFor = async (instanceCount, onComplete, status) => {
    await checkInstances()

    let instancesToCount = instancesRef.current
    if (status) {
      instancesToCount = instancesToCount.filter(
        (instance) => instance.status === status
      )
    }

    if (instancesToCount.length === instanceCount) {
      if (onComplete) {
        onComplete()
      }
      return;
    }

    setTimeout(() => waitFor(instanceCount, onComplete, status), 500)
  }

  return (
    <div>
      <TWButtonWithSpinner
        classMap={{mr: 'mr-3'}}
        onClick={startInstance}
      >
        Start
      </TWButtonWithSpinner>
      <TWButtonWithSpinner
        classMap={{mr: 'mr-3'}}
        onClick={checkInstances}
      >
        Check
      </TWButtonWithSpinner>
      <TWButtonWithSpinner
        classMap={{mr: 'mr-3'}}
        onClick={loadInstance}
      >
        Load
      </TWButtonWithSpinner>
      <TWButtonWithSpinner
        classMap={{mr: 'mr-3'}}
        onClick={terminateAll}
      >
        Terminate
      </TWButtonWithSpinner>
    </div>
  )

}

export default CommonEc2InstanceButtons;