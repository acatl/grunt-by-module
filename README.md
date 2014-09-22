# Grunt By Module: break down your grunt tasks into modules

### working example:

[https://github.com/acatl/grunt-by-module-example](https://github.com/acatl/grunt-by-module-example)

### Why a grunt wrapper?

Grunt files can get huge, out of proportions on big projects, this tool should let you break your `Gruntfile.js` into smaller modules. 

### Why not just use Gulp?

The Door is wide open, I like Gulp and I think depending on what you may want maybe Gulp is right for you.

So why use this? well, if you like grunt, and you already have your project using it, this wrapper 
(because thats all it is really) should help to make your tasks more organized and easier to maintain.

### Which benefits do I get from a common Gruntfile.js file?

Two main benefits: 

* **Plugin configuration**  is placed on a per file(module) basis, 
where you describe the name of the plugin, and its default options that you want. 
* **Tasks** may be broken down into separate files (modules), so you can have on each one only the tasks that correspond to certain task you want to do.

### Uh?

typical `Gruntfile.js` file: 

```js
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      backendScripts: {
        src: [
          'lib/**/*.js'
        ],
      }

      frontendScripts: {
        src: [
          'public/js/**/*.js'
        ],
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },

      frontendScripts: {
        files: {
          '.build/main.min.js': 'public/js/**/*.js'
        }
      },
    }

    watch: {
      frontendScripts: {
        files: [
          'public/js/**/*.js'
        ],
        tasks: ['jshint:frontendScripts', 'uglify:frontendScripts'],
        options: {
          spawn: false,
        },
      },

      backendScripts: {
        files: [
          'lib/**/*.js'
        ],
        tasks: ['jshint:backendScripts'],
        options: {
          spawn: false,
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // yeah watch shouldnt be here, this is just an example
  grunt.registerTask('default', ['jshint', 'uglify', 'watch']);
};
``` 

**Grunt By Module** structure:

```
./
  Gruntfile.js
  grunt/
    plugins/
       jshint.js
       ugilfy.js
       watch.js
    tasks/
       backend-scripts.js
       frontend-scripts.js
       default.js
```


`Gruntfile.js`

```js
var GruntByModule = require('grunt-by-module');


module.exports = function(grunt) {
  GruntByModule.config(grunt, {
    pluginsPath: 'grunt/plugins',
    tasksPath: 'grunt/tasks'
  });
};
```

### The Plugins

`grunt/plugins/jshint.js` file:

```js
module.exports = {
  task: 'grunt-contrib-jshint',
  options: {
    jshintrc: '.jshintrc'
  }
};
```

`grunt/plugins/uglify.js` file:

```js
module.exports = {
  task: 'grunt-contrib-uglify',
  options: {
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */'
  },
};
```

`grunt/plugins/watch.js` file:

```js
module.exports = {
  task: 'grunt-contrib-watch',
  options: {
    spawn: false,
  }
};
```

## The Tasks

`grunt/tasks/backend-scripts.js` file:

```js
exports.tasks = {
  jshint: {
    backendScripts: {
      src: [
        'lib/**/*.js'
      ],
    }
  },

  watch: {
    backendScripts: {
      files: [
        'lib/**/*.js'
      ],
      tasks: ['jshint:backendScripts'],
      options: {
        spawn: false,
      },
    },
  }
};

exports.register = {
  'backendScripts': ['jshint:backendScripts']
};
```

`grunt/tasks/frontend-scripts.js` file:

```js
exports.tasks = {
  jshint: {
    frontendScripts: {
      src: [
        'public/js/**/*.js'
      ],
    }
  },

  uglify: {
    frontendScripts: {
      files: {
        '.build/main.min.js': 'public/js/**/*.js'
      }
    },

  },

  watch: {
    frontendScripts: {
      files: [
        'public/js/**/*.js'
      ],
      tasks: ['jshint:frontendScripts', 'uglify:frontendScripts'],
      options: {
        spawn: false,
      },
    },
  },
};

exports.register = {
  'frontendScripts': [
    'jshint:frontendScripts',
    'uglify:frontendScripts'
  ]
};
```

`grunt/tasks/default.js` file:

```js
exports.register = {
  'default': ['backendScripts', 'frontendScripts', 'watch']
};
```


## Contributing

Bugs and new features should be submitted using [Github issues](https://github.com/acatl/grunt-by-module/issues/new). Please include with a detailed description and the expected behaviour. If you would like to submit a change yourself do the following steps.

1. Fork it.
2. Create a branch (`git checkout -b fix-for-that-thing`)
3. Commit a failing test (`git commit -am "adds a failing test to demonstrate that thing"`)
3. Commit a fix that makes the test pass (`git commit -am "fixes that thing"`)
4. Push to the branch (`git push origin fix-for-that-thing`)
5. Open a [Pull Request](https://github.com/acatl/grunt-by-module/pulls)

Please keep your branch up to date by rebasing upstream changes from master.

