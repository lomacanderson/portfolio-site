import Countdown, { CountdownRenderProps } from 'react-countdown';
import { useState } from 'react';
import SWInterns from '../assets/2025-sw-interns.jpg';
import LoganPresentation from '../assets/logan_intern_presentation_2025.jpg';
import KimleySign from '../assets/kimley_horn_sign.jpg';
import QualityDay from '../assets/software_team_quality_day_2025.png';
import KHPFP from '../assets/KH_Profile_Pic.png';
import { FaChevronLeft, FaChevronRight, FaLinkedin } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { HashLink as Link } from 'react-router-hash-link';

const Completionist = () => <span>I'm back!</span>;

// Helper to calculate months and days between two dates
function getMonthsAndDays(start: Date, end: Date) {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate() - 1;

    if (days < 0) {
        months -= 1;
        // Get days in previous month
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    return {
        months: years * 12 + months,
        days,
    };
}

const renderer = ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
        return <Completionist />;
    } else {
        const now = new Date();
        const target = new Date('2026-06-16T00:00:00');
        const { months, days } = getMonthsAndDays(now, target);

        return (
            <div className='flex justify-center gap-3 md:gap-6'>
                {[
                    { value: months, label: 'months' },
                    { value: days, label: 'days' },
                    { value: hours, label: 'hours' },
                    { value: minutes, label: 'minutes' },
                    { value: seconds, label: 'seconds' },
                ].map(({ value, label }) => (
                    <div key={label} className='flex bg-zinc-100 dark:bg-zinc-900 rounded md:rounded-lg flex-col items-center h-23 w-18 md:h-40 md:w-32 justify-center transition-colors duration-300'>
                        <span className='text-5xl md:text-8xl font-bold text-zinc-900 dark:text-white'>{value}</span>
                        <span className='text-sm md:text-base text-zinc-550 dark:text-zinc-400'>{label}</span>
                    </div>
                ))}
            </div>
        );
    }
};

export function InternshipCountdown() {
    return (
        <section className='sm:pt-10 flex flex-col text-zinc-900 dark:text-white'>
            <span className='text-3xl md:text-5xl text-center justify-center text-zinc-800 dark:text-zinc-200'>I will be returning to Kimley-Horn on</span>
            <span className='text-3xl md:text-5xl text-center font-bold justify-center text-zinc-900 dark:text-white'>June 16, 2026:</span>
            <div className='text-5xl py-5 font-bold text-center justify-center'>
                <Countdown
                    date={new Date('2026-06-16T00:00:00')}
                    renderer={renderer}
                />
            </div>
        </section>
    );
}

const images = [
    KimleySign,
    LoganPresentation,
    SWInterns,
    QualityDay
];

function Gallery() {
    const [current, setCurrent] = useState(0);

    const prevImage = () => setCurrent((current - 1 + images.length) % images.length);
    const nextImage = () => setCurrent((current + 1) % images.length);

    // Get indices for left, center, right images
    const leftIdx = (current - 1 + images.length) % images.length;
    const centerIdx = current;
    const rightIdx = (current + 1) % images.length;

    const displayImages = [leftIdx, centerIdx, rightIdx];

    return (
        <div className="flex flex-col items-center my-8 w-full">
            <div className="relative w-full flex items-center justify-center">
                            <div className="flex w-full justify-center items-center gap-6">
                    {displayImages.map((idx, i) => (
                        <img
                            key={idx}
                            src={images[idx]}
                            alt={`Internship ${idx + 1}`}
                            className={`rounded transition-all duration-500
                                ${i === 1
                                    ? 'w-[90vw] h-[60vw] sm:w-[32vw] sm:h-[24vw] object-cover shadow-xl scale-105 z-10'
                                    : 'hidden sm:flex w-[24vw] h-[18vw] object-cover opacity-70 scale-95'
                                }`}
                            style={{ maxWidth: '400px', maxHeight: '300px' }}
                        />
                    ))}
                </div>
                <button
                    onClick={prevImage}
                    className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white rounded-full shadow p-2 z-10 cursor-pointer transition-colors"
                    aria-label="Previous image"
                >
                    <FaChevronLeft />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white rounded-full shadow p-2 z-10 cursor-pointer transition-colors"
                    aria-label="Next image"
                >
                    <FaChevronRight />
                </button>
            </div>

        </div>
    );
}

export function Internship2025() {
    return (
        <section className='flex justify-center flex-col text-zinc-900 dark:text-white'>
            <div className='flex justify-center my-5'>
                <img src={KHPFP} className='self-center h-30 md:h-36 mx-5 rounded-full'/>
                <div className='content-center'>
                    <h1 className='text-4xl md:text-6xl font-bold justify-center md:py-2 text-zinc-900 dark:text-white'>
                        <Link to="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Logan Anderson</Link>
                    </h1>
                    <h2 className='text-2xl md:text-4xl justify-center text-zinc-600 dark:text-zinc-400'>Software Intern | Phoenix</h2>
                </div>
            </div>
            <h1 className='text-4xl md:text-6xl font-bold text-center justify-center py-5 text-zinc-900 dark:text-white'>Thank you for a great 2025 internship!</h1>
            <Gallery />
            <InternshipCountdown />
            <span className='text-3xl md:text-5xl text-center justify-center py-4 text-zinc-800 dark:text-zinc-200'>Until then, you can contact me here:</span>
            <div className='flex flex-col items-center py-5 sm:py-8 gap-2 sm:gap-5'>
                <a href='mailto:lmandersonmail@gmail.com' className='text-2xl md:text-4xl text-center justify-center text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-450 transition duration-300'> <IoMail className='inline-block mr-2'/> lmandersonmail@gmail.com</a>
                <a href='https://www.linkedin.com/in/logan-m-anderson/' className='text-2xl md:text-4xl text-center justify-center text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-450 transition duration-300'> <FaLinkedin className='inline-block mr-2'/> logan-m-anderson</a>
            </div>
        </section>
    );
}