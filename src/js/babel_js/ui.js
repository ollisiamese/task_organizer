//Class UI

var UI = {
	
	/**
	*	Add event listeners
	*
	*	@return
	**/
	init: () => {
		
		var columnOne = document.getElementsByClassName('column-one')[0];
		var columnTwo = document.getElementsByClassName('column-two')[0];
		
		
		//	When clicked anywhere in the pending tasks section, close the dropdowns if they were open
		columnOne.addEventListener(
			
			'click', 
			(ev) => {
				
				var dropDownSort = document.getElementsByClassName('dropDown-sort')[0];
				var dropDownAdd	 = document.getElementsByClassName('dropDown-add')[0];
				
				
				if(UI.hasClass(dropDownSort, 'open') && ev.target != dropDownSort && ev.target.parentNode != dropDownSort) {
					
					UI.closeDropDown('sort');
					
				} else if(UI.hasClass(dropDownAdd, 'open') && ev.target != dropDownAdd && ev.target.parentNode != dropDownAdd) {
					
					//	The dd menus will never be open at the same time, hence 'else'
					UI.closeDropDown('add');
				}
			}
		);

		//	For mobile devices, add event listeners for swiping between the slides
	
		//	Swiping left on column one
		columnOne.addEventListener(
			'touchstart',
			(touch) => {
				UI.startTouch = touch.changedTouches[0].pageX;
			}
		);
		
		columnOne.addEventListener(
			'touchend',
			(touch) => {

				UI.stopTouch = touch.changedTouches[touch.changedTouches.length -1].pageX;
				
				if(UI.startTouch - UI.stopTouch > 80) {
					
					UI.slideColumn(1);
				}
			}
		);
		
		//	Swiping right on column two
		columnTwo.addEventListener(
			'touchstart',
			(touch) => {
				UI.startTouch = touch.changedTouches[0].pageX;
			}
		);
		
		columnTwo.addEventListener(
			'touchend',
			(touch) => {

				UI.stopTouch = touch.changedTouches[touch.changedTouches.length -1].pageX;
				
				if(UI.stopTouch - UI.startTouch > 80) {
					
					UI.slideColumn(0);
				}
			}
		);
	},
	
	
	/**
	*	Adds a classname to an element
	*
	*	@param html element elem, string classNm
	*
	*	@return
	**/
	addClass(elem, classNm) {
		
		if(classNm && typeof classNm.toLowerCase() == 'string' && elem.className.indexOf(classNm) === -1) {
			elem.className += ' ' + classNm;
		}		
	},
	
	/**
	*	Removes a classname from an element
	*
	*	@param html element elem, string classNm
	*
	*	@return
	**/
	removeClass(elem, classNm) {
	
		if(classNm && typeof classNm.toLowerCase() == 'string' && elem.className.indexOf(classNm) !== -1) {
			
			var lastChar = classNm.indexOf(classNm.length-1);
			var classes	= elem.className.split(' ');
			var index = classes.indexOf(classNm);
			
			classes.splice(index, 1);
		
			elem.className = classes.join(' ');
		}
	},
	
	/**
	*	Gets the element's parent by id or by class
	*
	*	@param html object el, string attr, string attrVal
	*
	*	@return html element
	**/
	getParentEl(el, attr, attrVal) {
		
		var parentEl = el.parentNode;
		
		while(parentEl !=null) {
			
			var currentParent = parentEl;
			
			//	If looking up by id
			if(attr === 'id') {
				
				if(currentParent.getAttribute('id') && currentParent.getAttribute('id') === attrVal) {
					
					return currentParent;
				}
				
			} else if(attr === 'class') {
				
				//	If looking up by class
				if(currentParent.className && currentParent.className.indexOf(attrVal) !== -1) {
					
					return currentParent;
				}
			}
			
			parentEl = currentParent.parentNode;
		}
		
		return false;
	},
	
	/**
	*	Checks to see if an element has the specified class
	*
	*	@param HTML element elem, string className
	*
	*	@return Boolean
	**/
	hasClass(elem, className) {
		
		return(elem.className.indexOf(className) != -1 ? true : false);
	},
	
	/**
	*	Switches to the specified section .column
	*
	*	@param int columnIndex
	*
	*	@return;
	**/
	slideColumn(columnIndex) {
		
		var firstCol = document.querySelector('.column-one');
		var secondCol = document.querySelector('.column-two');
		
		var firstBkmk = document.querySelector('.bookmark-right');
		var secondBkmk = document.querySelector('.bookmark-left');
		
		//	Showing the first column (Incomplete tasks)
		if(columnIndex === 0) {
			
			UI.removeClass(firstCol, 'hide');
			UI.addClass(secondCol, 'hide');
			
			UI.removeClass(firstBkmk, 'hide');
			UI.addClass(secondBkmk, 'hide');
			
		} else if(columnIndex === 1) {
			
			//	Showing the second column (Completed tasks)		
			UI.removeClass(secondCol, 'hide');
			UI.addClass(firstCol, 'hide');
			
			UI.addClass(firstBkmk, 'hide');
			UI.removeClass(secondBkmk, 'hide');
		}
		
		UI.closeDropDown('add');
		UI.closeDropDown('sort');
	},
	
	/**
	*	Toggles the specified dropdown menu open/closed
	*
	*	@param string name
	*
	*	@return
	**/
	toggleDropDown(name) {
		
		var ddBtn = document.getElementsByClassName('dropDown-'+name)[0];

		if(!UI.hasClass(ddBtn, 'open')) {
		
			UI.openDropDown(name);
			
		} else {
			
			UI.closeDropDown(name);
		}		
	},
	
	/**
	*	Opens the specified dropdown menu
	*
	*	@param string name
	*
	*	@return
	**/
	openDropDown(name) {
		
		var ddBtn = document.getElementsByClassName('dropDown-'+name)[0];		
		UI.addClass(ddBtn, 'open');
		
		var ddList = ddBtn.nextElementSibling;
		UI.addClass(ddList, 'open');		
	},
	
	/**
	*	Opens the specified dropdown menu
	*
	*	@param string name
	*
	*	@return
	**/
	closeDropDown(name) {
		
		var ddBtn = document.getElementsByClassName('dropDown-'+name)[0];
		UI.removeClass(ddBtn, 'open');
		
		var ddList = ddBtn.nextElementSibling;
		UI.removeClass(ddList, 'open');		
	},
	
	/**
	*	Enters edit mode for the clicked input
	*
	*	@param html element elem
	*
	*	@return
	**/
	enterEditMode(elem) {
		
		var taskEl = elem.parentNode.parentNode.getAttribute('data-task-id') ? elem.parentNode.parentNode : elem.parentNode.parentNode.parentNode;
		
		//	Cannot enter edit mode on a completed task
		if(!UI.hasClass(taskEl, 'completed')) {
			
			//	If not already in edit mode
			if(!UI.hasClass(elem.parentNode, 'edit-mode')) {
				
				UI.addClass(elem.parentNode, 'edit-mode');
				elem.nextElementSibling.focus();
				
				//	Add class .selected to the task
				UI.addClass(taskEl, 'selected');
			}
			
			//	To allow for mobile keyboard, scroll the column when entering edit mode
			if(UI.isAndroid) {
				
				var coords = elem.nextElementSibling.getBoundingClientRect();
				
				if(coords.top > 120) {
					
					var diff = coords.top - 150;
					document.getElementsByClassName('column-one')[0].scrollTop += diff;
				}
			}			
		}
	},
	
	/**
	*	Leaves edit mode for the clicked input,
	*	syncs the input with the corresponding display span and
	*	calls
	*
	*	@param html element elem
	*
	*	@return
	**/
	leaveEditMode(elem) {
		
		//	If in edit mode
		if(UI.hasClass(elem.parentNode, 'edit-mode')) {
			
			var taskEl = elem.parentNode.parentNode.getAttribute('data-task-id') ? elem.parentNode.parentNode : elem.parentNode.parentNode.parentNode;
			
			var taskId = taskEl.getAttribute('data-task-id');
		
			var update;
			
			var siblingDisplaySpan = elem.previousElementSibling;
			
			if(elem.value.trim()) {
				
				siblingDisplaySpan.innerHTML = elem.value;
				
				if(UI.hasClass(elem, 'title-input')) {
					
					update = {'title': elem.value};
			
				} else if(UI.hasClass(elem, 'body-input')) {
					
					update = {'body': elem.value};
				}
				
			} else {
				
				//	If input was cleared, insert placeholder into corresponding display span
				if(UI.hasClass(elem, 'title-input')) {
					
					siblingDisplaySpan.innerHTML = 'Type in the title here...';
					
					update = {'title': ''};
					
				} else if(UI.hasClass(elem, 'body-input')) {
					
					siblingDisplaySpan.innerHTML = 'Body of the task here...';
					
					update = {'body': ''};
				}
			}
			
			UI.removeClass(elem.parentNode, 'edit-mode');
			
			//	Remove class .selected from the task
			UI.removeClass(taskEl, 'selected');
			
			//	Call to save the task
			TaskManager.updatePendingTask(taskId, update);
		}
	},
	
	
	/**
	*	Checks if the key pressed was Enter,
	*	and if it was, calls the leaveEditMode() fn for the elem
	*
	*	@param html element elem, event evt
	*
	*	@return
	**/
	checkInputEnter(elem, evt) {
		
		if(evt.which === 13) {
			UI.leaveEditMode(elem);
		}
	},
	
	/**
	*	Toggles the task's .time area on and off
	*
	*	@param html element elem
	*
	*	@return
	**/
	toggleTimeArea(elem) {
	
		var taskEl = elem.parentNode.parentNode.parentNode;
		
		var timeArea = elem.nextElementSibling;
		
		if(!UI.hasClass(timeArea, 'edit-mode')) {
			
			UI.addClass(timeArea, 'edit-mode');
			UI.addClass(taskEl, 'selected');
		
		} else {
			
			UI.removeClass(timeArea, 'edit-mode');
			UI.removeClass(taskEl, 'selected');
		}
	},
	
	/**
	*	Removes the due time from the task,
	*	triggers an update on the task
	*
	*	@param html element elem
	*
	*	@return
	**/
	removeTimeDue(elem) {
		
		var taskEl = elem.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
		var taskId = taskEl.getAttribute('data-task-id');
		
		UI.removeClass(taskEl, 'timed');
		
		UI.removeClass(taskEl, 't-edit');
		
		//	Clear inputs and time display spans
		var inputContainer = elem.parentNode.previousElementSibling;
		var hours = inputContainer.children[1];
		var minutes = inputContainer.children[2];
		var ampm = inputContainer.children[3];
		
		hours.value = '00';
		minutes.value = '00';
		ampm.innerHTML = 'AM';
		
		var timeDisplayContainer = elem.parentNode.parentNode.nextElementSibling;
		
		var dHours = timeDisplayContainer.children[0];
		var dMinutes = timeDisplayContainer.children[1];
		var dAmpm = timeDisplayContainer.children[2];
		
		dHours.innerHTML = '00';
		dMinutes.innerHTML = '00';
		dAmpm.innerHTML = 'AM';
		
		var update = {'dueTime': ''};
		
		var clockIcon = elem.parentNode.parentNode.parentNode.previousElementSibling;
		
		//	Call to save the task
		TaskManager.updatePendingTask(taskId, update);
		
		//	Exit selected/edit mode on the task, pass clockIcon for reference
		this.toggleTimeArea(clockIcon);
		
	},
	
	/**
	*	Sets a value for due time for the task,
	*	triggers an update on the task
	*
	*	@param html element elem
	*
	*	@return
	**/
	setDueTime(elem) {
		
		var taskEl = elem.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
		var taskId = taskEl.getAttribute('data-task-id');
		
		var inputContainer = elem.parentNode.previousElementSibling;
		var hours = (inputContainer.children[1].value.length === 1 && inputContainer.children[1].value < 10) ? "0" + inputContainer.children[1].value : inputContainer.children[1].value;
		var minutes = (inputContainer.children[2].value.length === 1 && inputContainer.children[2].value < 10) ? "0" + inputContainer.children[2].value : inputContainer.children[2].value;
		var ampm = inputContainer.children[3].innerHTML;
		
		if(hours == '0' || hours == '00' || hours > 12 || !hours) {
			
			hours = '12';
			inputContainer.children[1].value = 12;
		}
		
		if(minutes === '0' || !minutes) {
			
			minutes	= '00';
			
		} else if(minutes > 59) {
			
			minutes = '59';
			inputContainer.children[2].value = 59;
		}
		
		//	Translate entered time into ms
		var dueTime	= new Date();
		
		if(ampm == 'PM') {
			
			if(hours === '12') {
				
				dueTime.setHours('12');
				
			} else {
				
				dueTime.setHours(parseInt(hours, 10) + 12);
			}
			
		} else {
			
			if(hours === '12') {
				
				dueTime.setHours('0');
				
			} else {
				
				dueTime.setHours(hours);
			}
		}
		
		dueTime.setMinutes(minutes);
		
		dueTime = dueTime.getTime();
		
		var update = {'dueTime': dueTime};
		
		var clockIcon = elem.parentNode.parentNode.parentNode.previousElementSibling;
		
		var timeDisplayContainer = inputContainer.parentNode.nextElementSibling;
		
		var dHours = timeDisplayContainer.children[0];
		var dMinutes = timeDisplayContainer.children[1];
		var dAmpm = timeDisplayContainer.children[2];
		
		dHours.innerHTML = hours;
		dMinutes.innerHTML = minutes;
		dAmpm.innerHTML	= ampm;
		
		UI.removeClass(taskEl, 't-edit');
		
		//	Call to save the task
		TaskManager.updatePendingTask(taskId, update);
		
		//	Exit selected/edit mode on the task, pass clockIcon for reference
		this.toggleTimeArea(clockIcon);
		
		UI.addClass(taskEl, 'timed');		
	},
	
	/**
	*	Toggles the Am-PM button text 
	*
	*	@param html element elem
	*
	*	@return
	**/
	toggleAmPm(elem) {
		
		if(elem.innerHTML === 'AM') {
		
			elem.innerHTML = 'PM';
			
		} else {
			
			elem.innerHTML = 'AM';
		}
	},
	
	
	/**
	*	Switches the currently set time display to edit mode
	*
	*	@param html element elem
	*
	*	@return
	**/
	switchTimeDisplayToEdit(elem) {
		
		var taskEl = elem.parentNode.parentNode.parentNode.parentNode;
		
		if(!UI.hasClass(taskEl, 'completed')) {
			
			var timeArea = elem.previousElementSibling.parentNode;
			
			UI.addClass(taskEl, 't-edit');
			
			UI.addClass(timeArea, 'edit-mode');
			UI.addClass(taskEl, 'selected');
		}
	},
	
	/**
	*	Opens the confirmation overlay,
	*	sets the Delete button's attr to the id of the task in question
	*
	*	@param html element elem
	*
	*	@return
	**/
	openOverlay(elem) {
		
		var taskEl = elem.parentNode.parentNode.parentNode;
		
		var taskId = taskEl.getAttribute('data-task-id');
		
		document.getElementsByClassName('btns')[0].children[0].setAttribute('data-task', taskId);
		
		document.getElementById('outerOverlay').style.display = 'block';
		document.getElementById('innerOverlay').style.display = 'block';
	},
	
	
	/**
	*	Closes the overlay, removes Delete button's attr with task id
	*
	*	@return
	**/
	closeOverlay() {
		
		document.getElementsByClassName('btns')[0].children[0].removeAttribute('data-task');
		
		document.getElementById('outerOverlay').style.display = 'none';
		document.getElementById('innerOverlay').style.display = 'none';
	},
	
	/**
	*	Checks to see if task is completed or pending
	*	and moves it to either completed or pending column
	*	by calling the appropriate TaskManager fn and then reloading both columns
	*
	*	@param html element elem
	*
	*	@return
	**/
	changeTaskStatus(elem) {
		
		var taskEl = elem.parentNode.parentNode.parentNode;
		var taskId = taskEl.getAttribute('data-task-id');
		
		//	If the task is currently a pending task, move it to completed
		if(!UI.hasClass(taskEl, 'completed')) {
			
			TaskManager.changeTaskCompletionStatus(taskId, 'completed');
			
		} else if(UI.hasClass(taskEl, 'completed')) {
			
			//	If the task is currently a completed task, move it to pending
			TaskManager.changeTaskCompletionStatus(taskId, 'pending');
		}
		
		TaskManager.loadTasks('pending');
		TaskManager.loadTasks('completed');
	},
	
	/**
	*	Loops through the passed in array of tasks
	*	and writes in the html elements for it, assigning appropriate classes
	*
	*	@param Array catArray, string catName
	*
	*	@return
	**/
	writeTaskCategory(catArray, catName) {
		
		var containerId	= catName + 'Tasks';
		var container = document.getElementById(containerId);
		
		//	Clear the column
		container.innerHTML	= '';
		
		if(catArray &&  catArray.length > 0) {
			
			catArray.map((item) => {
				
				//	Create the task html and insert at the top of the column
				var tpl	= document.getElementsByClassName('task-template')[0];
				var freshTask = tpl.cloneNode(true);
				
				var titleDisplay = freshTask.children[0].children[0];
				var titleInput = titleDisplay.nextElementSibling;
				
				var bodyDisplay = freshTask.children[1].children[0].children[0];
				var bodyInput = bodyDisplay.nextElementSibling;
				
				//	Give the new task the appropriate 'task-' class name
				if(catName != 'completed') {
					
					UI.addClass(freshTask, 'task-' + TaskManager.priorityValues[item.type]);
					
				} else {
					
					UI.addClass(freshTask, 'completed');
					UI.addClass(freshTask, 'task-green');
				}
				
				//	Populate the title span and input
				if(item.title) {
					titleDisplay.innerHTML = item.title;
					titleInput.value = item.title;
				}
				
				//	Populate the body span and input
				if(item.body) {
					bodyDisplay.innerHTML = item.body;
					bodyInput.value = item.body;
				}
				
				//	See if the task has a due time
				if(item.dueTime) {
					
					UI.addClass(freshTask, 'timed');
					
					//	Convert milliseconds into a string
					var dueTime = new Date(item.dueTime).toLocaleTimeString();
					
					var timeParts = dueTime.split(":");
					var hours = timeParts[0];
					var minutes = timeParts[1];
					var ampm = dueTime.split(' ')[1];
					
					//	Populate time display and time inputs
					var hoursDisplay = freshTask.children[1].children[1].children[3].children[1].children[0];
					var munitesDisplay = hoursDisplay.nextElementSibling;
					var ampmDisplay = munitesDisplay.nextElementSibling;
					
					var hoursInput = freshTask.children[1].children[1].children[3].children[0].children[0].children[1];
					var minutesInput = hoursInput.nextElementSibling;
					var ampmButton = minutesInput.nextElementSibling;
					
					hoursDisplay.innerHTML = hoursInput.value = hours;
					munitesDisplay.innerHTML = minutesInput.value = minutes;
					ampmDisplay.innerHTML = ampmButton.innerHTML = ampm;
				}
				
				UI.removeClass(freshTask, 'task-template');
				freshTask.setAttribute('data-task-id', 't_' + item.dateTimeCreated);
				
				container.insertBefore(freshTask, container.children[0]);				
			});
		}
	}, 
	
	/**
	*	On Android, on time input focus, scrolls it up out of the way of the mobile keyboard
	*
	*	@param html element elem
	*
	*	@return
	**/
	scrollOnTimeInputFocus(elem) {
		
		var timeArea = elem.parentNode.parentNode.parentNode;
		
		//	To allow for mobile keyboard, scroll the column when entering edit mode
		if(UI.isAndroid) {
			
			var coords = timeArea.getBoundingClientRect();
			
			if(coords.top > 120) {
				
				var diff = coords.top - 120;
				document.getElementsByClassName('column-one')[0].scrollTop += diff;
				
				//	Set flag till inblur event
				UI.scrolledDistance	= diff;
			}
		}
	}
};


window.onload = () => {

	//	Set flags for different mobile devices
	if(navigator.userAgent.toLowerCase().indexOf('android') !== -1) {
		
		UI.isAndroid = true;
	}
	
	//	iPhone
	if(navigator.userAgent.toLowerCase().indexOf('iphone') !== -1) {
	
		UI.addClass(document.getElementById('layoutContainer'), 'iphone');
		
	} else if(navigator.userAgent.toLowerCase().indexOf('ipad') !== -1) {
		
		//	iPad
		UI.addClass(document.getElementById('layoutContainer'), 'ipad');
	}
	
	//	Add event listeners
	UI.init();
	
	//	Load any existing tasks
	TaskManager.loadTasks('pending');
	TaskManager.loadTasks('completed');
	
	if(!TaskManager.pendingTasks) {
		TaskManager.pendingTasks = new Array();
	}
	
	if(!TaskManager.completedTasks) {
		TaskManager.completedTasks = new Array();
	}
}

