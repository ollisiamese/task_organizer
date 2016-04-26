module.exports = function(grunt) {
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		
		 "babel": {
			options: {
			  sourceMap: true
			},
			dist: {
			  files: [{
				  expand: true,
				  cwd: 'src/js/babel_js',
				  src: '*.js',
				  dest: 'src/js/compiled_js',
				  ext: '.js'
				}]
			}
		  },
		
		sass: {
			dist: {                            // Target 
			  options: {                       // Target options 
				style: 'expanded'
			  },
			  files: [{
				expand: true,
				cwd: 'src/css/sass/',
				src: ['*.scss'],
				dest: 'src/css/compiled_css',
				ext: '.css'
			  }]
			}
		},
		
		concat: {
			//	Subtasks for js and css
			js: {		
				src: ['src/js/compiled_js/*.js'],
				dest: 'src/js/scripts.js',				
			}, 		
			css: {
				src: ['src/css/compiled_css/*.css'],
				dest: 'src/css/styles.css',
			}			
		},
		
		//	Minify JS
		uglify: {			
			js: {
			  src: 'src/js/scripts.js',
			  dest: 'build/js/scripts.min.js'
			}
		},
		
		//	Minify CSS
		cssmin: {
		  target: {
			files: [{
			  expand: true,
			  cwd: 'src/css',
			  src: 'styles.css',
			  dest: 'build/css/',
			  ext: '.min.css'
			}]
		  }
		},
		
		watch: {
			//	Watch for changes to js files in watch:js task
			//	and for changes to css files in watch:css task
			//	And perform the corresponding tasks
			//	Then livereload will reload the page
			js: {
				files: ['src/js/babel_js/*.js'],
				tasks: ['babel', 'concat:js', 'uglify'],
				options: {
				  livereload: 35729,
				}
			},
			css: {
				files: ['src/css/sass/*.scss'],
				tasks: ['sass', 'concat:css', 'cssmin'],
				options: {
				  livereload: 35729,
				}
			},		
		},
		
		connect: {
			server: {
				options: {
					port: 8000,
					base: 'build', //looks for the index.html in the /build dir
					//keepalive:true,
					//	Enable livereload, used by the 'watch' tasks
					livereload: 35729,
					//	On connect, open in browser
					open:true
				}
			}
		}		
	});
	
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	//	Register the default task
	grunt.registerTask('default', ['sass', 'babel', 'concat', 'uglify', 'cssmin', 'connect', 'watch']);
};