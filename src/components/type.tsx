import Typewriter from "typewriter-effect";

function Type() {
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
            .typeString("Programming Nerd")
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

export default Type;