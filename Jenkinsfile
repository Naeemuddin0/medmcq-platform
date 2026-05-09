pipeline {
    agent any

    environment {
        // Ensuring Docker behaves correctly in Jenkins executing environment
        DOCKER_BUILDKIT = 0
        COMPOSE_DOCKER_CLI_BUILD = 0
        // Internal URL for the dev container within the Docker network
        APP_URL = "http://medmcq-web-dev:3000"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Deploy Dev Environment') {
            steps {
                echo 'Deploying Dev Environment with Docker Compose...'
                sh 'touch .env.local'
                sh 'docker-compose -f docker-compose-dev.yml down'
                sh 'docker-compose -f docker-compose-dev.yml up -d --build'
                echo 'Waiting for application to stabilize...'
                sh 'sleep 20'
            }
        }

        stage('Test') {
            steps {
                echo 'Building Test Container...'
                sh 'docker build -t medmcq-tests ./tests'
                
                echo 'Executing 15 Selenium Test Cases...'
                // Run tests and manually copy results out to avoid volume mounting issues in DinD
                sh 'docker run --name test-container --shm-size=2g --network medmcq-dev-deployment_default -e BASE_URL=${APP_URL} medmcq-tests pytest test_medmcq.py --junitxml=results.xml || true'
                sh 'docker cp test-container:/app/results.xml tests/results.xml'
                sh 'docker rm test-container'
            }
            post {
                always {
                    echo 'Publishing Test Results...'
                    junit 'tests/results.xml'
                }
            }
        }
    }

    post {
        always {
            echo 'Deployment Pipeline Execution Completed.'
            script {
                // Determine build status for email
                def buildStatus = currentBuild.currentResult ?: 'UNKNOWN'
                
                // Send email with results to the collaborator/instructor
                try {
                    emailext (
                        subject: "MedMCQ Build ${env.BUILD_NUMBER} - Status: ${buildStatus}",
                        body: """
                            <h2>Build ${env.BUILD_NUMBER} Result: ${buildStatus}</h2>
                            <p>The automated test suite has finished executing.</p>
                            <p><strong>Console Output:</strong> <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>
                            <p><strong>Test Results:</strong> Attached to this email.</p>
                            <br/>
                            <p>Sent by MedMCQ DevOps Pipeline</p>
                        """,
                        to: 'qasimalik@gmail.com, uddinn874@gmail.com',
                        attachmentsPattern: 'tests/results.xml',
                        mimeType: 'text/html'
                    )
                } catch (Exception e) {
                    echo "Warning: Could not send email notification. Check SMTP settings. Error: ${e.message}"
                }
            }
        }
        success {
            echo 'Development System is successfully deployed, tested, and live on PORT 3001.'
        }
        failure {
            echo 'Deployment Pipeline Failed. Please check the logs.'
        }
    }
}