node {
  checkout scm
    def nodeHome = tool name: 'Default', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"
		
  stage('Package') {
      sh 'npm install && gulp default'
  }

  stage('Create Docker Image') {
    docker.build("//add imagepath:${env.BUILD_NUMBER}")
    
  }

  stage ('Run Docker Application') {
    try {
      
      sh "docker run -e DB_URI=$DB //add imagepath:${env.BUILD_NUMBER}"

    } catch (error) {
    } finally {
      
    }
  }

  stage('build') {
    try {
        	docker.withRegistry('//add registry') {
        	docker.build("//add imagepath:${env.BUILD_NUMBER}").push()
      }
    } catch (error) {

    } finally {       
    }
  }
}
