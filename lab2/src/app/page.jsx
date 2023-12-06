"use client"

import { useRouter } from "next/navigation"


export default function Home() {
 const router = useRouter()
  return (
    <>
      <div className="goto-text">Go to:</div>
      <ul>
        <li onClick={()=>router.push('sinus')}>Garmonic signal</li>
        <li onClick={()=>router.push('rectangle')}>Recatangular signal</li>
        <li onClick={()=>router.push('triangle')}>Triangular signal</li>
        <li onClick={()=>router.push('saw')}>Sawtooth signal</li>
        <li onClick={()=>router.push('whitenoise')}>White noise</li>
        <li onClick={()=>router.push('Polyharmonic')}>Polyharmonic</li>
      </ul>
    </>
  )
}
