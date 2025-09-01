pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/sauravthetester/playwright_demo_project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test --reporter=line,junit,html'
            }
        }

        stage('Archive Reports') {
            steps {
                // Archive JUnit test results for Jenkins Test Report
                junit 'playwright-report/results.xml'

                // Archive Playwright HTML report so it can be downloaded
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            }
        }
    }
}
