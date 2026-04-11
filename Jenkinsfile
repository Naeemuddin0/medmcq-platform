pipeline {
    agent any

    environment {
        // Ensuring Docker behaves correctly in Jenkins executing environment
        DOCKER_BUILDKIT = 1
        COMPOSE_DOCKER_CLI_BUILD = 1
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                // The 'scm' object implicitly uses the repository Jenkins pulled the Jenkinsfile from.
                checkout scm
            }
        }
        
        stage('Deploy Dev Environment') {
            steps {
                echo 'Deploying Dev Environment with Docker Compose...'
                // Ensure the environment file exists to prevent docker-compose failure
                sh 'touch .env.local'
                // Stop running instance and remove old containers
                sh 'docker-compose -f docker-compose-dev.yml down'
                // Re-launch development container in background decoupled from live Part I
                sh 'docker-compose -f docker-compose-dev.yml up -d'
            }
        }
    }

    post {
        always {
            echo 'Deployment Pipeline Execution Completed.'
        }
        success {
            echo 'Development System is successfully deployed and live on PORT 3001.'
        }
        failure {
            echo 'Deployment Pipeline Failed. Please check the logs.'
        }
    }
}
