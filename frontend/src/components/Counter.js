// src/components/TodoList.js
import { useEffect, useState } from "react";

const Counter = ({ counterContract, teamManagerContractName, nearConfig, initialTeamA, initialTeamB, initialCounter }) => {
  const [teamA, setTeamA] = useState(initialTeamA);
  const [teamB, setTeamB] = useState(initialTeamB);
  const [counter, setCounter] = useState(initialCounter);
  const [isLoading, setIsLoading] = useState(false);

  async function Increment() {
    setIsLoading(true)
    await counterContract.increment({}, "300000000000000");
    console.log("DONE INCREMENTING")
    const currentCounterValue = await counterContract.get_num({});
    setCounter(currentCounterValue)

    const currentTeamAValue = await counterContract.account.viewFunction(nearConfig.teamManagerContractName, "get_team_a", {});
    setTeamA(currentTeamAValue); 

    const currentTeamBValue = await counterContract.account.viewFunction(nearConfig.teamManagerContractName, "get_team_b", {});
    setTeamB(currentTeamBValue);
    setIsLoading(false)
  }

  async function Decrement() {
    setIsLoading(true)
    await counterContract.decrement({}, "300000000000000");
    console.log("DONE DECREMENTING")

    const currentCounterValue = await counterContract.get_num({});
    setCounter(currentCounterValue)

    const currentTeamAValue = await counterContract.account.viewFunction(nearConfig.teamManagerContractName, "get_team_a", {});
    setTeamA(currentTeamAValue); 

    const currentTeamBValue = await counterContract.account.viewFunction(nearConfig.teamManagerContractName, "get_team_b", {});
    setTeamB(currentTeamBValue);
    setIsLoading(false)
  }

  async function Reset() {
    setIsLoading(true)
    await counterContract.reset({}, "300000000000000");
    console.log("DONE RESETTING")

    const currentCounterValue = await counterContract.get_num({});
    setCounter(currentCounterValue)

    const currentTeamAValue = await counterContract.account.viewFunction(nearConfig.teamManagerContractName, "get_team_a", {});
    setTeamA(currentTeamAValue); 

    const currentTeamBValue = await counterContract.account.viewFunction(nearConfig.teamManagerContractName, "get_team_b", {});
    setTeamB(currentTeamBValue);
    setIsLoading(false)
  }


  return (
    <ul>
      <div>
        <div>
          Current Counter: {counter}
        </div>
        <button onClick={Decrement}>&lt;</button>
        {" "}
        <button onClick={Increment}>&gt;</button>
        {" "}
        <button onClick={Reset}>Reset</button>
        <div>
          Team A: {teamA}
        </div>
        <div>
          Team B: {teamB}
        </div>
        {isLoading && 
        <div>
          Loading Values....
        </div>}
      </div>
    </ul>
  );
}

export default Counter;
