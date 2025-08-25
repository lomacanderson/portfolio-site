import Countdown, { CountdownRenderProps } from 'react-countdown';
import { useState } from 'react';
import codingWorkstation from '../assets/coding-workstation.jpg';
import javaClassProject from '../assets/java-class-project.jpg';
import loganOlympiaCapitalBuilding from '../assets/logan-olympia-capital-building.jpg';

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
            <div className='flex justify-center gap-3'>
                {[
                    { value: months, label: 'months' },
                    { value: days, label: 'days' },
                    { value: hours, label: 'hours' },
                    { value: minutes, label: 'minutes' },
                    { value: seconds, label: 'seconds' },
                ].map(({ value, label }) => (
                    <div key={label} className='flex bg-gray-100 rounded flex-col items-center h-23 w-18 justify-center'>
                        <span className='text-5xl font-bold'>{value}</span>
                        <span className='text-sm text-gray-500'>{label}</span>
                    </div>
                ))}
            </div>
        );
    }
};

export function InternshipCountdown() {
    return (
        <section className='pt-10 flex flex-col'>
            <span className='text-3xl text-center justify-center'>I will be returning to Kimley-Horn on</span>
            <span className='text-3xl text-center font-bold justify-center'>June 16, 2026:</span>
            <div className='text-5xl p-5 font-bold text-center justify-center'>
                <Countdown
                    date={new Date('2026-06-16T00:00:00')}
                    renderer={renderer}
                />
            </div>
        </section>
    );
}

const images = [
    codingWorkstation,
    javaClassProject,
    loganOlympiaCapitalBuilding,
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
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded-full shadow p-2 z-10"
                    aria-label="Previous image"
                >
                    &#8592;
                </button>
                <div className="flex w-full justify-center items-center gap-6">
                    {displayImages.map((idx, i) => (
                        <img
                            key={idx}
                            src={images[idx]}
                            alt={`Internship ${idx + 1}`}
                            className={`rounded
                                ${i === 1
                                    ? 'w-[32vw] h-[24vw] object-cover shadow-xl scale-105 z-10'
                                    : 'w-[24vw] h-[18vw] object-cover opacity-70 scale-95'
                                }`}
                            style={{ maxWidth: '400px', maxHeight: '300px' }}
                        />
                    ))}
                </div>
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded-full shadow p-2 z-10"
                    aria-label="Next image"
                >
                    &#8594;
                </button>
            </div>

        </div>
    );
}

export function Internship2025() {
    return (
        <section className='pt-10 flex flex-col'>
            <h1 className='text-5xl font-bold text-center justify-center'>Thank you for a great 2025 internship!</h1>
            <Gallery />
            <InternshipCountdown />
        </section>
    );
}