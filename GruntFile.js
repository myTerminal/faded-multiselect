module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                files: [
                    {
                        src: ["src/scripts/faded-multiselect.js"],
                        dest: "build/scripts/faded-multiselect.min.js"
                    }
                ]
            }
        },
        less: {
            css: {
                files: [
                    {
                        src: ["src/styles/faded-multiselect.less"],
                        dest: "build/styles/faded-multiselect.css"
                    }
                ]
            }
        },
        watch: {
            js: {
                files: "src/scripts/**/*.js",
                tasks: ["uglify"]
            },
            css: {
                files: "src/styles/**/*.less",
                tasks: ["less"]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask("default", ["build"]);
    grunt.registerTask("build", ["uglify", "less"]);
    // grunt.registerTask("test", []); // TODO: Implement tests
    grunt.registerTask("develop", ["watch"]);
};
