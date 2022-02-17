import { useState } from 'react';

const FrontEndContractCompileAndSync = () => {
  const [frontEndRepo, setFrontEndRepo] = useState()
  const [contractRepo, setContractRepo] = useState()

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
    </div>
  )
}

export default FrontEndContractCompileAndSync;