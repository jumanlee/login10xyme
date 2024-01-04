import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';

//css library component from https://tailwindui.com/components/application-ui/forms/sign-in-forms

interface LoginData {
    email: string;
    password: string;
}

const AuthForm: React.FC = () => {

    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: '',
    });

    //dummy function to simulate API login
    //function returns a Promise that, when resolved, will provide an object with two properties: access and refresh, both of type string.
    const simulateLoginAPI = (data: LoginData): Promise<{access: string, refresh: string}> => {
        //this is the actual JavaScript code that creates a new Promise object.
        return new Promise((resolve, reject) => {
            //add setTimeout to simulate API, which usually has a delay
            setTimeout(() => {
                if (data.email === "test@example.com" && data.password === "password") {
                    resolve({access: 'dummy_access_token', refresh: 'dummy_refresh_token'});
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    };


    const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
        //e.target is the input element. name is attribute of html.
        const {name, value} = e.target;
        setLoginData({...loginData, [name]: value});
    };

    //unlike ChangeEvent, often don't need to specify a type parameter with FormEvent when it's used with form submission because form submissions are generally handled at the form level, not on individual elements within the form.
    const handleLoginSubmit = async (e: FormEvent) => {
        //prevent default refresh
        e.preventDefault();

        try{
            const response = await simulateLoginAPI(loginData);
            localStorage.setItem('access_token', response.access); 
            localStorage.setItem('refresh_token', response.refresh); 
            setIsLoggedIn(true);

        }catch(error) {
            console.error(error);
            alert("The email and or password are wrong! Please try again!")
        }
    };

    const logout = () => {
        //remove all the tokens from browser
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        setLoginData(
            {
            email: '',
            password: '',})
    };

    //useEffect to check if the user is already logged in or not. If already logged in, it the page will display "welcome to 10zyme" otherwise, it will show the form required to log in. Remember, I'm using dummy tokens here.
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken){
            setIsLoggedIn(true);
        }

    }, []);


    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
               <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"> Welcome to 10zyme!</h1> 
            </div>
            {
                isLoggedIn ? (
                    < div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="text-sm font-semibold leading-6 text-gray-900">You are logged in!</h2>
                        <button onClick={logout} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log Out</button>
                    </div>

                ) : (
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Email:
                                <div className="mt-2">
                                    <input type="email" name="email" onChange={handleLoginChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </label>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Password:
                                <div className="mt-2">
                                    <input type="password" name="password" onChange={handleLoginChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </label>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"> Log In</button>
                        </form>
                    </div>

                )}

        </div>
    );
};

export default AuthForm;