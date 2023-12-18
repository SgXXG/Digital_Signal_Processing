/* eslint-disable react/react-in-jsx-scope */
'use client'

import { useRouter } from 'next/navigation'
import Header from './Header/page'
import Sinus from './sinus/page'

export default function Home () {
  const router = useRouter()
  return (
    <>
      <Sinus/>
    </>
  )
}
