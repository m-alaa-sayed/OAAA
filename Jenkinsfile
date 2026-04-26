pipeline {
	agent { label 'oaaa_agent' }

    environment {
        FRONTEND_USERNAME = 'appadmin'
        FRONTEND_PATH = '/home/appadmin/oaaa'
        NVM_DIR = "$HOME/.nvm"
        NODE_VERSION = '18.19.1'
        FRONTEND_BUILD_PATH='/home/appadmin/agent/oaaa_build/workspace/Front-end/dist'
        OAAAA_FRONTEND_PATH= '/home/appadmin/oaaa/html/oaaaa-frontend'
        OAAAA_FRONTEND_DELETE_PATH = "${OAAAA_FRONTEND_PATH}/*"
    }

    stages {
        stage('Retrive frontend server ip') {
            steps {
                script {
                    def targetIpValue
                    withCredentials([
                        string(credentialsId: 'FRONTEND_SERVER_IP', variable: 'IP_VALUE')
                    ]) {
                        targetIpValue = IP_VALUE
                    }
                    env.FRONTEND_IP = targetIpValue
                }
            }
        }

		stage('Setup Node version & install app dependencies') {
			steps {
				script {
					sh '''
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use ${NODE_VERSION}
                    npm i --legacy-peer-deps
                    '''
                }
            }
        }

        stage('Build app') {
			steps {
				sh '''
                npx ng cache clean
                npm run build-prod
                '''
            }
        }

        stage('deploying of frontend servers') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'appadmin_secret', keyFileVariable: 'SSH_KEY_PATH')
                ]) {
                    sh '''#!/bin/bash
cat <<'EOF' | bash
    ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" "$FRONTEND_USERNAME@$FRONTEND_IP" "rm -rf $OAAAA_FRONTEND_DELETE_PATH"
EOF
                        scp -r -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$FRONTEND_BUILD_PATH"/* "$FRONTEND_USERNAME@$FRONTEND_IP:$OAAAA_FRONTEND_PATH/"
                    '''
                }
            }
        }

    }

    post {
		always {
			echo "🧹 Cleaning workspace..."
			cleanWs()
        }
        success {
			echo "✅ Deployment successful! Running on port 8083."
        }
        failure {
			echo "❌ Deployment failed!"
        }
    }
}
