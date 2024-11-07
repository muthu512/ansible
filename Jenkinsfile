pipeline {
    agent any

    environment {
        PROJECT_DIR = "C:\\Users\\Dell-Lap\\Documents\\login360ui"
        TOMCAT_DIR = "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\webapps"
        APP_NAME = "hello-world-app"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git credentialsId: 'muthu512', url: 'https://github.com/muthu512/ansible.git', branch: 'master'
            }
        }

        stage('Check Node and npm Versions') {
            steps {
                script {
                    bat 'node -v || exit 1'
                    bat 'npm -v || exit 1'
                }
            }
        }

        stage('Check Environment Variables') {
            steps {
                script {
                    bat 'echo %PATH%'
                }
            }
        }

        stage('Prepare Project') {
            steps {
                script {
                    dir(PROJECT_DIR) {
                        bat 'if exist "package.json" (echo package.json exists) else (echo package.json not found && exit 1)'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    dir(PROJECT_DIR) {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Optimized Build React App') {
            steps {
                script {
                    dir(PROJECT_DIR) {
                        try {
                            // Run the build command
                            bat 'npm run build || exit 1'
                            
                            // Check if the build directory exists and list its contents
                            bat "if exist build (echo Build directory exists) else (echo Build directory does not exist)"
                            bat "dir ${PROJECT_DIR}\\build"  // This will show the contents of the build directory
                        } catch (Exception e) {
                            echo "Build failed: ${e.message}"
                            currentBuild.result = 'FAILED'
                        }
                    }
                }
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                script {
                    bat "if not exist \"${PROJECT_DIR}\\build\" (echo Build directory does not exist && exit 1)"
                    bat "dir \"${PROJECT_DIR}\\build\""
                    bat "if not exist \"${PROJECT_DIR}\\build\\*\" (echo No files in build directory && exit 1)"
                    bat "if not exist \"${TOMCAT_DIR}\\${APP_NAME}\" mkdir \"${TOMCAT_DIR}\\${APP_NAME}\""
                    bat "xcopy /S /I /Y \"${PROJECT_DIR}\\build\\*\" \"${TOMCAT_DIR}\\${APP_NAME}\\\""
                    bat "dir \"${TOMCAT_DIR}\\${APP_NAME}\""
                }
            }
        }
    }

    post {
        always {
            echo 'This will always run after the pipeline finishes'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        unstable {
            echo 'Pipeline unstable!'
        }
    }
}
