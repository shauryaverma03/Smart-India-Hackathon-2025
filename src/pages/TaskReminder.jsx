import React, { useState } from "react";
import "./TaskReminder.css";

const TaskReminder = () => {
  const [tasks, setTasks] = useState([]);
  const [output, setOutput] = useState("👉 Tasks will appear here.");
  const [showForm, setShowForm] = useState(false);

  const webhookURL =
    "https://manishai.app.n8n.cloud/webhook-test/cecf5d93-0096-45c5-ae54-68ea3edb42af";

  // Toggle form visibility
  const showAddForm = () => setShowForm(!showForm);

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const desc = e.target.desc.value;
    const startDate = e.target.startDate.value;
    const endDate = e.target.endDate.value;
    const email = e.target.email.value;

    if (!title || !desc || !startDate || !endDate || !email) {
      alert("⚠ Please fill all fields!");
      return;
    }

    const newTask = {
      title,
      desc,
      startDate,
      endDate,
      email,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setOutput(`⏳ Sending "${title}" to backend...`);

    try {
      const res = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const data = await res.text();
      setOutput(`✅ Task "${title}" added!\n📩 Backend says:\n${data}`);
    } catch (err) {
      setOutput(`❌ Failed to send: ${err}`);
    }

    e.target.reset();
    setShowForm(false);
  };

  // View tasks
  const viewTasks = () => {
    if (tasks.length === 0) {
      setOutput("⚠ No tasks available.");
      return;
    }
    let container = "--- Current Tasks ---\n\n";
    tasks.forEach((t, i) => {
      container += `${i + 1}. ${t.title}\n   📝 ${t.desc}\n   🟢 Starts: ${
        t.startDate
      }\n   🔴 Ends: ${t.endDate}\n   ✉ Assigned to: ${t.email}\n   Status: ${
        t.completed ? "✔ Completed" : "⏳ Pending"
      }\n\n`;
    });
    setOutput(container);
  };

  // Mark completed (Corrected Function)
  const markCompleted = () => {
    const indexStr = prompt("Enter task number to mark completed:");
    const index = parseInt(indexStr, 10);

    if (isNaN(index) || index < 1 || index > tasks.length) {
      alert("Invalid task number!");
      return;
    }

    const updatedTasks = tasks.map((task, i) => {
      if (i === index - 1) {
        // Return a new object with the 'completed' property updated
        return { ...task, completed: true };
      }
      // Otherwise, return the original, unchanged task object
      return task;
    });

    setTasks(updatedTasks);
    setOutput(`✅ Task "${tasks[index - 1].title}" marked as completed!`);
  };

  // Remove task
  const removeTask = () => {
    const index = prompt("Enter task number to remove:");
    if (!index || index < 1 || index > tasks.length) {
      alert("Invalid task number!");
      return;
    }
    const updated = [...tasks];
    const removed = updated.splice(index - 1, 1)[0];
    setTasks(updated);
    setOutput(`🗑 Removed: ${removed.title}`);
  };

  // Show past tasks
  const showPastTasks = () => {
    const today = new Date().toISOString().split("T")[0];
    let past = tasks.filter((t) => t.endDate < today);
    if (past.length === 0) {
      setOutput("🎉 No past tasks!");
      return;
    }
    let container = "--- Past Tasks ---\n\n";
    past.forEach((t) => {
      container += `📌 ${t.title}\n   📝 ${t.desc}\n   🟢 Started: ${t.startDate}\n   🔴 Ended: ${t.endDate}\n\n`;
    });
    setOutput(container);
  };

  return (
    <div>
      <h1>📌 Task Reminder</h1>
      <div className="app-container">
        {/* Task List Side */}
        <div className="tasks-side">
          <h2>📝 Tasks</h2>
          <div className="output">{output}</div>
        </div>

        {/* Menu Side */}
        <div className="menu-side">
          <h2>⚙ Menu</h2>
          <div className="menu-buttons">
            <button onClick={showAddForm}>➕ Add Task</button>
            <button onClick={viewTasks}>📋 View Tasks</button>
            <button onClick={showPastTasks}>⏳ Past Tasks</button>
            <button onClick={removeTask}>🗑 Remove Task</button>
            <button onClick={markCompleted}>✅ Complete Task</button>
            <button
              onClick={() =>
                setOutput("👋 Exiting app. Refresh page to restart.")
              }
            >
              🚪 Exit
            </button>
          </div>

          {/* Task Form */}
          {showForm && (
            <form id="form" className="form-container" onSubmit={addTask}>
              <h3>Add New Task</h3>
              <input type="text" name="title" placeholder="Task Title" />
              <textarea name="desc" placeholder="Task Description"></textarea>
              <input type="date" name="startDate" />
              <input type="date" name="endDate" />
              <input type="email" name="email" placeholder="Enter your Gmail" />
              <button type="submit">💾 Save Task</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskReminder;
