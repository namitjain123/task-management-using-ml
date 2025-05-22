pipeline {
    agent any

    stages {
        stage('Build Frontend') {
            steps {
                bat 'docker build -f task-manager-client/Dockerfile -t task-manager-frontend task-manager-client/'
            }
        }

        stage('Build Backend') {
            steps {
                bat 'docker build -f task-manager-backend/Dockerfile -t task-manager-backend task-manager-backend/'
            }
        }

        stage('Test Backend') {
            steps {
                bat 'docker run --rm task-manager-backend sh -c "npm test"'
            }
        }

        stage('Test Frontend') {
            steps {
                bat 'docker run --rm task-manager-frontend sh -c "npm test"'
            }
        }

        stage('SonarQube Backend') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    dir('task-manager-backend') {
                        bat """
                            docker run --rm -e SONAR_TOKEN=%SONAR_TOKEN% -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli
                        """
                    }
                }
            }
        }

        stage('SonarQube Frontend') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    dir('task-manager-client') {
                        bat """
                            docker run --rm -e SONAR_TOKEN=%SONAR_TOKEN% -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli
                        """
                    }
                }
            }
        }

        stage('Run Backend') {
            steps {
                bat 'docker run -d -p 5000:5000 task-manager-backend'
            }
        }

        stage('Run Frontend') {
            steps {
                bat 'docker run -d -p 3000:3000 task-manager-frontend'
            }
        }
    }

    post {
  always {
    echo 'Cleaning up Docker containers'
    bat '''
      for /f "tokens=*" %%i in ('docker ps -q') do (
        docker rm -f %%i
      )
    '''
  }
}

}
