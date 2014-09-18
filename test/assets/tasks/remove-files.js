exports.tasks = {
    copy: {
        foo2: {
            expand: true,
            cwd: 'test/assets/',
            src: '**',
            dest: 'temp/',
            flatten: true,
            filter: 'isFile',
        }
    },
    concat: {
        foo2: {
            src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
            dest: 'dist/built.js',
        },
    }
};

exports.register = {
    'foo2': ['copy:foo2', 'concat:foo2']
};
