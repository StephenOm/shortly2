module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options:{
        separator: ';'
      },
      dist: {
        src:['public/client/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      dest: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
//build(test, lint, concat, uglify)
//deploy(build, upload)
    eslint: {
      target: [
        // Add list of files to lint here
        'Gruntfile.js',
        'app/**/*.js',
        'public/**/*.js',
        'lib/**/*.js',
        './*.js',
        'spec/**/*.js'
      ]
    },

    cssmin: {
      target: {
        files: [{
          src: ['public/style.css'],
          dest: 'public/dist/style.min.css'
        }]
      }
    },

    clean: ['public/dist/*.js'],

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push live master',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest',
    'eslint'
  ]);


  grunt.registerTask('build', ['clean', 'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run('shell:prodServer');
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'test', 'build', 'upload'
  ]);


};
