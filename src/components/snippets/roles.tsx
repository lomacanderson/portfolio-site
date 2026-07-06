import React from 'react'

function renderRolesCode(lang: string, roleType: React.ReactNode) {
    const isJavaOrCSharp = lang === 'Java' || lang === 'C#';
    const indent1 = lang === 'Java' ? '\u00A0\u00A0' : lang === 'C#' ? '\u00A0\u00A0\u00A0\u00A0' : '';
    const indent2 = lang === 'Java' ? '\u00A0\u00A0\u00A0\u00A0' : lang === 'C#' ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0' : '';
    const quote = lang === 'Python' ? "'" : '"';
    const semicolon = lang === 'Python' ? '' : ';';

    return (
        <code>
            {/* 1. Class Wrapper (Java/C# only) */}
            {lang === 'Java' && <span key="class-java" className="text-[#569CD6]">public class</span>}
            {lang === 'Java' && <span key="class-name-java" className="text-[#4EC9B0]"> About</span>}
            {lang === 'Java' && ' {\n'}
            
            {lang === 'C#' && <span key="class-csharp" className="text-[#569CD6]">public class</span>}
            {lang === 'C#' && <span key="class-name-csharp" className="text-[#4EC9B0]"> About</span>}
            {lang === 'C#' && '\n{\n'}

            {/* 2. Imports */}
            {indent1}
            {lang === 'Python' && <><span className="text-[#C586C0]">from </span><span className="text-[#4EC9B0]">life </span><span className="text-[#C586C0]">import </span><span className="text-[#9CDCFE]">current_roles</span></>}
            {lang === 'Java' && <><span className="text-[#C586C0]">import</span><span className="text-[#9CDCFE]"> life.CurrentRoles</span>;</>}
            {lang === 'JavaScript' && <><span className="text-[#C586C0]">import</span> {'{'} <span className="text-[#9CDCFE]">currentRoles</span> {'}'} <span className="text-[#C586C0]">from</span> <span className="text-[#CE9178]">"./life.js"</span>;</>}
            {lang === 'C#' && <><span className="text-[#C586C0]">using</span> <span className="text-[#4EC9B0]">Life</span>;</>}
            {'\n'}
            {isJavaOrCSharp && '\n'}

            {/* 3. Main Method Header (Java/C# only) */}
            {lang === 'Java' && <>{indent1}<span className="text-[#569CD6]">public static void</span> <span className="text-[#DCDCAA]">main</span>(<span className="text-[#4EC9B0]">String</span>[] <span className="text-[#9CDCFE]">args</span>) {'{\n'}</>}
            {lang === 'C#' && <>{indent1}<span className="text-[#569CD6]">public static void</span> <span className="text-[#DCDCAA]">Main</span>() {'{\n'}</>}

            {/* 4. Variable Declaration (Typewriter line) */}
            {indent2}
            {lang === 'Python' && <span className="text-[#9CDCFE]">role</span>}
            {lang === 'Java' && <><span className="text-[#4EC9B0]">String</span> <span className="text-[#9CDCFE]">role</span></>}
            {lang === 'JavaScript' && <><span className="text-[#569CD6]">const</span> <span className="text-[#9CDCFE]">role</span></>}
            {lang === 'C#' && <><span className="text-[#569CD6]">string</span> <span className="text-[#9CDCFE]">role</span></>}
            {' = '}
            <span className="text-[#CE9178] whitespace-nowrap" key="typewriter-container">
                {quote}
                {roleType}
                {quote}
            </span>
            {semicolon}
            {'\n'}

            {/* 5. Append */}
            {indent2}
            {lang === 'Python' && <><span className="text-[#9CDCFE]">current_roles</span>.<span>append</span>(<span className="text-[#9CDCFE]">role</span>)</>}
            {lang === 'Java' && <><span className="text-[#4EC9B0]">CurrentRoles</span>.<span className="text-[#DCDCAA]">append</span>(<span className="text-[#9CDCFE]">role</span>);</>}
            {lang === 'JavaScript' && <><span className="text-[#9CDCFE]">currentRoles</span>.<span className="text-[#DCDCAA]">push</span>(<span className="text-[#9CDCFE]">role</span>);</>}
            {lang === 'C#' && <><span className="text-[#4EC9B0]">CurrentRoles</span>.<span className="text-[#DCDCAA]">Append</span>(<span className="text-[#9CDCFE]">role</span>);</>}
            {'\n'}

            {/* 6. Print */}
            {indent2}
            {lang === 'Python' && <><span className="text-[#DCDCAA]">print</span>(<span className="text-[#9CDCFE]">current_roles</span>)</>}
            {lang === 'Java' && <><span className="text-[#4EC9B0]">System</span>.<span className="text-[#9CDCFE]">out</span>.<span className="text-[#DCDCAA]">println</span>(<span className="text-[#4EC9B0]">CurrentRoles</span>.<span className="text-[#DCDCAA]">get</span>());</>}
            {lang === 'JavaScript' && <><span className="text-[#9CDCFE]">console</span>.<span className="text-[#DCDCAA]">log</span>(<span className="text-[#9CDCFE]">currentRoles</span>);</>}
            {lang === 'C#' && <><span className="text-[#4EC9B0]">System</span>.<span className="text-[#4EC9B0]">Console</span>.<span className="text-[#DCDCAA]">WriteLine</span>(<span className="text-[#9CDCFE]">role</span>);</>}
            {'\n'}

            {/* 7. Closures */}
            {isJavaOrCSharp && <>{indent1}{'}\n}'}</>}
        </code>
    );
}

const roles: Record<string, (roleType: React.ReactNode) => React.ReactNode> = {
    Python: (roleType: React.ReactNode) => renderRolesCode('Python', roleType),
    Java: (roleType: React.ReactNode) => renderRolesCode('Java', roleType),
    JavaScript: (roleType: React.ReactNode) => renderRolesCode('JavaScript', roleType),
    'C#': (roleType: React.ReactNode) => renderRolesCode('C#', roleType),
};

export default roles
