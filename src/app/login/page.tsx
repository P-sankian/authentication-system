import Loginform from "../components/login_form"
// implement alarm component, 


export default function LoginPage() {
      return (
        <div className="flex justify-center items-center min-h-screen w-full">

          <div className="w-80 border-solid border-white border-2 rounded-xl p-7 space-y-4">
            <h1 className="flex justify-center font-bold"> Login</h1>
            <Loginform />
          </div>
        </div>
      );
    }