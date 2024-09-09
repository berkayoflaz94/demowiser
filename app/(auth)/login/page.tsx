'use client';
import React, { useState, FormEvent } from 'react';
import { apiLogin } from '@/utils/api';
import ComponentsAuthLoginForm from '@/components/auth/components-auth-login-form';
import IconMail from '@/components/icon/icon-mail';
import IconLockDots from '@/components/icon/icon-lock-dots';

export default function Page() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        let data = {
            email: email,
            password: password
        };

        apiLogin(data)
            .then((data) => {
                if (data && data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.name);
                    localStorage.setItem('userEmail', data.email);
                    window.location.href = '/';
                } else {
                    alert('Giriş bilgileri hatalı.');
                }
            });
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div
                className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image"
                     className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image"
                     className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image"
                     className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div
                    className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div
                        className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign
                                    in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and
                                    password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="Email" type="email" placeholder="Enter Email"
                                               value={email}
                                               onChange={(e) => setEmail(e.target.value)}
                                               className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMail fill={true} />
                                    </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" type="password" placeholder="Enter Password"
                                               value={password}
                                               onChange={(e) => setPassword(e.target.value)}
                                               className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconLockDots fill={true} />
                                    </span>
                                    </div>
                                </div>
                                <button type="submit"
                                        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}
