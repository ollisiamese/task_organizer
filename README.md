# task_organizer

The app lets user create tasks of different types (based on priority). "Sticky" tasks are meant to always stay on top. During sorting, sticky tasks are sorted by the criteria among themselves but separately from the rest of the tasks.
Each task can be assigned a due time, which can be edited or removed later.
User can move a task between "Pending" and "Completed" columns. While a task has "completed" status, it cannot be edited or sorted in any way until it is moved back to "pending".

The tasks are stored in browser's local storage.

The layout is responsive, at smaller widths each column takes up the whole screen and user can switch between them by pressing on the "bookmark" buttons that appear on the side. On mobile devices, user can also do this by swiping left/right.
