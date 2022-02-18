import {
  startEc2Instance,
  terminateEc2Instances,
  sendEc2Commands,
  getEc2Instances
} from '../lib'

import {
  TWFullScreen,
  TWCenteredContent,
  FrontEndContractCompileAndSync,
  ReactMarkdownTest,
  TWButtonWithSpinner,
  TWCircleSpinner,
  ConsoleLogger
} from '../components'

import { useEffect, useMemo, useRef, useState } from 'react';

const Ec2DashboardTest = () => {
  const [log, setLog] = useState(["Console"])
  const [instances, setInstances] = useState(null)
  const [eventSource, setEventSource] = useState(null)
  const instancesRef = useRef(instances || [])
  const [command, setCommand] = useState(null)
  const [stream, setStream] = useState(null)
  const [streamConnected, setStreamConnected] = useState(false)
  const onMessage = useRef(null)
  const [showDetails, setShowDetails] = useState(false)
  
  const instanceIds = () => instances.map(
    (instance) => instance.id
  )

  const startInstance = async (_event, reset) => {
    await startEc2Instance()
    waitFor(1, reset, 'running')
  }

  const terminateAll = async (_event, reset) => {
    await terminateEc2Instances(instanceIds())
    clearLog()
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

  const sendCommands = useMemo(() => async (commands, directory, _onMessage) => {
    if (!instancesRef.current?.length) return;

    logMessage(`Running "${commands.join(' && ')}" in "${directory || '.'}"`)

    onMessage.current = _onMessage

    await sendEc2Commands(
      instancesRef.current[0].publicDnsName, 
      commands, 
      directory
    )
  }, []);

  const clearLog = (_event, reset) => {
    setLog([])
    if (reset) {
      reset()
    }
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
    const streamURL = `https://${instanceIp}:8443/stream`

    if (eventSource && eventSource.url === streamURL) {
      return;
    }

    if (eventSource) {
      eventSource.close()
      setStream(null)
    }

    if (instanceIp && instanceIp !== "?") {
      setStream(streamURL)
      const es = new EventSource(streamURL);
      es.addEventListener('log', (ev) => {
        if (onMessage.current) {
          onMessage.current(ev.data, logMessage, sendCommands)
        } else {
          logMessage(ev.data)
        }
      })
      es.onerror = (ev) => {
        logMessage(ev.data)
      }
      es.onopen = (ev) => {
        setStreamConnected(true)
      }
      setEventSource(es)
    }
  }, [instances, eventSource, sendCommands])

  useEffect(() => {
    checkInstances();
  }, [])

  return (
    <TWFullScreen>
      <TWCenteredContent>
        <div className='p-12 w-screen flex'>
          <div className='w-7/12'>
            <FrontEndContractCompileAndSync 
              sendCommands={sendCommands}
            />
          </div>
          <div className='w-5/12'>
            <div className='pt-12'>
              <span
                className="mr-6 py-1 px-3 border rounded text-slate-300 border-slate-600 cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </span>
              
              {stream &&
                <a 
                  href={stream}
                  className={`pt-6 ${streamConnected ? 'text-green-600' : 'text-red-600'} underline`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Stream
                </a>
              }
            </div>
            {showDetails && 
              <div className='text-sm'>
                {instances && 
                  <div className='p-3'>
                    <div className='pt-3'>
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
                      <TWButtonWithSpinner
                        onClick={clearLog}
                      >
                        Clear
                      </TWButtonWithSpinner>
                    </div>
                    <div className='pt-3'>
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
                <div className='text-xs'>
                  <ReactMarkdownTest>
                    ```js
                    ${Object.entries(instances[0]).map(
                      ([key, value]) => `${key}: ${value}`
                    ).join('\n')}
                    ```
                  </ReactMarkdownTest>
                </div>                    
              </div>
            }
          </div>
        </div>
      </TWCenteredContent>
    </TWFullScreen>
  )
}

export default Ec2DashboardTest;