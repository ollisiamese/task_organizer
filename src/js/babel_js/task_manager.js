//	Class TaskManager

var TaskManager = {
	
	pendingTasks: [],
	
	completedTasks: [],
	
	//	Object that translates tasks' priority values into colors for class names
	priorityValues: {
		
		'1sticky': 'yellow',
		'2high'	: 'red',
		'3med'	: 'orange',
		'4low'	: 'blue'		
	},
	
	/**
	*	Calls the constructor function of the Task class,
	*	adds the new task to the array of pending tasks,
	*	saves the new task in localStorage as part of a corresponding array,
	*	inserts the task visually, by copying template.
	*
	*	@param string type
	*
	*	@return
	**/	
	createNewTask(type) {
		
		var task = new Task(type);
		
		this.pendingTasks.push(task);
		
		this.saveTasks('pending');
		
		//	Create the task html and insert at the top of the pending tasks
		var tpl = document.getElementsByClassName('task-template')[0];
		var freshTask = tpl.cloneNode(true);
		var container = document.getElementById('pendingTasks');
		
		
		//	Give the new task the appropriate class name
		UI.addClass(freshTask, 'task-' + this.priorityValues[type]);
		UI.removeClass(freshTask, 'task-template');
		freshTask.setAttribute('data-task-id', 't_' + task.dateTimeCreated);
		
		container.insertBefore(freshTask, container.children[0]);
		
		//	Enter edit mode on the title of the task
		var titleDisplayEl = freshTask.children[0].children[0];
		
		UI.enterEditMode(titleDisplayEl);
	},
	
	/**
	*	Finds the task by id in the pending array of tasks
	*	and updates its fields.
	*	Update to one task triggers saving the entire pending array since it is
	*	stored as a string in localStorage
	*	*Only pending tasks are editable/updateable
	*
	*	@param string id, object updateObj
	*
	*	@return
	**/
	updatePendingTask(id, updateObj) {
		
		var taskId = parseInt(id.slice(2), 10);
		
		//	Find the task by its id in the pending array 
		var task = this.pendingTasks.filter((item) => {return item.dateTimeCreated === taskId})[0];
	
		//	Update the task according to the updateObject
		for(var key in updateObj) {
			
			task[key] = updateObj[key];
		}
		
		this.saveTasks('pending');		
	},
	
	/**
	*	Deletes the task from local storage
	*	Searches for task in pending and completed and removes it from the array
	*
	*	@param html element elem
	*
	*	@return
	**/
	deleteTask(elem) {
		
		var taskId = elem.getAttribute('data-task').slice(2);
		
		//	Search for the task id in pending
		var taskObj = this.pendingTasks.filter((item) => {return item.dateTimeCreated.toString() === taskId})[0];
		
		//	Found in pending
		if(taskObj) {
			
			var taskIndex = this.pendingTasks.indexOf(taskObj);
			
			this.pendingTasks.splice(taskIndex, 1);
			
			this.saveTasks('pending');
			
			this.loadTasks('pending');
		
		} else {
			
			//	Search in completed
			var taskObj = this.completedTasks.filter((item) => {return item.dateTimeCreated.toString() === taskId})[0];		
			
			//	Found in completed
			if(taskObj) {
				
				var taskIndex = this.completedTasks.indexOf(taskObj);
			
				this.completedTasks.splice(taskIndex, 1);
				
				this.saveTasks('completed');
				
				this.loadTasks('completed');
			}
		}
		
		UI.closeOverlay();
	},
	
	
	/**
	*	Changes task completion status between 'pending' and 'completed'
	*	by adding/removing it to/from the appropriate array.
	*	Calls saveTasks() for both arrays, since both were affected
	*
	*	@param string taskId, string destinationCategory
	*
	*	@return
	**/	
	changeTaskCompletionStatus(taskId, destinationCategory) {
		
		taskId = taskId.slice(2);
		
		//	Moving from completed to pending
		if(destinationCategory == 'pending') {
			
			var task = this.completedTasks.filter((item) => {return item.dateTimeCreated.toString() === taskId})[0];
		
			var taskIndex = this.completedTasks.indexOf(task);
			
			this.completedTasks.splice(taskIndex, 1);
			
			this.pendingTasks.unshift(task);
			
		} else {
		
			//	Moving from pending to completed
			var task = this.pendingTasks.filter((item) => {return item.dateTimeCreated.toString() === taskId})[0];
			
			var taskIndex = this.pendingTasks.indexOf(task);
			
			this.pendingTasks.splice(taskIndex, 1);
			
			this.completedTasks.length > 0 ? this.completedTasks.unshift(task) : this.completedTasks.push(task);			
		}
		
		this.saveTasks('pending');
		this.saveTasks('completed');
	},
	
	/**
	*	Updates the specified task category in the local storage
	*
	*	@param (optional) string cat
	*
	*	@return
	**/
	saveTasks(cat) {
		
		if(cat) {
			
			localStorage.setItem(cat, JSON.stringify(this[cat + 'Tasks']));
			
		} else {
			
			//	If no 'pending' or 'completed' category name was provided, saves both
			localStorage.setItem('pending', JSON.stringify(this.pendingTasks));
			localStorage.setItem('completed', JSON.stringify(this.completedTasks));
		}
	},
	
	/**
	*	Retrieves the specified task category from the local storage
	*
	*	@param string cat
	*
	*	@return Object
	**/
	retrieveTasks(cat) {
		
		return JSON.parse(localStorage.getItem(cat));		
	},
	
	/**
	*	Sorts pending tasks (only pending tasks can be sorted)
	*	by priority. Sticky tasks always stay at the top
	*
	*	@return
	**/
	sortByPriority() {
	
		//	First, sticky ones
		var sortedSticky = this.pendingTasks.filter((item) => {			
			
			return item.type === '1sticky';
			
		}).sort((a,b) => {
			
			if(a.dateTimeCreated > b.dateTimeCreated) {
				
				return 1;
				
			} else if(a.dateTimeCreated < b.dateTimeCreated) {
				
				return -1;
				
			} else {
				
				return 0;
			}
		});
		
		var sortedRest = this.pendingTasks.filter((item) => {			
			
			return item.type !== '1sticky';	
			
		}).sort((a,b) => {
			
			if(a.type > b.type) {
				
				return 1;
				
			} else if(a.type < b.type) {
				
				return -1;
				
			} else {
				
				//	Within the same priority, sort by due time
				if(a.dateTimeCreated > b.dateTimeCreated) {
					
					return 1;
					
				} else if(a.dateTimeCreated < b.dateTimeCreated) {
					
					return -1;
					
				} else {
					
					return 0;
				}
			}
		});
		
		this.pendingTasks = sortedSticky.concat(sortedRest);
		
		//	Reverse because loadTasks populates in reverse
		this.pendingTasks.reverse();
		
		this.saveTasks('pending');
		this.loadTasks('pending');
	},
	
	/**
	*	Sorts pending tasks (only pending tasks can be sorted)
	*	by their due time. Sticky tasks stay on top.
	*
	*	@return
	**/
	sortByDueTime() {
		
		//	First sort sticky tasks among themselves, then sort the rest, and
		//	concat the arrays
		var sortedStickyWithDueTime = this.pendingTasks.filter((item) => {			
			
			return item.type === '1sticky' && item.dueTime;
			
		}).sort((a,b) => {
			
			if(a.dueTime > b.dueTime) {
				
				return 1;
				
			} else if(a.dueTime < b.dueTime) {
				
				return -1;
				
			} else {
				
				return 0;
			}
		});
		
		var sortedStickyNoDueTime = this.pendingTasks.filter((item) => {			
			
			return item.type === '1sticky' && !item.dueTime;
			
		}).sort((a,b) => {
			
			if(a.dateTimeCreated > b.dateTimeCreated) {
				
				return 1;
				
			} else if(a.dateTimeCreated < b.dateTimeCreated) {
				
				return -1;
				
			} else {
				
				return 0;
			}
		});
		
		var sortedRestWithDueTime = this.pendingTasks.filter((item) => {			
			
			return item.type !== '1sticky' && item.dueTime;	
			
		}).sort((a,b) => {
			
			if(a.dueTime > b.dueTime) {
				
				return 1;
				
			} else if(a.dueTime < b.dueTime) {
				
				return -1;
				
			} else {
				
				return 0;
			}
		});
		
		var sortedRestNoDueTime = this.pendingTasks.filter((item) => {			
			
			return item.type !== '1sticky' && !item.dueTime;	
			
		}).sort((a,b) => {
			
			if(a.dateTimeCreated > b.dateTimeCreated) {
				
				return 1;
				
			} else if(a.dateTimeCreated < b.dateTimeCreated) {
				
				return -1;
				
			} else {
				
				return 0;
			}
		});
		
		this.pendingTasks = sortedStickyWithDueTime.concat(sortedStickyNoDueTime).concat(sortedRestWithDueTime).concat(sortedRestNoDueTime);
		
		//	Reverse because loadTasks populates in reverse
		this.pendingTasks.reverse();
		
		this.saveTasks('pending');
		this.loadTasks('pending');
	},
	
	
	/**
	*	Sorts pending tasks (only pending tasks can be sorted)
	*	chronologically. Sticky tasks stay on top.
	*
	*	@return
	**/
	sortByTimeCreated() {
		
		//	First sort sticky tasks among themselves, then sort the rest, and
		//	concat the two arrays
		var sortedSticky = this.pendingTasks.filter((item) => {			
			
			return item.type === '1sticky';
			
		}).sort((a,b) => {
			
			if(a.dateTimeCreated > b.dateTimeCreated) {
				
				return 1;
				
			} else if(a.dateTimeCreated < b.dateTimeCreated) {
				
				return -1;
				
			} else {
				
				return 0;
			}
		});

		var sortedRest = this.pendingTasks.filter((item) => {			
			
			return item.type !== '1sticky';	
			
		}).sort((a,b) => {
			
			if(a.dateTimeCreated > b.dateTimeCreated) {
				
				return 1;
				
			} else if(a.dateTimeCreated < b.dateTimeCreated) {
				
				return -1;
				
			} else {
				
				return 0;
			}
		});
		
		this.pendingTasks = sortedSticky.concat(sortedRest);
		
		//	Reverse because loadTasks populates in reverse
		this.pendingTasks.reverse();
		
		this.saveTasks('pending');
		this.loadTasks('pending');
	},
	
	/**
	*	Loads the specified column of tasks (pending/completed)
	*	
	*	@param string cat
	*
	*	@return
	**/
	loadTasks(cat) {
		
		//	Get the required array from the storage
		var category = this.retrieveTasks(cat);
		
		//	Overwrite the array
		this[cat + 'Tasks'] = category;
		
		//	Call the UI function to write in html elements
		UI.writeTaskCategory(category, cat);
	}
	
};