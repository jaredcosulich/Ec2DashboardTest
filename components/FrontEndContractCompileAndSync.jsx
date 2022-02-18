import {
  Ec2CommandStage
} from '.'

import { useState } from 'react';

const FrontEndContractCompileAndSync = ({ sendCommands }) => {
  const [frontEndRepo, setFrontEndRepo] = useState()
  const [contractRepo, setContractRepo] = useState()

  const cloneContract = async (directory) => {
    new Promise((resolve, reject) => {
      sendCommands(
        [`nodClone ${contractRepoName}`], 
        null, 
        async (logger, message) => {
          if (!logger) return;
          logger(message)
          if (
            message.startsWith("Resolving deltas: 100%") ||
            message.indexOf("is not an empty directory") > -1
          ) {
            await installAndCompileContract(directory)
            resolve()
          }
        }
      )
    })
  }

  const installAndCompileContract = async (directory) => {
    new Promise((resolve, reject) => {
      sendCommands(
        ['npm install --verbose', 'npx hardhat compile'], 
        directory,
        async (logger, message) => {
          if (message.indexOf('info') > -1) {
            logger(message)
          }
          if (message.indexOf('npm info complete') > -1) {
            await retrieveContract(directory);
            resolve()
          }
        }
      )
    })
  }

  const retrieveContract = async (directory) => {
    new Promise((resolve, reject) => {
      sendCommands(
        [
          `cp ec2utils/artifacts.js ${directory}/scripts/`, 
          `node ${directory}/scripts/artifacts.js`,
          `cat ${directory}/compiled.json >> log.txt`,
        ],
        null,
        (logger, message) => {
          logger(message)

          resolve();
        }
      )
    })
  }

  const compileContract = async (_event, reset) => {
    const contractRepoName = contractRepo.replace('https://github.com/', '')
    const directory = contractRepoName.split('/')[1]
    await cloneContract(directory)
    reset()
  }

  // useEffect(() => {
  //   sendCommands(['nodeClone NodLabsXYZ/ec2utils'])
  // }, [sendCommands])

  return (
    <div>
      <h2 className='text-lg font-bold mb-3'>
        Repositories
      </h2>
      <div className='mb-3'>
        <input 
          type='text'
          placeholder="Front End"
          className='w-5/6 border rounded p-1 mr-6'
          onChange={(event) => {
            setFrontEndRepo(event.target.value)
          }}
        />
      </div>
      <div className='mb-3'>
        <input 
          type='text'
          placeholder="Contract"
          className='w-5/6 border rounded p-1 mr-6'
          onChange={(event) => {
            setContractRepo(event.target.value)            
          }}
        />
      </div>

      {stages.map((stage, index) => (
        <div key={`stage-${index}`}>
          <Ec2CommandStage stage={stage} sendCommands={sendCommands} />
        </div>
      ))}
    </div>
  )
}

const stages = [
  {
    name: 'Prep',
    blurb: 'Prepare the environment',
    details: 'Start an ec2 instance, ssh into it, and load the communication software that allows us to interact with the instance.',
    type: 'automatic',
    commands: [
      {
        commands: [
          'pwd'
        ]
      }
    ],
    messageHandler: (message, logger, sendCommands, complete) => {
      complete()
    }
  },
  {
    name: 'Prep',
    blurb: 'Prepare the environment',
    details: 'Start an ec2 instance, ssh into it, and load the communication software that allows us to interact with the instance.',
    type: 'button',
    commands: [
      {
        commands: [
          'pwd'
        ]
      }
    ],
    messageHandler: (message, logger, sendCommands, complete) => {
      complete()
    }
  },
  {
    name: 'Prep',
    blurb: 'Prepare the environment',
    details: 'Start an ec2 instance, ssh into it, and load the communication software that allows us to interact with the instance.',
    type: 'button',
    commands: [
      {
        commands: [
          'pwd'
        ]
      }
    ],
    messageHandler: (message, logger, sendCommands, complete) => {
      complete()
    }
  }
]

export default FrontEndContractCompileAndSync;