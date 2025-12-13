export type DockerError = {
  tool: "docker";
  canonical_slug: string;
  title: string;
  aliases: string[];
  matchers: { regex: string[] };
  category: "image" | "container" | "network" | "volume" | "registry" | "daemon" | "build";
  summary: string;
  root_causes: {
    name: string;
    why: string;
    confidence: number;
    sources: { url: string; label: string }[];
  }[];
  fix_steps: {
    step: string;
    commands: string[];
    sources: { url: string; label: string }[];
  }[];
  clarifying_questions: string[];
  examples: {
    name: string;
    symptom: string;
    fix: string;
    sources: { url: string; label: string }[];
  }[];
  created_at: string;
  updated_at: string;
};

export const DOCKER_ERRORS: DockerError[] = [
  {
    tool: "docker",
    canonical_slug: "daemon-not-running",
    title: "Docker Daemon Not Running",
    aliases: ["daemon not running", "docker daemon", "cannot connect to docker daemon"],
    matchers: {
      regex: ["daemon.*not.*running", "docker.*daemon", "cannot.*connect.*to.*docker.*daemon"]
    },
    category: "daemon",
    summary: "Docker daemon is not running or not accessible.",
    root_causes: [
      {
        name: "Docker service not started",
        why: "Docker daemon service has not been started",
        confidence: 0.9,
        sources: [
          {"url": "https://docs.docker.com/config/daemon/", "label": "Docker Daemon"}
        ]
      },
      {
        name: "Permission issues",
        why: "User does not have permission to access Docker socket",
        confidence: 0.7,
        sources: [
          {"url": "https://docs.docker.com/engine/install/linux-postinstall/", "label": "Linux Post-install"}
        ]
      },
      {
        name: "Docker not installed",
        why: "Docker is not installed on the system",
        confidence: 0.5,
        sources: [
          {"url": "https://docs.docker.com/get-docker/", "label": "Install Docker"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Start Docker daemon",
        commands: ["sudo systemctl start docker", "sudo service docker start"],
        sources: [
          {"url": "https://docs.docker.com/config/daemon/", "label": "Docker Daemon"}
        ]
      },
      {
        step: "Add user to docker group",
        commands: ["sudo usermod -aG docker $USER", "newgrp docker"],
        sources: [
          {"url": "https://docs.docker.com/engine/install/linux-postinstall/", "label": "Linux Post-install"}
        ]
      },
      {
        step: "Check Docker status",
        commands: ["docker version", "docker info"],
        sources: [
          {"url": "https://docs.docker.com/reference/cli/docker_version/", "label": "Docker Version"}
        ]
      }
    ],
    clarifying_questions: ["What operating system are you using?", "Did Docker work before?"],
    examples: [
      {
        name: "Cannot connect to Docker daemon on Linux",
        symptom: "Cannot connect to the Docker daemon at unix:///var/run/docker.sock",
        fix: "Start the Docker service and add your user to the docker group",
        sources: [
          {"url": "https://docs.docker.com/engine/install/linux-postinstall/", "label": "Linux Post-install"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "docker",
    canonical_slug: "image-not-found",
    title: "Image Not Found",
    aliases: ["image not found", "pull access denied", "repository does not exist"],
    matchers: {
      regex: ["image.*not.*found", "pull.*access.*denied", "repository.*does.*not.*exist"]
    },
    category: "image",
    summary: "Docker image could not be found or accessed from the registry.",
    root_causes: [
      {
        name: "Incorrect image name",
        why: "Image name is misspelled or does not exist",
        confidence: 0.8,
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/pull/", "label": "Docker Pull"}
        ]
      },
      {
        name: "Private repository access",
        why: "Image is in a private repository without proper authentication",
        confidence: 0.7,
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/login/", "label": "Docker Login"}
        ]
      },
      {
        name: "Network connectivity issues",
        why: "Cannot reach the container registry",
        confidence: 0.6,
        sources: [
          {"url": "https://docs.docker.com/docker-hub/", "label": "Docker Hub"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Verify image name and tag",
        commands: ["docker search <image-name>", "docker pull <correct-image-name>"],
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/search/", "label": "Docker Search"}
        ]
      },
      {
        step: "Login to registry if private",
        commands: ["docker login", "docker login <registry-url>"],
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/login/", "label": "Docker Login"}
        ]
      },
      {
        step: "Check network connectivity",
        commands: ["curl -I https://registry-1.docker.io/v2/", "docker info"],
        sources: [
          {"url": "https://docs.docker.com/docker-hub/", "label": "Docker Hub"}
        ]
      }
    ],
    clarifying_questions: ["What image are you trying to pull?", "Is it a private repository?"],
    examples: [
      {
        name: "Pulling non-existent nginx version",
        symptom: "Error response from daemon: pull access denied for nginx:nonexistent",
        fix: "Use a valid nginx tag like nginx:latest or nginx:1.21",
        sources: [
          {"url": "https://hub.docker.com/_/nginx", "label": "Nginx on Docker Hub"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "docker",
    canonical_slug: "port-already-in-use",
    title: "Port Already in Use",
    aliases: ["port already in use", "address already in use", "bind failed"],
    matchers: {
      regex: ["port.*already.*in.*use", "address.*already.*in.*use", "bind.*failed"]
    },
    category: "network",
    summary: "Docker container cannot bind to the specified port because it's already in use.",
    root_causes: [
      {
        name: "Port occupied by another process",
        why: "Another application or container is using the same port",
        confidence: 0.8,
        sources: [
          {"url": "https://docs.docker.com/config/containers/container-networking/", "label": "Container Networking"}
        ]
      },
      {
        name: "Previous container not stopped",
        why: "Previous container using the same port was not properly stopped",
        confidence: 0.7,
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/stop/", "label": "Docker Stop"}
        ]
      },
      {
        name: "Host service using port",
        why: "Host system service is bound to the same port",
        confidence: 0.6,
        sources: [
          {"url": "https://docs.docker.com/config/containers/container-networking/", "label": "Container Networking"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check what's using the port",
        commands: ["netstat -tulpn | grep <port>", "lsof -i :<port>"],
        sources: [
          {"url": "https://docs.docker.com/config/containers/container-networking/", "label": "Container Networking"}
        ]
      },
      {
        step: "Stop conflicting containers",
        commands: ["docker ps", "docker stop <container-id>"],
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/stop/", "label": "Docker Stop"}
        ]
      },
      {
        step: "Use different port",
        commands: ["docker run -p <different-port>:80 <image>"],
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/run/", "label": "Docker Run"}
        ]
      }
    ],
    clarifying_questions: ["What port are you trying to use?", "Are there other containers running?"],
    examples: [
      {
        name: "Web server port 80 conflict",
        symptom: "Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use",
        fix: "Stop the conflicting service or use a different port like 8080",
        sources: [
          {"url": "https://docs.docker.com/config/containers/container-networking/", "label": "Container Networking"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Add more docker errors here following the same pattern
// Total target: 30 docker errors