//	Class Task

class Task {
	
	constructor(type) {
		
		this.type = type;
		
		//	Field that corresponds to t_+id data-attribute of the task html elements
		this.dateTimeCreated = new Date().getTime();
		
		//	The rest of the possible fields
		this.title = '';
		this.body = '';
		this.dueTime = '';		
	}	
}