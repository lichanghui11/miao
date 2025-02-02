import { useAtom } from 'jotai'
import CountLeft from './CountLeft'
import Status from './Status'



export default function TodoFooter() {


  return (
    <div>
      <CountLeft />
      <hr />
      <Status />
    </div>
  )
}