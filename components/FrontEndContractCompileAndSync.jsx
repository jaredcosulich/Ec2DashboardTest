import {
  Ec2CommandStage
} from '.'

import { useState } from 'react';

const FrontEndContractCompileAndSync = ({ sendCommands }) => {
  const [frontEndRepo, setFrontEndRepo] = useState()
  const [contractRepo, setContractRepo] = useState()

  return (
    <div>
      <h2 className='text-lg font-bold mb-3'>
        Repositories
      </h2>
      <div className='mb-3 text-sm'>
        Please provide a github repository link for a front-end project and for a contract (hardhat) project. 
        <br/>
        This tool will make it easy to compile, deploy, and sync the contract with the front-end project.
      </div>
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
          <Ec2CommandStage 
            stage={stage} 
            sendCommands={sendCommands} 
            data={{
              frontEndRepo,
              contractRepo
            }}
          />
        </div>
      ))}
    </div>
  )
}

const stages = [
  {
    name: 'Prepare',
    blurb: 'Prepare the environment',
    details: 'Start an ec2 instance, ssh into it, and load the communication software that allows us to interact with the instance.',
    type: 'button',
    start: (sendCommands, _data, _onError) => {
      sendCommands(['pwd'])
    },
    messageHandler: (message, logger, onComplete) => {
      logger(message)
      onComplete()
    }
  },
  {
    name: 'Compile',
    blurb: 'Compile contract from GitHub repository',
    details: '',
    type: 'button',
    start: (sendCommands, data, onError) => {
      sendCommands(
        ["nodClone NodLabsXYZ/ec2utils"]
      )
    },
    messageHandler: (message, logger, onComplete) => {
      logger(message)
      if (
        message.startsWith("Resolving deltas: 100%") ||
        message.indexOf("is not an empty directory") > -1
      ) {
        onComplete()
      }
    },
    subStages: [{
      name: 'Clone',
      blurb: 'Clone the contract repository',
      start: (sendCommands, data, onError) => {
        if (!data.contractRepo) {
          onError("Please provide a GitHub repository URL for the contract above.")
          return;
        }
        const repoName = data.contractRepo.replace('https://github.com/', '')
        sendCommands(
          [`nodClone ${repoName}`]
        )
      },
      messageHandler: (message, logger, onComplete) => {
        logger(message)
        if (
          message.startsWith("Resolving deltas: 100%") ||
          message.indexOf("Receiving objects: 100%") > -1 ||
          message.indexOf("is not an empty directory") > -1
        ) {
          onComplete()
        }
      }
    }, {
      name: 'Install',
      blurb: 'Install contract dependencies',
      start: (sendCommands, data, onError) => {
        const repoParts = data.contractRepo.split('/');
        const repoName = repoParts[repoParts.length - 1].replace('.git', '');
        sendCommands(
          ['npm install --verbose'],
          repoName
        )
      },
      messageHandler: (message, logger, onComplete) => {
        if (message.indexOf('info') > -1) {
          logger(message)
        }
        if (message.indexOf('npm info complete') > -1 || message.indexOf('npm info ok') > -1) {
          onComplete()
        }
      }
    }, {
      name: 'Compile',
      blurb: 'Run hardhat compile',
      start: (sendCommands, data, onError) => {
        const repoParts = data.contractRepo.split('/');
        const repoName = repoParts[repoParts.length - 1].replace('.git', '');
        sendCommands(["echo 'npm info complete'"])
        // sendCommands(
        //   [
        //     'npx hardhat compile --verbose',
        //     'cp ../ec2utils/artifacts.js ./scripts/',
        //     'node scripts/artifacts.js',
        //     'cat compiled.json >> log.txt'
        //   ],
        //   repoName
        // )
      },
      messageHandler: (message, logger, onComplete) => {
        if (message.indexOf('info') > -1) {
          logger(message)
        }
        if (message.indexOf('npm info complete') > -1 || message.indexOf('npm info ok') > -1) {
          onComplete()
        }
      }
    }]    
  },
  {
    name: 'Deploy',
    blurb: 'Deploy the contract to a blockchain',
    details: '',
    type: 'button',
    start: (sendCommands, data, onError) => {
      sendCommands(['pwd'])
    },
    messageHandler: (message, logger, onComplete) => {
      onComplete()
    },
    subStages: [{
      name: 'Wait',
      blurb: 'Wait for the contract to be fully deployed',
      start: (sendCommands, data, onError) => {
        sendCommands(['pwd'])
      },
      messageHandler: (message, logger, onComplete) => {
        onComplete()
      }
    },
    {
      name: 'Sync',
      blurb: 'Sync deployed contract with front-end project',
      start: (sendCommands, data, onError) => {
        sendCommands(['pwd'])
      },
      messageHandler: (message, logger, onComplete) => {
        onComplete()
      }
    }]
  }
]

export default FrontEndContractCompileAndSync;