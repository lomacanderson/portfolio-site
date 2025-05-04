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
            .pauseFor(1000)
            .deleteAll()
            .typeString("Software Engineering Intern at Kimley-Horn")
            .pauseFor(1000)
            .deleteAll()
            .typeString("Future Software Engineer")
            .pauseFor(1000)
            .deleteAll()
            .typeString("Computer Nerd")
            .pauseFor(1000)
            .deleteAll()
            .typeString("Creative")
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