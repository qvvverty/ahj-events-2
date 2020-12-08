import Task from './Task';

export default class TaskWidget {
  bindToDOM(parentElement) {
    this.parentElement = parentElement;
    this.parentElement.innerHTML = `
      <div class="task-widget">
        <p>TOP Tasks</p>
        <input type="text" class="task-input">
        <div class="pinned-tasks">
          <p>Pinned</p>
          <p class="pinned-empty">No pinned tasks</p>
        </div>
        <div class="all-tasks">
          <p>All tasks</p>
          <p class="no-tasks-found hidden">No tasks found</p>
        </div>
      </div>
    `;

    this.pinnedTasksElem = this.parentElement.querySelector('.pinned-tasks');
    this.noPinnedTasksMsgElem = this.parentElement.querySelector('.pinned-empty');
    this.allTasksElem = this.parentElement.querySelector('.all-tasks');
    this.noTasksFoundMsgElem = this.parentElement.querySelector('.no-tasks-found');

    this.inputElem = this.parentElement.querySelector('.task-input');
    this.inputElem.addEventListener('input', this.inputHandler.bind(this));
    this.inputElem.addEventListener('keydown', this.inputKeydownHandler.bind(this));
    this.parentElement.addEventListener('change', this.checkboxHandler.bind(this));

    this.tasks = [];

    this.pinnedTasksObserver = new MutationObserver(this.noPinnedTasksMsgHandler.bind(this));
    this.pinnedTasksObserver.observe(this.pinnedTasksElem, { childList: true });
  }

  inputHandler() {
    this.inputElem.classList.remove('input-error');

    const taskSearchPattern = new RegExp(`^${this.inputElem.value}.*`, 'i');
    const notPinnedTasks = this.parentElement.querySelectorAll('.all-tasks .task');
    let hiddenTasksCounter = 0;
    for (const task of notPinnedTasks) {
      if (taskSearchPattern.test(task.innerText.trim())) {
        task.classList.remove('hidden');
      } else {
        task.classList.add('hidden');
        hiddenTasksCounter += 1;
      }
    }
    if (hiddenTasksCounter === notPinnedTasks.length && this.inputElem.value) {
      this.noTasksFoundMsgElem.classList.remove('hidden');
    } else {
      this.noTasksFoundMsgElem.classList.add('hidden');
    }
  }

  inputKeydownHandler(keydown) {
    if (keydown.keyCode === 13) {
      if (!this.inputElem.value) {
        this.inputElem.classList.add('input-error');
        return;
      }

      const task = new Task(this.inputElem.value);
      this.tasks.push(task);
      this.allTasksElem.append(task.element);
      this.inputElem.value = '';
      this.inputElem.dispatchEvent(new Event('input'));
    }
  }

  checkboxHandler(change) {
    if (change.target.type === 'checkbox') {
      if (change.target.checked) {
        this.pinnedTasksElem.append(change.target.closest('.task'));
      } else {
        this.allTasksElem.append(change.target.closest('.task'));
      }
    }
    this.inputElem.dispatchEvent(new Event('input'));
  }

  noPinnedTasksMsgHandler(mutation) {
    if (mutation[0].target.childElementCount > 2) {
      this.noPinnedTasksMsgElem.classList.add('hidden');
    } else {
      this.noPinnedTasksMsgElem.classList.remove('hidden');
    }
  }
}
