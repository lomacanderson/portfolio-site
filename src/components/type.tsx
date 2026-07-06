import Typewriter from "typewriter-effect";

export function RoleType() {
    return (
      <Typewriter
      options={{
        delay: 50,
      }}
        onInit={(typewriter) => {
          typewriter
            .typeString("Computer Science Student at Oregon State")
            .callFunction(() => {
              window.dispatchEvent(new CustomEvent('role-typed', { detail: { index: 0 } }));
            })
            .pauseFor(1000)
            .deleteAll()
            .typeString("Software Engineering Intern at Kimley-Horn")
            .callFunction(() => {
              window.dispatchEvent(new CustomEvent('role-typed', { detail: { index: 1 } }));
            })
            .pauseFor(1000)
            .deleteAll()
            .typeString("Future Software Engineer")
            .callFunction(() => {
              window.dispatchEvent(new CustomEvent('role-typed', { detail: { index: 2 } }));
            })
            .pauseFor(1000)
            .deleteAll()
            .typeString("Computer Nerd")
            .callFunction(() => {
              window.dispatchEvent(new CustomEvent('role-typed', { detail: { index: 3 } }));
            })
            .pauseFor(1000)
            .deleteAll()
            .typeString("Creative")
            .callFunction(() => {
              window.dispatchEvent(new CustomEvent('role-typed', { detail: { index: 4 } }));
            })
            .pauseFor(2000)
            .callFunction(() => typewriter.stop())
            .start();
        }}
      />
    );
  }

export function DebugType() {
    return (
      <Typewriter
      options={{
        delay: 50,
      }}
        onInit={(typewriter) => {
          typewriter
            .pauseFor(5000)
            .typeString(", debugging,")
            .pauseFor(2000)
            .callFunction(() => typewriter.stop())
            .start();
        }}
      />
    );
  }

  export function OverrideType() {
    return (
      <Typewriter
      options={{
        delay: 50,
      }}
        onInit={(typewriter) => {
          typewriter
            .typeString("@Override")
            .pauseFor(1000)
            .callFunction(() => typewriter.stop())
            .start();
        }}
      />
    );
  }