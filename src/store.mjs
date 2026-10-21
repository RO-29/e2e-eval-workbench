export function createStore(seed = []) {
  let nextId = seed.length + 1;
  const tasks = seed.map((task) => ({ ...task }));

  return {
    list() {
      return tasks.map((task) => ({ ...task }));
    },
    create(input) {
      const task = { id: String(nextId++), done: false, ...input };
      tasks.push(task);
      return { ...task };
    },
    toggle(id) {
      const task = tasks.find((item) => item.id === id);
      if (!task) return null;
      task.done = !task.done;
      return { ...task };
    },
    reset() {
      tasks.splice(0, tasks.length);
      nextId = 1;
    }
  };
}
