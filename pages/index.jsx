import {
  startEc2Instance,
  terminateEc2Instances,
  sendEc2Commands,
  getEc2Instances
} from '../lib'

import {
  TWFullScreen,
  TWCenteredContent,
  ReactMarkdownTest,
  TWButtonWithSpinner,
  TWCircleSpinner,
  ConsoleLogger
} from '../components'

import { useEffect, useRef, useState } from 'react';

const Ec2DashboardTest = () => {
  const [log, setLog] = useState(["Console"])
  const [instances, setInstances] = useState(null)
  const [eventSource, setEventSource] = useState(null)
  const instancesRef = useRef(instances || [])
  const [command, setCommand] = useState(null)
  
  const instanceIds = () => instances.map(
    (instance) => instance.id
  )

  const startInstance = async (_event, reset) => {
    await startEc2Instance()
    waitFor(1, reset, 'running')
  }

  const terminateAll = async (_event, reset) => {
    await terminateEc2Instances(instanceIds())
    waitFor(0, reset)
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

  const logMessage = (message) => {
    if (!message?.length || message.length === 0) {
      return;
    }
    setLog((prev) => [...prev, message])
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

  const runCommand = (_event, reset) => {
    if (command?.length && command.length > 0) {
      sendCommands([command])
    }
    reset();
  }

  const sendCommands = async (commands, directory) => {
    logMessage(`Running "${commands.join(' && ')}" in "${directory || '.'}"`)
    await sendEc2Commands(
      instances[0].publicDnsName, 
      commands, 
      directory
    )
  }

  const clearLog = (_event, reset) => {
    setLog([])
    reset()
  }

  const checkInstances = async (_event, reset) => {
    const _instances = await getEc2Instances()
    setInstances(_instances);
    instancesRef.current = _instances;
    if (reset) {
      reset()
    }
  }

  useEffect(() => {
    const instanceIp = instances?.[0]?.publicIpAddress
    const streamURL = `http://${instanceIp}:3005/stream`

    if (eventSource && eventSource.url === streamURL) {
      return;
    }

    if (eventSource) {
      eventSource.close()
    }

    if (instanceIp && instanceIp !== "?") {
      const es = new EventSource(streamURL);
      es.addEventListener('log', (ev) => {
        logMessage(ev.data)
      })
      es.onerror = (ev) => {
        logMessage(ev.data)
      }
      setEventSource(es)
    }
  }, [instances])

  useEffect(() => {
    checkInstances();
  }, [])


  return (
    <TWFullScreen>
      <TWCenteredContent>
        <div className='pb-12'>
          <h2 className='text-lg font-bold mb-3'>
            Repositories
          </h2>
          <div className='mb-3'>
            <input 
              type='text'
              placeholder="Front End"
              className='w-1/2 border rounded p-1 mr-6'
              onChange={(event) => {
                
              }}
            />
          </div>
          <div className='mb-3'>
            <input 
              type='text'
              placeholder="Contract"
              className='w-1/2 border rounded p-1 mr-6'
              onChange={(event) => {
                
              }}
            />
          </div>
        </div>
        <div className='flex'>
          {instances && 
            <div className='p-6 w-7/12'>
              <h2 className='text-lg font-bold'>Instance</h2>
              <div className='text-sm'>
                <ReactMarkdownTest>
                  ```js
                  ${JSON.stringify(instances, null, 2)}
                  ```
                </ReactMarkdownTest>
              </div>
              <div className='pt-12'>
                <TWButtonWithSpinner
                  classMap={{mr: 'mr-6'}}
                  onClick={startInstance}
                >
                  Start
                </TWButtonWithSpinner>
                <TWButtonWithSpinner
                  classMap={{mr: 'mr-6'}}
                  onClick={checkInstances}
                >
                  Check
                </TWButtonWithSpinner>
                <TWButtonWithSpinner
                  classMap={{mr: 'mr-6'}}
                  onClick={loadInstance}
                >
                  Load
                </TWButtonWithSpinner>
                <TWButtonWithSpinner
                  classMap={{mr: 'mr-6'}}
                  onClick={terminateAll}
                >
                  Terminate
                </TWButtonWithSpinner>
                <TWButtonWithSpinner
                  onClick={clearLog}
                >
                  Clear
                </TWButtonWithSpinner>
              </div>
              <div className='pt-6'>
                <input 
                  type='text'
                  placeholder="Command"
                  className='w-1/2 border rounded p-1 mr-6'
                  onChange={(event) => {
                    setCommand(event.target.value)
                  }}
                />
                <TWButtonWithSpinner
                  onClick={runCommand}
                >
                  Run
                </TWButtonWithSpinner>
              </div>
            </div>
          }
          {!instances &&
            <div className='p-24'>
              <TWCircleSpinner message="Loading EC2" />
            </div>
          }
          <ConsoleLogger text={log.join('\n')} />
        </div>
      </TWCenteredContent>
    </TWFullScreen>
  )
}

export default Ec2DashboardTest;