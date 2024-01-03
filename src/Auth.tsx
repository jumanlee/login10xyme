import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
// import './css/styles.css';

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
    };

    //useEffect to check if the user is already logged in or not. If already logged in, it the page will display "welcome to 10zyme" otherwise, it will show the form required to log in. Remember, I'm using dummy tokens here.
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken){
            setIsLoggedIn(true);
        }

    }, []);


    return (
        <div className="authFormContainer">
            <div className="mainContainer">
               <h1 className="mainTitle"> Welcome to 10zyme!</h1> 
            </div>
            {
                isLoggedIn ? (
                    <>
                        <h2>You are logged in!</h2>
                        <button onClick={logout}>Log Out</button>
                    </>

                ) : (
                    <form onSubmit={handleLoginSubmit}>
                        <label>
                            Email:
                            <input type="email" name="email" onChange={handleLoginChange}/>
                        </label>
                        <label>
                            Password:
                            <input type="password" name="password" onChange={handleLoginChange}/>
                        </label>
                        <button type="submit"> Log In</button>
                    </form>

                )}

        </div>
    );
};

export default AuthForm;