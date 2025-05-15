pipeline {
     agent any
        
    

    stages {
        stage('Build Frontend') {
            steps {
                script {
                    // Build the frontend Docker image
                    bat 'docker build -f task-manager-client/Dockerfile -t task-manager-frontend task-manager-client/'
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    // Build the backend Docker image
                    bat 'docker build -f task-manager-backend/Dockerfile -t task-manager-backend task-manager-backend/'
                }
            }
        }

        stage('Run Frontend') {
            steps {
                script {
                    // Run the frontend container
                    bat 'docker run -d -p 3000:3000 task-manager-frontend'
                }
            }
        }

        stage('Run Backend') {
            steps {
                script {
                    // Run the backend container
                    bat 'docker run -d -p 5000:5000 task-manager-backend'
                }
            }
        }
    }
    
   post {
    always {
        echo 'Cleaning up Docker containers'
        bat '''
        for /f "tokens=*" %%i in ('docker ps -q') do docker rm -f %%i
        '''
    }
}
}
