import {
  TWFullScreen,
  TWCenteredContent,
  FrontEndContractCompileAndSync,
  TWCircleSpinner,
  Ec2CommandCenter
} from '../components'

import { useState } from 'react';

const Ec2DashboardTest = () => {
  const [showDetails, setShowDetails] = useState(false)
  const [streamConnected, setStreamConnected] = useState(false)

  return (
    <TWFullScreen>
      <TWCenteredContent>
        <div className='p-12 w-screen flex'>
          <div className='w-7/12'>
            {streamConnected ? 
              <FrontEndContractCompileAndSync 
                sendCommands={sendCommands}
              /> :
              <TWCircleSpinner 
                message={`Connecting to EC2...`} 
              />
            }
            </div>
          <div className='w-5/12'>
            <div className='pt-12'>
              <span
                className="mr-6 py-1 px-3 border rounded text-slate-600 border-slate-600 cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </span>
              
              {streamConnected &&
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
              <Ec2CommandCenter 
                streamConnected={setStreamConnected}
              />
            }
          </div>
        </div>
      </TWCenteredContent>
    </TWFullScreen>
  )
}

export default Ec2DashboardTest;