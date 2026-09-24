pipeline {
    //^ Run this pipeline on a Jenkins agent with Docker installed.
    agent any

    //^ Start this job when GitHub sends a push webhook.
    triggers {
        githubPush()
    }

    environment {
        IMAGE_FRONTEND_NAME = 'dhvanitraval/synapse-frontend'
        IMAGE_BACKEND_NAME = 'dhvanitraval/synapse-backend'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
        GROQ_CREDENTIALS_ID = 'groq-api-key'
        FRONTEND_URL = 'http://16.16.98.231:8081,http://localhost:5173,http://localhost:8081,https://synapse-eight-weld.vercel.app'
        EMAIL = 'dhvanitraval.538@gmail.com'
    }

    stages {
        stage('Clone Repo') {
            steps {
                //^ Clone the repository and check out its main branch.
                git branch: 'main', url: 'https://github.com/Dhvanit-raval/Synapse.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                //^ Build the frontend and backend images from their respective directories.
                sh 'docker build -t $IMAGE_FRONTEND_NAME ./frontend'
                sh 'docker build -t $IMAGE_BACKEND_NAME ./backend'
            }
        }

        stage('Push Docker Images') {
            steps {
                //^ Log in with Jenkins credentials, push both images, then log out.
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKERHUB_CREDENTIALS_ID,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh '''
                        set +x
                        printf '%s' "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USER" --password-stdin
                        docker push "$IMAGE_FRONTEND_NAME"
                        docker push "$IMAGE_BACKEND_NAME"
                        docker logout
                    '''
                }
            }
        }

        stage('Run Application with Docker Compose') {
            steps {
                // Compose starts MongoDB and connects the frontend and backend on a shared network.
                withCredentials([string(credentialsId: env.GROQ_CREDENTIALS_ID, variable: 'GROQ_API_KEY')]) {
                    sh 'docker rm -f synapse-frontend synapse-backend || true; docker compose up -d --force-recreate'
                }
            }
        }

    } 
}
