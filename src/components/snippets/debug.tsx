import { JSX } from 'react'

const debug: Record<string, JSX.Element> = {
    Python: (
        <code>
          <span className="text-[#569CD6]">class</span><span className="text-[#4EC9B0]"> TextBox</span>:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#569CD6]">def</span> <span className="text-[#DCDCAA]">syntax_colors</span>(<span className="text-[#9CDCFE]">self</span>) -&gt; <span className="text-[#4EC9B0]">list</span>[<span className="text-[#4EC9B0]">str</span>]:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return</span> [<span className="text-[#CE9178]">"#FFFFFF"</span>]<br /><br />
          <span className="text-[#569CD6]">class</span><span className="text-[#4EC9B0]"> Python</span>(<span className="text-[#4EC9B0]">TextBox</span>):<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#569CD6]">def</span> <span className="text-[#DCDCAA]">syntax_colors</span>(<span className="text-[#9CDCFE]">self</span>) -&gt; <span className="text-[#4EC9B0]">list</span>[<span className="text-[#4EC9B0]">str</span>]:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return</span> [<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#FFFFFF"</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#569CD6"</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#C586C0"</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#CE9178"</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#DCDCAA"</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#4EC9B0"</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br />
        </code>
    ),
    Java: (
        <code>
          <span className="text-[#569CD6]">class</span><span className="text-[#4EC9B0]"> TextBox </span>{'{\n'}
          &nbsp;&nbsp;<span className="text-[#569CD6]">public</span><span className="text-[#4EC9B0]"> String</span>[] <span className="text-[#DCDCAA]">syntaxColors</span>() {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return new</span> <span className="text-[#4EC9B0]">String</span>[] {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#FFFFFF"</span>{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;{'}'};{'\n'}
          &nbsp;&nbsp;{'}'}{'\n'}
          {'}'}{'\n\n'}
          <span className="text-[#569CD6]">class</span><span className="text-[#4EC9B0]"> Java </span><span className="text-[#569CD6]">extends</span><span className="text-[#4EC9B0]"> TextBox </span>{'{\n'}
          &nbsp;&nbsp;@<span className="text-[#4EC9B0]">Override</span>{'\n'}
          &nbsp;&nbsp;<span className="text-[#569CD6]">public</span><span className="text-[#4EC9B0]"> String</span>[] <span className="text-[#DCDCAA]">syntaxColors</span>() {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return new</span> <span className="text-[#4EC9B0]">String</span>[] {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#FFFFFF"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#569CD6"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#C586C0"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#CE9178"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#DCDCAA"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#4EC9B0"</span>{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;{'}'};{'\n'}
          &nbsp;&nbsp;{'}'}{'\n'}
          {'}'}
        </code>
    ),
    JavaScript: (
        <code>
          <span className="text-[#569CD6]">class</span><span className="text-[#4EC9B0]"> TextBox </span>{'{\n'}
          &nbsp;&nbsp;<span className="text-[#DCDCAA]">syntaxColors</span>() {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return</span> [<span className="text-[#CE9178]">"#FFFFFF"</span>];{'\n'}
          &nbsp;&nbsp;{'}'}{'\n'}
          {'}'}{'\n\n'}
          <span className="text-[#569CD6]">class</span><span className="text-[#4EC9B0]"> JavaScript </span><span className="text-[#569CD6]">extends</span><span className="text-[#4EC9B0]"> TextBox </span>{'{\n'}
          &nbsp;&nbsp;<span className="text-[#DCDCAA]">syntaxColors</span>() {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return</span> [{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#FFFFFF"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#569CD6"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#C586C0"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#CE9178"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#DCDCAA"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#4EC9B0"</span>{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;];{'\n'}
          &nbsp;&nbsp;{'}'}{'\n'}
          {'}'}
        </code>
    ),
    'C#': (
        <code>
          <span className="text-[#569CD6]">public class</span><span className="text-[#4EC9B0]"> TextBox</span>{'\n'}
          {'{'}{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#569CD6]">public virtual string</span>[] <span className="text-[#DCDCAA]">SyntaxColors</span>() {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return new string</span>[] {'{'} <span className="text-[#CE9178]">"#FFFFFF"</span> {'}'};{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;{'}'}{'\n'}
          {'}'}{'\n\n'}
          <span className="text-[#569CD6]">public class</span><span className="text-[#4EC9B0]"> CSharp</span> : <span className="text-[#4EC9B0]">TextBox</span>{'\n'}
          {'{'}{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#569CD6]">public override string</span>[] <span className="text-[#DCDCAA]">SyntaxColors</span>() {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return new string</span>[] {'{\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#FFFFFF"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#569CD6"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#C586C0"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#CE9178"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#DCDCAA"</span>,{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#4EC9B0"</span>{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'};{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;{'}'}{'\n'}
          {'}'}
        </code>
    ),
};

export default debug