pipeline {
    agent any   // Checkout happens on Jenkins host (host has git)

    tools {
        nodejs "NodeJS-24"
    }

    environment {
        NODE_VERSION = '24'
        PLAYWRIGHT_BROWSERS = '0'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Playwright in Docker') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.48.0-jammy'
                    args '-u root'   // Run as root to avoid permission issues
                }
            }
            stages {
                stage('Install Dependencies') {
                    steps {
                        sh 'npm ci'
                    }
                }

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
