import React, { useEffect, useState } from "react";
import Progressbar from "../../components/loadingFeedback/Progressbar";

function TesteL() {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(Math.random() * 100);
    }, 3000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div className="App">
      <Progressbar value={progress} />
    </div>
  );
}

export default TesteL;
