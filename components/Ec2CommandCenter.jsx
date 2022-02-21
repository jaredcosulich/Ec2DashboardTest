import {
  getEc2Instances,
  sendEc2Commands
} from '../lib'

import {
  CommonEc2InstanceButtons,
  TWButtonWithSpinner,
  ConsoleLogger,
  ReactMarkdownTest
} from '.'

import { useEffect, useMemo, useRef, useState } from 'react';

const Ec2CommandCenter = (streamConnected) => {
  const [instances, setInstances] = useState(null)
  const instancesRef = useRef(instances || [])
  const [log, setLog] = useState(["Console"])
  const [command, setCommand] = useState(null)

  const [eventSource, setEventSource] = useState(null)
  const onMessage = useRef(null)

  const logMessage = (message) => {
    if (!message?.length || message.length === 0) {
      return;
    }
    setLog((prev) => [...prev, message])
  }

  const clearLog = (_event, reset) => {
    setLog([])
    if (reset) {
      reset()
    }
  }

  const runCommand = (_event, reset) => {
    if (command?.length && command.length > 0) {
      sendCommands([command])
    }
    reset();
  }

  const checkInstances = async (_event, reset) => {
    const _instances = await getEc2Instances()
    setInstances(_instances);
    instancesRef.current = _instances;
    if (reset) {
      reset()
    }
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

  useEffect(() => {
    const instanceIp = instances?.[0]?.publicIpAddress
    const streamURL = `https://${instanceIp}:8443/stream`

    if (eventSource && eventSource.url === streamURL) {
      return;
    }

    if (eventSource) {
      eventSource.close()
      if (streamConnected) {
        streamConnected(false)
      }
    }

    if (instanceIp && instanceIp !== "?") {
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
        if (streamConnected) {
          streamConnected(true)
        }
      }
      setEventSource(es)
    }
  }, [instances, eventSource, sendCommands])

  useEffect(() => {
    checkInstances();
  }, [])

  return (
    <div className='text-sm'>
      {instances && 
        <div className='p-3'>
          <div className='pt-3'>
            <CommonEc2InstanceButtons
              instances={instances}
              checkInstances={checkInstances}
              sendCommands={sendCommands}
              
            />
          </div>
          <div className='pt-3'>
            <input 
              type='text'
              placeholder="Command"
              className='w-1/2 border rounded p-1 mr-3'
              onChange={(event) => {
                setCommand(event.target.value)
              }}
            />
            <TWButtonWithSpinner
              classMap={{ marginRight: 'mr-3' }}
              onClick={runCommand}
            >
              Run
            </TWButtonWithSpinner>
            <TWButtonWithSpinner
              onClick={clearLog}
            >
              Clear
            </TWButtonWithSpinner>
          </div>
        </div>
      }
      <ConsoleLogger text={log.join('\n')} />
      <div className='text-xs'>
        {(instances || []).length === 0 && 
          <div className='mt-6'>
            No Instances Running
          </div>
        }
        {(instances || []).length > 0 &&
          <ReactMarkdownTest>
            ```js
            ${Object.entries(instances[0]).map(
              ([key, value]) => `${key}: ${value}`
            ).join('\n')}
            ```
          </ReactMarkdownTest>
        }
      </div>                    
    </div>
  )
}

export default Ec2CommandCenter;