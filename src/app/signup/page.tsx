import Signupform from "../components/signup-form"

export default function SignupPage() {
    return (
    <div className="flex justify-center items-center min-h-screen w-full">
   
             <div className="w-80 border-solid border-white border-2 rounded-xl p-7 space-y-4">
               <h1 className="flex justify-center font-bold"> Sign up</h1>
               <Signupform />
             </div>
           </div>



    )
}