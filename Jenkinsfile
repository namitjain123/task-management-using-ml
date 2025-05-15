pipeline {
     agent {
        docker {
            image 'docker' // docker CLI image
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage('Build Frontend') {
            steps {
                script {
                    // Build the frontend Docker image
                    sh 'docker build -f task-manager-client/Dockerfile -t task-manager-frontend task-manager-client/'
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    // Build the backend Docker image
                    sh 'docker build -f task-manager-backend/Dockerfile -t task-manager-backend task-manager-backend/'
                }
            }
        }

        stage('Run Frontend') {
            steps {
                script {
                    // Run the frontend container
                    sh 'docker run -d -p 3000:3000 task-manager-frontend'
                }
            }
        }

        stage('Run Backend') {
            steps {
                script {
                    // Run the backend container
                    sh 'docker run -d -p 5000:5000 task-manager-backend'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up Docker containers'
            sh 'docker ps -q | xargs docker rm -f'  // Clean up all running containers after the pipeline
        }
    }
}
