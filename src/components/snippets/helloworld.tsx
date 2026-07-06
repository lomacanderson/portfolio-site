import { JSX } from 'react'

const helloworld: Record<string, JSX.Element> = {
    '': (
        <code>
            <span className="text-[#D4D4D4]">&lt;</span>
            <span className="text-[#569CD6]">p</span>
            <span className="text-[#D4D4D4]">&gt;</span>
            <span className="text-white"> Hello World! My name is... </span>
            <span className="text-[#D4D4D4]">&lt;/</span>
            <span className="text-[#569CD6]">p</span>
            <span className="text-[#D4D4D4]">&gt;</span>
        </code>
    ),
    Python: (
        <code>
            <span className="text-[#DCDCAA]">print</span>(<span className="text-[#CE9178]">"Hello World! My name is..."</span>)
        </code>
    ),
    Java: (
        <code>
            <span className="text-[#4EC9B0]">System</span>.<span className="text-[#9CDCFE]">out</span>.<span className="text-[#DCDCAA]">println</span>(<span className="text-[#CE9178]">"Hello World! My name is..."</span>);
        </code>
    ),
    JavaScript: (
        <code>
            <span className="text-[#9CDCFE]">console</span>.<span className="text-[#DCDCAA]">log</span>(<span className="text-[#CE9178]">"Hello World! My name is..."</span>);
        </code>
    ),
    'C#': (
        <code>
            <span className="text-[#4EC9B0]">System</span>.<span className="text-[#4EC9B0]">Console</span>.<span className="text-[#DCDCAA]">WriteLine</span>(<span className="text-[#CE9178]">"Hello World! My name is..."</span>);
        </code>
    ),
};

export default helloworld
