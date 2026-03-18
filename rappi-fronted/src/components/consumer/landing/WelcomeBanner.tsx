import { Smile } from 'lucide-react';

interface WelcomeBannerProps {
    username: string;
}

export const WelcomeBanner = ({ username }: WelcomeBannerProps) => (
    <section className="bg-orange-500 h-72 flex flex-col justify-center items-center px-10 text-center">
        <div className="max-w-4xl flex flex-col items-center gap-2">
            <div className="bg-orange-400/30 p-3 rounded-full mb-2">
                <Smile size={40} className="text-white animate-bounce" />
            </div>
            <h2 className="text-white text-5xl font-black mb-1 capitalize tracking-tight">
                ¡Hola, {username}!
            </h2>
            <p className="text-white text-xl font-bold opacity-90 max-w-md">
                ¿Qué te provoca pedir hoy?
            </p>
        </div>
    </section>
);
