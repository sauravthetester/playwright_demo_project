pipeline {
    agent any

    tools {
        nodejs "NodeJS-24"
    }

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS = '0'
    }

    stages {

        stage('Debug Workspace') {
            steps {
                sh '''
                  pwd
                  ls -la
                  git rev-parse --is-inside-work-tree || echo "Not a git repo yet"
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/sauravthetester/playwright_demo_project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test --project=element-tests-chrome'
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
    }
}
