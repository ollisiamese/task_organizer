# task_organizer

The app lets user create tasks of different types (based on priority). "Sticky" tasks are meant to always stay on top. During sorting, sticky tasks are sorted by the criteria among themselves but separately from the rest of the tasks.
Each task can be assigned a due time, which can be edited or removed later.
User can move a task between "Pending" and "Completed" columns. While a task has "completed" status, it cannot be edited or sorted in any way until it is moved back to "pending".

The tasks are stored in browser's local storage.

The layout is responsive, at smaller widths each column takes up the whole screen and user can switch between them by pressing on the "bookmark" buttons that appear on the side. On mobile devices, user can also do this by swiping left/right.

Demo:  http://www.ogeinitz.com/task_organizer/

Setup:
<ol>
<li><code>git clone https://github.com/ollisiamese/task_organizer.git</code></li>
<li>cd task_organizer</li>
<li>Install <a href="nodejs.org">NodeJS</a></li>
<li>Install <a href="gruntjs.com">grunt</a></li>
<li>Install node packages: <code>npm install</code></li>
<li>Run <code>grunt</code> -- The app will open in http://localhost:8000/</li>
</ol>
