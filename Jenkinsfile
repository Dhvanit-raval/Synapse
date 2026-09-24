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
        EMAIL = 'dhvanitraval.538@gmail.com'
        FRONTEND_HOST_PORT = '5000'
        FRONTEND_CONTAINER_PORT = '5000'
        BACKEND_HOST_PORT = '5001'
        BACKEND_CONTAINER_PORT = '5001'
    }

    stages {
        stage('Clone Repo') {
            steps {
                //^ Clone the repository and check out its main branch.
                git branch: 'main', url: 'https://^github.com/Dhvanit-raval/Synapse.git'
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

        stage('Stop and Remove Existing Containers') {
            steps {
                //^ Stop and remove old containers; tolerate containers that do not exist yet.
                sh 'docker stop synapse-frontend || true'
                sh 'docker rm synapse-frontend || true'
                sh 'docker stop synapse-backend || true'
                sh 'docker rm synapse-backend || true'
            }
        }

        stage('Run Docker Containers') {
            steps {
                //^ Start both containers on the Jenkins host using their configured ports.
                sh 'docker run -d --restart unless-stopped -p $FRONTEND_HOST_PORT:$FRONTEND_CONTAINER_PORT --name synapse-frontend $IMAGE_FRONTEND_NAME'
                sh 'docker run -d --restart unless-stopped -p $BACKEND_HOST_PORT:$BACKEND_CONTAINER_PORT --name synapse-backend $IMAGE_BACKEND_NAME'
            }
        }

        stage('Send Email Notification') {
            steps {
                //^ Send a notification after all earlier stages succeed.
                mail to: env.EMAIL,
                     subject: 'Deployment Successful: Synapse Application',
                     body: "The Synapse application is running. Frontend port: ${env.FRONTEND_HOST_PORT}; backend port: ${env.BACKEND_HOST_PORT}."
            }
        }
    }
}
