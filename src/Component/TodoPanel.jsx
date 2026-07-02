import {useState} from "react";


function TodoPanel(){
    const [task, setTask] = useState("");
    const [totalTasks, setTotalTasks] = useState([]);

    function addTask(){
        if (task === "") return;

        const updatedTasks = [...totalTasks, task];

        setTotalTasks(updatedTasks);

        setTask("");
    }

    return <div>
        <main className="flex justify-center px-10 py-10">
            <section className="w-full max-w-xl rounded-lg bg-gray-600 p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-white">My Tasks</h2>{/*input*/}
                <div className="flex gap-2">
                    <input type="text"
                            // value = {task}
                            onChange = {(userInput) => setTask(userInput.target.value)}
                            placeholder="Enter a task"
                            className="flex-1 rounded-md px-3 py-2 text-black"
                    />
                    <button onClick={addTask} className="rounded-md bg-blue-500 px-6 py-2 text-white">Add</button>
                    {/* <button className="rounded-md bg-green-500 px-6 py-2 text-white">Completed</button> */}
                </div>
                <ul className="mt-4 space-y-2 text-left">
                    {totalTasks.map((item, index) => (
                        <li key = {index} className="rounded-md bg-gray-700 px-3 py-2 text-white">
                            {item}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    </div>
}
export default TodoPanel