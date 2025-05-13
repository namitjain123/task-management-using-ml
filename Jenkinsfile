pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'taskmanagement:latest'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    sh 'docker build -t ${DOCKER_IMAGE} .'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo 'Running Unit Tests...'
                    sh 'npm test'  // Run Jest or Mocha tests
                }
            }
        }

        

        // Add additional stages as needed (e.g., Security, Deploy)
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
