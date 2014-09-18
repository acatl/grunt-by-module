exports.tasks = {
    copy: {
        foo1: {
            expand: true,
            cwd: 'test/assets/',
            src: '**',
            dest: 'temp/',
            flatten: true,
            filter: 'isFile',
        }
    },
    concat: {
        foo1: {
            src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
            dest: 'dist/built.js',
        },
    }
};

exports.register = {
    'foo1': ['copy:foo1', 'concat:foo1']
};
