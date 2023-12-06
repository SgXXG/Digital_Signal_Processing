import {useRouter} from 'next/navigation';
import React, {useState} from 'react';

export default function Header() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLinkClick = (route) => {
        router.push(route);
        setMenuOpen(false);
    };

    return (
        <nav className="nav">
            <div className="nav__menu" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                {menuOpen && (
                    <ul className="nav__dropdown">
                        <li onClick={() => handleLinkClick('sinus')}>Sinusoidal</li>
                        <li onClick={() => handleLinkClick('rectangle')}>Rectangular</li>
                        <li onClick={() => handleLinkClick('triangle')}>Triangular</li>
                        <li onClick={() => handleLinkClick('saw')}>Sawtooth</li>
                        <li onClick={() => handleLinkClick('whitenoise')}>White Noise</li>
                        <li onClick={() => handleLinkClick('Polyharmonic')}>Polyharmonic</li>
                        <li onClick={() => handleLinkClick('AmplitudeModulation')}>Amplitude modulation</li>
                        <li onClick={() => handleLinkClick('Image')}>Image</li>
                    </ul>
                )}
            </div>
        </nav>
    );
}
