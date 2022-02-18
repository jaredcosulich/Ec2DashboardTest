import {
  TWButtonWithSpinner
} from '.'

import { useState } from 'react';

const FrontEndContractCompileAndSync = ({ sendCommands }) => {
  const [frontEndRepo, setFrontEndRepo] = useState()
  const [contractRepo, setContractRepo] = useState()

  const compileContract = (_event, reset) => {
    const contractRepoName = contractRepo.replace('https://github.com/', '')
    const directory = contractRepoName.split('/')[1]
    sendCommands(
      [`nodClone ${contractRepoName}`], 
      null, 
      (logger, message) => {
        if (!logger) return;
        logger(message)
        if (
          message.startsWith("Resolving deltas: 100%") ||
          message.indexOf("is not an empty directory") > -1
        ) {
          sendCommands(
            ['npm install --verbose', 'npx hardhat compile'], 
            directory,
            (logger2, message2) => {
              if (message2.indexOf('info') > -1) {
                logger2(message2)
              }
            }
          )
        }
      }
    )

    reset()
  }

  return (
    <div>
      <h2 className='text-lg font-bold mb-3'>
        Repositories
      </h2>
      <div className='mb-3'>
        <input 
          type='text'
          placeholder="Front End"
          className='w-1/2 border rounded p-1 mr-6'
          onChange={(event) => {
            setFrontEndRepo(event.target.value)
          }}
        />
      </div>
      <div className='mb-3'>
        <input 
          type='text'
          placeholder="Contract"
          className='w-1/2 border rounded p-1 mr-6'
          onChange={(event) => {
            setContractRepo(event.target.value)            
          }}
        />
      </div>
      <TWButtonWithSpinner
        onClick={compileContract}
      >
        Compile Contract
      </TWButtonWithSpinner>
    </div>
  )
}

export default FrontEndContractCompileAndSync;