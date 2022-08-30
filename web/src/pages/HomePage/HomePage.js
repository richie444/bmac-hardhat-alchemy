import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'
import abi from 'src/utils/BMAC.abi.json'
import { ethers } from 'ethers'
import { toast } from '@redwoodjs/web/dist/toast'

import { useState, useEffect } from 'react'

const HomePage = () => {
  const { ethereum } = window
  // Contract Address & ABI
  const contractAddress = '0x7eB917b93030d0b8dfE1F366935Edc92E114A643'
  const contractABI = abi.abi

  // Component state
  const { currentUser } = useAuth()
  const [balance, setBalance] = useState(0)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [memos, setMemos] = useState([])

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const buyCoffee = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any')
        const signer = provider.getSigner()
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        try {
          const coffeeTxn = await buyMeACoffee.buyCoffee(
            name ? name : 'anon',
            message ? message : 'Enjoy your coffee!',
            { value: ethers.utils.parseEther('0.01') }
          )
          setName('')
          setMessage('')
          toast.promise(coffeeTxn.wait(), {
            loading: 'Buying Coffee..' + '\n' + `Txn Pending...`,
            success: 'Coffee purchased!' + '\n' + 'Thanks for buying!',
            error: 'Error ' + coffeeTxn.hash + ': ' + coffeeTxn.error,
          })
        } catch (error) {
          toast.error(parseInt(error.code) ? error.message : error.code)
        }
      }
    } catch (error) {
      toast.error(error)
    }
  }

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any')
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        )
        // Check if we are on rinkeby network.
        try {
          console.log('fetching memos from the blockchain..')
          const memos = await buyMeACoffee.getMemos()
          console.log('fetched!')
          setMemos(memos)
        } catch {
          toast.error('Please connect to the Rinkeby network.')
        }
      } else {
        toast.error('Metamask is not connected')
      }
    } catch (error) {
      toast.error(error)
    }
  }

  // Function to withdraw the balance of the contract.
  const withdraw = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any')
        const signer = provider.getSigner()
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        await buyMeACoffee.withdraw()
        await getBalance()
      } else {
        toast.error('Metamask is not connected')
      }
    } catch (error) {
      toast.error(error)
    }
  }

  // Function to fetch the balance of the contract.
  const getBalance = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any')

        const balance = await provider.getBalance(contractAddress)
        setBalance(ethers.utils.formatEther(balance))
      } else {
        toast.error('Metamask is not connected')
      }
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    let buyMeACoffee
    getMemos()
    getBalance()

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      toast.success('Memo received: ', from, timestamp, name, message)
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ])
    }

    const { ethereum } = window

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, 'any')
      const signer = provider.getSigner()
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer)

      buyMeACoffee.on('NewMemo', onNewMemo)
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off('NewMemo', onNewMemo)
      }
    }
  }, [])

  useEffect(() => {
    getBalance()
  }, [memos])

  return (
    <>
      <MetaTags title="Home" />
      <div className="mx-auto flex max-w-xl items-start space-x-4">
        {
          <div
            className={`min-w-2xl absolute z-10 flex h-[30vh] items-center justify-around bg-gray-400 px-28 opacity-90 ${
              currentUser && 'hidden'
            }`}
          >
            <h1 className="text-center text-2xl font-bold">
              <p className="text-gray-900">🔒 Locked</p>
              <p className="text-gray-900">Login with Metamask 🦊 to Access</p>
            </h1>
          </div>
        }
        <div className="flex w-full justify-between">
          <div className="my-auto">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="truncate text-sm font-medium text-gray-500">
                {'Contract Balance'}
              </div>
              <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {balance} ETH
              </div>
              <div className="mt-4 cursor-pointer underline" onClick={withdraw}>
                Withdraw Funds
              </div>
            </div>
          </div>
          <div>
            <form className="relative w-full">
              <div className="flex-shrink-0">
                <img
                  className="inline-block h-10 w-10 rounded-full"
                  src={`https://avatars.dicebear.com/api/pixel-art/${currentUser?.address?.toLowerCase()}.svg`}
                  alt="avatar"
                />
              </div>
              <div className="my-2 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder={'Name'}
                    onChange={onNameChange}
                  />
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                <label htmlFor="comment" className="sr-only">
                  Add your message
                </label>
                <textarea
                  rows={3}
                  name="message"
                  id="message"
                  className="block w-full resize-none border-0 p-3 focus:ring-0 sm:text-sm"
                  placeholder="Add your message..."
                  onChange={onMessageChange}
                />
              </div>
            </form>
            <div className="inset-x-0 bottom-0 flex justify-between py-2">
              <div className="flex-shrink-0">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  onClick={buyCoffee}
                >
                  Buy Coffee worth 0.01 ETH
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Received Memos */}
      <ul role="list" className="divide-y divide-gray-200">
        <h2 className="text-xl font-bold leading-5 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
          Memos
        </h2>
        {memos.map((memo, idx) => (
          <li key={idx} className="flex py-4">
            <img
              className="h-10 w-10 rounded-full"
              src={`https://avatars.dicebear.com/api/pixel-art/${memo?.from?.toLowerCase()}.svg`}
              alt=""
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{memo.name}</p>
              <p className="text-sm text-gray-500">{memo.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default HomePage
