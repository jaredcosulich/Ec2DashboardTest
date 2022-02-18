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
    messageHandler: (message, logger, complete) => {
      logger(message)
      complete()
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
    messageHandler: (message, logger, complete) => {
      logger(message)
      if (
        message.startsWith("Resolving deltas: 100%") ||
        message.indexOf("is not an empty directory") > -1
      ) {
        complete()
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
      messageHandler: (message, logger, complete) => {
        logger(message)
        if (
          message.startsWith("Resolving deltas: 100%") ||
          message.indexOf("is not an empty directory") > -1
        ) {
          complete()
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
      messageHandler: (message, logger, complete) => {
        if (message.indexOf('info') > -1) {
          logger(message)
        }
        if (message.indexOf('npm info complete') > -1 || message.indexOf('npm info ok') > -1) {
          complete()
        }
      }
    }, {
      name: 'Compile',
      blurb: 'Run hardhat compile',
      start: (sendCommands, data, onError) => {
        const repoParts = data.contractRepo.split('/');
        const repoName = repoParts[repoParts.length - 1].replace('.git', '');
        sendCommands(
          [
            'npx hardhat compile --verbose',
            'cp ../ec2utils/artifacts.js ./scripts/',
            'node scripts/artifacts.js',
            'cat compiled.json >> log.txt'
          ],
          repoName
        )
      },
      messageHandler: (message, logger, complete) => {
        if (message.indexOf('info') > -1) {
          logger(message)
        }
        if (message.indexOf('npm info complete') > -1 || message.indexOf('npm info ok') > -1) {
          complete()
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
    messageHandler: (message, logger, complete) => {
      complete()
    }
  }
]

export default FrontEndContractCompileAndSync;