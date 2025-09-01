pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.48.0-jammy'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    tools {
        nodejs "NodeJS-24"
    }
    
    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS = '0'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', 
                    url: 'https://github.com/sauravthetester/playwright_demo_project.git'
            }
        }
        /*
        stage('Setup Node.js') {
            steps {
                script {
                    def nodeHome = tool name: 'NodeJS-18', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
            }
        }
        */
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        /*
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }
        */
        
        stage('Run Tests') {
            steps {
                sh 'npx playwright test --reporter=html'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
