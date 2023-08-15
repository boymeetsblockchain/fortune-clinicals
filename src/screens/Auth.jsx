
import { Greeting } from '../components/Greeting'
import { useState,useCallback  } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeImage from '../assets/home.jpg'
import {toast} from 'react-hot-toast'
import Input from '../components/Input'
import {getAuth,createUserWithEmailAndPassword,updateProfile, signInWithEmailAndPassword} from 'firebase/auth'
import {setDoc,serverTimestamp,doc} from 'firebase/firestore'
import {db} from '../firebase.config'
// import Oauth from '../components/Oauth'
export default function Home() {
  const navigate = useNavigate('/')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const[variant,setVariant]= useState('login')
 
 const getGreeting= Greeting
const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []);

  const registerUser =async(e)=>{
    e.preventDefault()
     try {
      const auth = getAuth()
    const userCredentials= await createUserWithEmailAndPassword(auth,email,password)
    const user = userCredentials.user
     updateProfile(auth.currentUser,{
      displayName:username
     })

     const formdata={username,email}
     formdata.timestamp=serverTimestamp()

     await setDoc(doc(db,'users',user.uid),formdata)
     toast.success(" Succesfully registered")
     navigate('/dashboard')
     } catch (error) {
       console.log(error)
       toast.error(error)
     }
  }

  const loginuser = async(e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()
       
      const userCredentials = await signInWithEmailAndPassword(auth,email,password)

      if(userCredentials.user){
        toast.success("Succesfully Loggedin")
      }
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
       toast.error(error)
    }
  }
  return (
    <div className="mx-auto max-w-screen-xl h-full w-full px-4 md:px-8 lg:px-12">
    
    <div className="h-screen flex  flex-col items-center justify-center">
      <div>
      <h1 className='text-center font-bold text-6xl my-6'>Fortune Physiotherapy Clinic App</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="input-container">
          <form className='w-[480px] flex flex-col space-y-4' onSubmit={variant==="login"?loginuser:registerUser}>
         
            <h1 className='text-black font-bold text-center text-3xl ' >{getGreeting()},  {variant==="login"?" Please Login":" Sign Up"}</h1>
            {
                            variant ==="register" &&(
                                <Input 
                                label="Username"  id='username' 
                                onChange={(e)=>{setUsername(e.target.value)}}
                                 type='text' 
                                 value={username}/>
                            )
                         }

            <Input
              label="Email"
              id='email'
              onChange={(e) => { setEmail(e.target.value) }}
              type='email'
              value={email} />
            <Input
              label="Password..."
              id='password'
              onChange={(e) => { setPassword(e.target.value) }}
              type='password'
              value={password} />
            <div className='flex justify-end'>
              <button 
                className='bg-[#FF5162] py-3 text-white rounded-md w-1/4 mt-4 hover:bg-red-700 transition'>
                {variant ==="login"?"Login":"Register"}
              </button>

            </div>
            
            <p className="text-black mt-12">
              {variant === 'login' ? 'First time here?' : 'Already have an account?'}
              <span onClick={toggleVariant} className="text-[#FF5162] ml-1 hover:underline cursor-pointer">
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span> 
            </p>
           {/* <Oauth/> */}
          </form>
        </div>
        <div className="hero-image hidden md:flex">
          <img src={HomeImage} alt='home' width={640} height={852} />
        </div>
      </div>
    </div>
    </div>
  )
}
