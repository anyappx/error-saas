type K8Error = {
  tool: "kubernetes";
  canonical_slug: string;
  title: string;
  aliases: string[];
  matchers: { regex: string[] };
  category: "auth" | "network" | "runtime" | "config" | "storage" | "scheduler" | "cluster";
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

export const K8S_ERRORS: K8Error[] = [
  {
    tool: "kubernetes",
    canonical_slug: "certificateexpired",
    title: "Certificate Expired",
    aliases: ["certificateexpired", "certificate expired", "cert expired", "tls certificate expired"],
    matchers: {
      regex: ["certificateexpired", "certificate.*expired", "cert.*expired", "tls.*certificate.*expired"]
    },
    category: "auth",
    summary: "TLS certificate has expired and needs renewal.",
    root_causes: [
      {
        name: "Certificate reached expiration date",
        why: "TLS certificate has passed its expiration date",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      },
      {
        name: "Certificate not renewed automatically",
        why: "Automatic certificate renewal failed or is not configured",
        confidence: 0.7,
        sources: [
          {"url": "https://cert-manager.io/", "label": "cert-manager"}
        ]
      },
      {
        name: "Certificate authority issues",
        why: "Certificate authority that signed the cert is no longer trusted",
        confidence: 0.5,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check certificate expiration",
        commands: ["kubectl get secrets -o yaml  < /dev/null |  grep -A 5 tls", "openssl x509 -in cert.pem -text -noout | grep 'Not After'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      },
      {
        step: "Renew or replace certificate",
        commands: ["kubectl delete secret <tls-secret>", "kubectl create secret tls <tls-secret> --cert=new-cert.pem --key=new-key.pem"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      },
      {
        step: "Configure automatic renewal",
        commands: ["kubectl apply -f cert-manager-issuer.yaml"],
        sources: [
          {"url": "https://cert-manager.io/", "label": "cert-manager"}
        ]
      }
    ],
    clarifying_questions: ["Which certificate is expired?", "Are you using cert-manager for automatic renewal?"],
    examples: [
      {
        name: "Ingress TLS handshake failing",
        symptom: "HTTPS connections fail with certificate expired error",
        fix: "Update TLS secret with new valid certificate",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/ingress/", "label": "Ingress"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "clusterautoscalerfailed",
    title: "Cluster Autoscaler Failed",
    aliases: ["clusterautoscalerfailed", "cluster autoscaler failed", "autoscaler failed", "scaling failed"],
    matchers: {
      regex: ["clusterautoscalerfailed", "cluster.*autoscaler.*failed", "autoscaler.*failed", "scaling.*failed"]
    },
    category: "cluster",
    summary: "Cluster autoscaler failed to scale nodes up or down.",
    root_causes: [
      {
        name: "Insufficient cloud resources",
        why: "Cloud provider cannot provision new instances",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/", "label": "Cluster Autoscaling"}
        ]
      },
      {
        name: "IAM permissions missing",
        why: "Autoscaler lacks permissions to create/delete instances",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/", "label": "Cluster Autoscaling"}
        ]
      },
      {
        name: "Node group configuration issues",
        why: "Node group settings prevent scaling",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/", "label": "Cluster Autoscaling"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check autoscaler logs",
        commands: ["kubectl logs -n kube-system deployment/cluster-autoscaler"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/", "label": "Cluster Autoscaling"}
        ]
      },
      {
        step: "Verify cloud provider quotas",
        commands: ["aws ec2 describe-account-attributes", "gcloud compute project-info describe"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/", "label": "Cluster Autoscaling"}
        ]
      },
      {
        step: "Review IAM permissions",
        commands: ["kubectl describe configmap cluster-autoscaler-status -n kube-system"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/", "label": "Cluster Autoscaling"}
        ]
      }
    ],
    clarifying_questions: ["What cloud provider are you using?", "Are there any specific error messages in autoscaler logs?"],
    examples: [
      {
        name: "Pending pods not triggering scale up",
        symptom: "Pods remain pending despite autoscaler being enabled",
        fix: "Check autoscaler configuration and cloud provider limits",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/", "label": "Cluster Autoscaling"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "connection-refused",
    title: "Connection Refused",
    aliases: ["connection refused", "connect: connection refused", "cannot connect", "connection denied"],
    matchers: {
      regex: ["connection.*refused", "connect.*connection.*refused", "cannot.*connect"]
    },
    category: "network",
    summary: "Network connection was actively refused by the target host, indicating the service is not running or not accessible.",
    root_causes: [
      {
        name: "Service not running",
        why: "Target service is not running or not listening on expected port",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Service"}
        ]
      },
      {
        name: "Network policy blocking connection",
        why: "Network policies or firewall rules blocking the connection",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/network-policies/", "label": "Network Policies"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check service status",
        commands: ["kubectl get svc", "kubectl describe svc <service-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/", "label": "Debug Services"}
        ]
      },
      {
        step: "Verify pod status and endpoints",
        commands: ["kubectl get endpoints <service-name>", "kubectl get pods"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/", "label": "Debugging Services"}
        ]
      },
      {
        step: "Check network policies",
        commands: ["kubectl get networkpolicy", "kubectl describe networkpolicy"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/network-policies/", "label": "Network Policy Guide"}
        ]
      }
    ],
    clarifying_questions: ["What service are you trying to connect to?", "Is this internal pod-to-pod communication?"],
    examples: [
      {
        name: "Application not listening on correct port",
        symptom: "Connection refused when accessing service endpoint",
        fix: "Update service port to match application listening port",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Service Port Configuration"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "container-creating",
    title: "ContainerCreating",
    aliases: ["containercreating", "container creating", "stuck creating", "creating container"],
    matchers: {
      regex: ["containercreating", "container.*creating", "stuck.*creating"]
    },
    category: "runtime",
    summary: "Pod is stuck in ContainerCreating state, unable to start containers due to image pull issues or volume mount problems.",
    root_causes: [
      {
        name: "Image pull issues",
        why: "Container runtime cannot pull the required image",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/", "label": "Images"}
        ]
      },
      {
        name: "Volume mount problems",
        why: "Volumes cannot be mounted before container starts",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check pod events for detailed error",
        commands: ["kubectl describe pod <pod-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Pods and ReplicationControllers"}
        ]
      },
      {
        step: "Verify image availability",
        commands: ["kubectl get pod <pod-name> -o yaml | grep image"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/", "label": "Images Guide"}
        ]
      },
      {
        step: "Check volume and mount status",
        commands: ["kubectl get pvc", "kubectl describe pvc"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      }
    ],
    clarifying_questions: ["How long has the pod been in ContainerCreating state?", "Are there volume mounts configured?"],
    examples: [
      {
        name: "Pod waiting for PVC",
        symptom: "ContainerCreating for minutes with PVC in Pending state",
        fix: "Check storage class and ensure PVC gets bound",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/", "label": "Dynamic Volume Provisioning"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "containercreating",
    title: "Container Creating",
    aliases: ["containercreating", "container creating", "pod creating", "creating container"],
    matchers: {
      regex: ["containercreating", "container.*creating", "pod.*creating", "creating.*container"]
    },
    category: "runtime",
    summary: "Pod is stuck in ContainerCreating state and cannot start.",
    root_causes: [
      {
        name: "Image pull issues",
        why: "Container image cannot be pulled from registry",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/", "label": "Images"}
        ]
      },
      {
        name: "Volume mount problems",
        why: "Volume cannot be attached or mounted to pod",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      },
      {
        name: "Resource constraints",
        why: "Insufficient resources available on node",
        confidence: 0.5,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check pod events and status",
        commands: ["kubectl describe pod <pod-name>", "kubectl get events --sort-by='.lastTimestamp'"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/", "label": "Debug Running Pod"}
        ]
      },
      {
        step: "Verify image availability",
        commands: ["kubectl get pods -o yaml  < /dev/null |  grep image", "docker pull <image-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/", "label": "Images"}
        ]
      },
      {
        step: "Check volume and storage status",
        commands: ["kubectl get pvc", "kubectl describe pvc <pvc-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      }
    ],
    clarifying_questions: ["How long has the pod been in ContainerCreating state?", "Are there any specific error messages in the events?"],
    examples: [
      {
        name: "Pod stuck due to image pull failure",
        symptom: "Pod shows ContainerCreating with ErrImagePull events",
        fix: "Check image name and registry accessibility",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/", "label": "Images"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "context-deadline-exceeded",
    title: "Context Deadline Exceeded",
    aliases: ["context deadline exceeded", "deadline exceeded", "request timeout", "context timeout"],
    matchers: {
      regex: ["context.*deadline.*exceeded", "deadline.*exceeded", "context.*timeout"]
    },
    category: "network",
    summary: "Operation timed out because it exceeded the configured deadline, often due to API server overload or network latency.",
    root_causes: [
      {
        name: "API server overload",
        why: "Kubernetes API server is overwhelmed and cannot respond within timeout",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/system-logs/", "label": "System Logs"}
        ]
      },
      {
        name: "Network latency",
        why: "High network latency prevents operation completion within deadline",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Networking Concepts"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check API server status",
        commands: ["kubectl get componentstatus", "kubectl cluster-info"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debug Cluster"}
        ]
      },
      {
        step: "Increase timeout values",
        commands: ["kubectl config set-context --current --timeout=60s"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/kubectl/overview/", "label": "kubectl Overview"}
        ]
      },
      {
        step: "Check network connectivity",
        commands: ["ping <api-server>", "kubectl get endpoints kubernetes"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Network Debugging"}
        ]
      }
    ],
    clarifying_questions: ["Is this affecting all kubectl operations?", "When did timeouts start occurring?"],
    examples: [
      {
        name: "Large cluster with slow API responses",
        symptom: "kubectl get pods times out with context deadline exceeded",
        fix: "Increase kubectl timeout and check API server resource usage",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/system-logs/", "label": "API Server Monitoring"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "contextswitchfailed",
    title: "Context Switch Failed",
    aliases: ["contextswitchfailed", "context switch failed", "kubectl context failed", "kubeconfig error"],
    matchers: {
      regex: ["contextswitchfailed", "context.*switch.*failed", "kubectl.*context.*failed", "kubeconfig.*error"]
    },
    category: "config",
    summary: "Failed to switch kubectl context to target cluster.",
    root_causes: [
      {
        name: "Invalid kubeconfig",
        why: "Kubeconfig file is corrupted or invalid",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      },
      {
        name: "Missing context",
        why: "Specified context does not exist in kubeconfig",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      },
      {
        name: "Authentication issues",
        why: "Credentials are invalid or expired",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/", "label": "Authentication"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "List available contexts",
        commands: ["kubectl config get-contexts", "kubectl config current-context"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      },
      {
        step: "Validate kubeconfig file",
        commands: ["kubectl config view", "kubectl cluster-info"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      },
      {
        step: "Set correct context",
        commands: ["kubectl config use-context <context-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      }
    ],
    clarifying_questions: ["What context are you trying to switch to?", "Are you getting any specific error messages?"],
    examples: [
      {
        name: "kubectl commands failing after context switch",
        symptom: "kubectl returns authentication or connection errors",
        fix: "Verify context configuration and credentials",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "corednsfailed",
    title: "CoreDNS Failed",
    aliases: ["corednsfailed", "coredns failed", "dns failed", "dns resolution failed"],
    matchers: {
      regex: ["corednsfailed", "coredns.*failed", "dns.*failed", "dns.*resolution.*failed"]
    },
    category: "network",
    summary: "CoreDNS service is failing and DNS resolution is broken.",
    root_causes: [
      {
        name: "CoreDNS pods not running",
        why: "CoreDNS pods are crashed or not scheduled",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "label": "DNS for Services and Pods"}
        ]
      },
      {
        name: "DNS configuration errors",
        why: "CoreDNS configuration is invalid or corrupted",
        confidence: 0.7,
        sources: [
          {"url": "https://coredns.io/manual/toc/", "label": "CoreDNS Manual"}
        ]
      },
      {
        name: "Network connectivity issues",
        why: "CoreDNS cannot reach upstream DNS servers",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "label": "DNS for Services and Pods"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check CoreDNS pod status",
        commands: ["kubectl get pods -n kube-system  < /dev/null |  grep coredns", "kubectl describe pods -n kube-system -l k8s-app=kube-dns"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "label": "DNS for Services and Pods"}
        ]
      },
      {
        step: "Review CoreDNS logs",
        commands: ["kubectl logs -n kube-system -l k8s-app=kube-dns"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "label": "DNS for Services and Pods"}
        ]
      },
      {
        step: "Test DNS resolution",
        commands: ["kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup kubernetes.default"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/", "label": "Debug Services"}
        ]
      }
    ],
    clarifying_questions: ["Are CoreDNS pods running?", "What DNS queries are failing?"],
    examples: [
      {
        name: "Pods cannot resolve service names",
        symptom: "Applications fail with DNS resolution errors",
        fix: "Restart CoreDNS pods and check configuration",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "label": "DNS for Services and Pods"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "cputhrottling",
    title: "CPU Throttling",
    aliases: ["cputhrottling", "cpu throttling", "cpu limit exceeded", "cpu throttled"],
    matchers: {
      regex: ["cputhrottling", "cpu.*throttling", "cpu.*limit.*exceeded", "cpu.*throttled"]
    },
    category: "runtime",
    summary: "Container CPU usage is being throttled due to resource limits.",
    root_causes: [
      {
        name: "CPU limit too restrictive",
        why: "Container CPU limit is lower than application needs",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      },
      {
        name: "CPU-intensive workload",
        why: "Application is performing CPU-heavy operations",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      },
      {
        name: "Node CPU pressure",
        why: "Node is experiencing high CPU utilization overall",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Pressure Eviction"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Monitor CPU usage",
        commands: ["kubectl top pod <pod-name> --containers", "kubectl describe pod <pod-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/", "label": "Resource Usage Monitoring"}
        ]
      },
      {
        step: "Review CPU limits and requests",
        commands: ["kubectl get pod <pod-name> -o yaml  < /dev/null |  grep -A 5 resources"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      },
      {
        step: "Adjust CPU limits if needed",
        commands: ["kubectl patch deployment <deployment-name> -p '{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"<container-name>\",\"resources\":{\"limits\":{\"cpu\":\"1000m\"}}}]}}}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    clarifying_questions: ["What is the current CPU limit for the container?", "Is the application performance noticeably affected?"],
    examples: [
      {
        name: "Application running slowly due to throttling",
        symptom: "Application response times are degraded",
        fix: "Increase CPU limits or optimize application performance",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "crashloopbackoff",
    title: "CrashLoopBackOff",
    aliases: ["crashloopbackoff", "crash loop", "container crashing", "backoff restart"],
    matchers: {
      regex: ["crashloopbackoff", "crash.*loop", "backoff.*restart"]
    },
    category: "runtime",
    summary: "Container keeps crashing and Kubernetes is backing off restart attempts with increasing delays.",
    root_causes: [
      {
        name: "Application startup failure",
        why: "Container process exits immediately due to configuration errors",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy", "label": "Pod Lifecycle"}
        ]
      },
      {
        name: "Resource constraints",
        why: "Container hitting memory limits or other resource constraints",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Managing Resources for Containers"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check container logs",
        commands: ["kubectl logs <pod-name>", "kubectl logs <pod-name> --previous"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Pods and ReplicationControllers"}
        ]
      },
      {
        step: "Check pod events and description",
        commands: ["kubectl describe pod <pod-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Applications"}
        ]
      },
      {
        step: "Check resource limits and usage",
        commands: ["kubectl top pod <pod-name> --containers"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Limits"}
        ]
      }
    ],
    clarifying_questions: ["What does the container exit code show?", "Are you seeing OOMKilled events?"],
    examples: [
      {
        name: "Node.js app with missing environment variable",
        symptom: "CrashLoopBackOff with exit code 1 in logs",
        fix: "Add missing environment variable to deployment spec",
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/", "label": "Define Environment Variables for Container"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "createcontainerconfigerror",
    title: "CreateContainerConfigError",
    aliases: ["createcontainerconfigerror", "container config error", "config error"],
    matchers: {
      regex: ["createcontainerconfigerror", "container.*config.*error"]
    },
    category: "config",
    summary: "Kubernetes cannot create the container due to configuration issues, typically missing ConfigMaps, Secrets, or volumes.",
    root_causes: [
      {
        name: "Missing ConfigMap",
        why: "Pod references a ConfigMap that doesn't exist",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/configmap/", "label": "ConfigMap Documentation"}
        ]
      },
      {
        name: "Missing Secret",
        why: "Pod references a Secret that doesn't exist or is in wrong namespace",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secret Documentation"}
        ]
      },
      {
        name: "Invalid volume configuration",
        why: "Referenced volume source is misconfigured or doesn't exist",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volume Documentation"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check pod events for specific error",
        commands: ["kubectl describe pod <pod-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Applications"}
        ]
      },
      {
        step: "Verify ConfigMaps exist",
        commands: ["kubectl get configmaps", "kubectl describe configmap <configmap-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/configmap/", "label": "ConfigMap Guide"}
        ]
      },
      {
        step: "Verify Secrets exist",
        commands: ["kubectl get secrets", "kubectl describe secret <secret-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secret Guide"}
        ]
      },
      {
        step: "Check volume mounts and sources",
        commands: ["kubectl get pod <pod-name> -o yaml"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volume Documentation"}
        ]
      }
    ],
    clarifying_questions: ["What ConfigMaps or Secrets is the pod trying to use?", "Are there any volume mount errors?"],
    examples: [
      {
        name: "Missing database secret",
        symptom: "CreateContainerConfigError when pod references non-existent db-secret",
        fix: "Create the missing secret with proper database credentials",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "deadlockdetected",
    title: "Deadlock Detected",
    aliases: ["deadlockdetected", "deadlock detected", "resource deadlock", "scheduling deadlock"],
    matchers: {
      regex: ["deadlockdetected", "deadlock.*detected", "resource.*deadlock", "scheduling.*deadlock"]
    },
    category: "runtime",
    summary: "Resource deadlock detected in cluster scheduling decisions.",
    root_causes: [
      {
        name: "Resource constraints causing circular dependency",
        why: "Pods are waiting for resources that depend on each other",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "label": "kube-scheduler"}
        ]
      },
      {
        name: "Anti-affinity rules preventing scheduling",
        why: "Pod anti-affinity rules create impossible scheduling constraints",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Assign Pods to Nodes"}
        ]
      },
      {
        name: "Priority class conflicts",
        why: "High priority pods are preventing lower priority pods from scheduling",
        confidence: 0.5,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/", "label": "Pod Priority and Preemption"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Analyze pending pods",
        commands: ["kubectl get pods --all-namespaces  < /dev/null |  grep Pending", "kubectl describe pods <pending-pod>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "label": "kube-scheduler"}
        ]
      },
      {
        step: "Review scheduler events",
        commands: ["kubectl get events --sort-by='.lastTimestamp' | grep FailedScheduling"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "label": "kube-scheduler"}
        ]
      },
      {
        step: "Check affinity and anti-affinity rules",
        commands: ["kubectl get pods -o yaml | grep -A 10 affinity"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Assign Pods to Nodes"}
        ]
      }
    ],
    clarifying_questions: ["Which pods are stuck in pending state?", "Are you using pod affinity or anti-affinity rules?"],
    examples: [
      {
        name: "Pods with anti-affinity cannot be scheduled",
        symptom: "Multiple pods remain pending due to anti-affinity constraints",
        fix: "Relax anti-affinity rules or add more nodes",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Assign Pods to Nodes"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "diskpressure",
    title: "DiskPressure",
    aliases: ["diskpressure", "disk pressure", "low disk space"],
    matchers: {
      regex: ["diskpressure", "disk.*pressure", "low.*disk.*space"]
    },
    category: "runtime",
    summary: "Node is experiencing disk pressure due to low available disk space, which may prevent new pods from being scheduled.",
    root_causes: [
      {
        name: "Low disk space",
        why: "Available disk space has fallen below the eviction threshold",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Pressure Eviction"}
        ]
      },
      {
        name: "Container logs consuming space",
        why: "Container logs are taking up excessive disk space",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/logging/", "label": "Logging Architecture"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check disk usage",
        commands: ["kubectl describe node <node-name>", "df -h"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Conditions"}
        ]
      },
      {
        step: "Clean up container logs",
        commands: ["docker system prune", "journalctl --vacuum-time=2d"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/logging/", "label": "Log Management"}
        ]
      },
      {
        step: "Remove unused images",
        commands: ["docker image prune -a", "kubectl get nodes -o wide"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/nodes/", "label": "Node Management"}
        ]
      }
    ],
    clarifying_questions: ["How much disk space is available?", "Are there large log files consuming space?"],
    examples: [
      {
        name: "Node with 95% disk usage",
        symptom: "DiskPressure condition with pods being evicted",
        fix: "Clean up logs and unused Docker images",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Disk Pressure"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "etcdfull",
    title: "Etcd Full",
    aliases: ["etcdfull", "etcd full", "etcd storage full", "etcd disk full"],
    matchers: {
      regex: ["etcdfull", "etcd.*full", "etcd.*storage.*full", "etcd.*disk.*full"]
    },
    category: "cluster",
    summary: "etcd cluster storage is full and cannot accept new data.",
    root_causes: [
      {
        name: "etcd database size limit reached",
        why: "etcd database has grown beyond configured size limit",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/", "label": "Configure etcd"}
        ]
      },
      {
        name: "High number of watch events",
        why: "Excessive watch events are consuming etcd storage",
        confidence: 0.7,
        sources: [
          {"url": "https://etcd.io/docs/", "label": "etcd Documentation"}
        ]
      },
      {
        name: "Lack of compaction",
        why: "etcd history is not being compacted regularly",
        confidence: 0.6,
        sources: [
          {"url": "https://etcd.io/docs/", "label": "etcd Documentation"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check etcd storage metrics",
        commands: ["kubectl logs -n kube-system etcd-<master-node>", "etcdctl endpoint status --write-out=table"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/", "label": "Configure etcd"}
        ]
      },
      {
        step: "Compact etcd database",
        commands: ["etcdctl compact <revision>", "etcdctl defrag"],
        sources: [
          {"url": "https://etcd.io/docs/", "label": "etcd Documentation"}
        ]
      },
      {
        step: "Increase etcd storage or cleanup",
        commands: ["kubectl delete events --all", "kubectl get all --all-namespaces  < /dev/null |  grep -v Running"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/", "label": "Configure etcd"}
        ]
      }
    ],
    clarifying_questions: ["What is the current size of the etcd database?", "Are there any patterns in the data causing growth?"],
    examples: [
      {
        name: "API server failing to write to etcd",
        symptom: "Cluster operations fail with storage quota exceeded",
        fix: "Compact etcd database and clean up old resources",
        sources: [
          {"url": "https://etcd.io/docs/", "label": "etcd Documentation"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "failedmount",
    title: "Failed Mount",
    aliases: ["failedmount", "failed mount", "volume mount error", "mount failure"],
    matchers: {
      regex: ["failedmount", "failed.*mount", "volume.*mount.*error", "mount.*failure"]
    },
    category: "storage",
    summary: "PersistentVolumeClaim is stuck in pending state.",
    root_causes: [
      {
        name: "Volume does not exist",
        why: "Referenced volume or persistent volume claim is missing",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      },
      {
        name: "Mount path conflicts",
        why: "Volume mount path is already in use or invalid",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      },
      {
        name: "Storage backend issues",
        why: "Underlying storage system is unavailable or has errors",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/storage-classes/", "label": "Storage Classes"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check volume and PVC status",
        commands: ["kubectl describe pod <pod-name>", "kubectl get pvc"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      },
      {
        step: "Verify volume configuration",
        commands: ["kubectl get pod <pod-name> -o yaml  < /dev/null |  grep -A 5 volumes"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      },
      {
        step: "Check storage class and provisioner",
        commands: ["kubectl get storageclass", "kubectl describe storageclass <storage-class>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/storage-classes/", "label": "Storage Classes"}
        ]
      }
    ],
    clarifying_questions: ["What type of volume is failing to mount?", "What is the exact error message in the pod events?"],
    examples: [
      {
        name: "Pod stuck in ContainerCreating due to volume mount",
        symptom: "Pod shows FailedMount events and cannot start",
        fix: "Resolve volume availability or configuration issues",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "failedscheduling",
    title: "FailedScheduling",
    aliases: ["failedscheduling", "failed scheduling", "scheduling failed"],
    matchers: {
      regex: ["failedscheduling", "failed.*scheduling", "scheduling.*failed"]
    },
    category: "scheduler",
    summary: "The Kubernetes scheduler cannot find a suitable node to place the pod due to various constraints.",
    root_causes: [
      {
        name: "Resource constraints",
        why: "No nodes have sufficient CPU, memory, or other resources",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "label": "kube-scheduler"}
        ]
      },
      {
        name: "Affinity rules",
        why: "Pod affinity or anti-affinity rules prevent scheduling",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Pod Affinity"}
        ]
      },
      {
        name: "Node taints",
        why: "All nodes are tainted and pod lacks proper tolerations",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/", "label": "Taints and Tolerations"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check scheduler events",
        commands: ["kubectl get events --sort-by=.metadata.creationTimestamp"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Events"}
        ]
      },
      {
        step: "Examine node capacity",
        commands: ["kubectl describe nodes"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/nodes/", "label": "Node Documentation"}
        ]
      },
      {
        step: "Review pod scheduling constraints",
        commands: ["kubectl get pod <pod-name> -o yaml"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Pod Scheduling"}
        ]
      },
      {
        step: "Check for node taints",
        commands: ["kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/", "label": "Taints"}
        ]
      }
    ],
    clarifying_questions: ["What scheduling constraints does the pod have?", "Are there any specific node requirements?"],
    examples: [
      {
        name: "Pod with anti-affinity blocking scheduling",
        symptom: "FailedScheduling due to pod anti-affinity rules",
        fix: "Modify anti-affinity rules or add more nodes",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Pod Affinity Guide"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "forbidden",
    title: "Forbidden",
    aliases: ["forbidden", "403 forbidden", "access denied", "permission denied", "rbac denied"],
    matchers: {
      regex: ["forbidden", "403.*forbidden", "access.*denied", "permission.*denied"]
    },
    category: "auth",
    summary: "Request was denied due to insufficient RBAC permissions. The user or ServiceAccount lacks required permissions for the requested operation.",
    root_causes: [
      {
        name: "Missing RBAC permissions",
        why: "ServiceAccount or user lacks necessary Role or ClusterRole bindings",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/", "label": "Using RBAC Authorization"}
        ]
      },
      {
        name: "Pod Security Policy violation",
        why: "Pod violates configured Pod Security Policy constraints",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/security/pod-security-policy/", "label": "Pod Security Policies"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check current permissions",
        commands: ["kubectl auth can-i <verb> <resource>", "kubectl auth can-i --list"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authorization/#checking-api-access", "label": "Checking API Access"}
        ]
      },
      {
        step: "Create appropriate RBAC rules",
        commands: ["kubectl create rolebinding <name> --role=<role> --serviceaccount=<namespace>:<sa>"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#command-line-utilities", "label": "RBAC Command Line Utilities"}
        ]
      },
      {
        step: "Verify ServiceAccount bindings",
        commands: ["kubectl get rolebinding,clusterrolebinding -o wide"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions", "label": "ServiceAccount Permissions"}
        ]
      }
    ],
    clarifying_questions: ["What operation is being forbidden?", "What ServiceAccount is the pod using?"],
    examples: [
      {
        name: "Pod accessing secrets without permission",
        symptom: "Forbidden error when pod tries to read Secret",
        fix: "Create RoleBinding granting secrets access to ServiceAccount",
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#referring-to-resources", "label": "RBAC Resource References"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "hpanotworking",
    title: "HPA Not Working",
    aliases: ["hpanotworking", "hpa not working", "horizontal pod autoscaler failed", "autoscaling failed"],
    matchers: {
      regex: ["hpanotworking", "hpa.*not.*working", "horizontal.*pod.*autoscaler.*failed", "autoscaling.*failed"]
    },
    category: "scheduler",
    summary: "Horizontal Pod Autoscaler is not functioning properly.",
    root_causes: [
      {
        name: "Metrics server not available",
        why: "Metrics server is not running or not accessible",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", "label": "Horizontal Pod Autoscaler"}
        ]
      },
      {
        name: "Resource requests not defined",
        why: "Pod resource requests are missing, preventing HPA from calculating scaling",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", "label": "Horizontal Pod Autoscaler"}
        ]
      },
      {
        name: "Incorrect HPA configuration",
        why: "HPA target reference or scaling metrics are misconfigured",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", "label": "Horizontal Pod Autoscaler"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check HPA status",
        commands: ["kubectl get hpa", "kubectl describe hpa <hpa-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", "label": "Horizontal Pod Autoscaler"}
        ]
      },
      {
        step: "Verify metrics server",
        commands: ["kubectl top pods", "kubectl get apiservice  < /dev/null |  grep metrics"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/", "label": "Resource Usage Monitoring"}
        ]
      },
      {
        step: "Check resource requests",
        commands: ["kubectl get deployment <deployment-name> -o yaml | grep -A 5 resources"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    clarifying_questions: ["What metrics is the HPA configured to use?", "Are pod resource requests defined?"],
    examples: [
      {
        name: "HPA shows unknown status for metrics",
        symptom: "HPA displays unknown for current metric values",
        fix: "Install or fix metrics server and ensure resource requests are set",
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", "label": "Horizontal Pod Autoscaler"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "image-never-pull",
    title: "Image Never Pull",
    aliases: ["imagepullpolicy never", "image never pull", "pull policy never", "errimageneverpu ll"],
    matchers: {
      regex: ["imagepullpolicy.*never", "image.*never.*pull", "errimageneverpu.*ll"]
    },
    category: "config",
    summary: "Container cannot start because imagePullPolicy is set to Never but the image is not available locally on the node.",
    root_causes: [
      {
        name: "Image not present locally",
        why: "imagePullPolicy is Never but image does not exist in local container runtime",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy", "label": "Image Pull Policy"}
        ]
      },
      {
        name: "Incorrect pull policy",
        why: "Pull policy should be IfNotPresent or Always for registry images",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/#updating-images", "label": "Updating Images"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check current pull policy",
        commands: ["kubectl get pod <pod-name> -o yaml | grep imagePullPolicy"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy", "label": "Image Pull Policy Guide"}
        ]
      },
      {
        step: "Change pull policy to IfNotPresent",
        commands: ["kubectl patch deployment <deployment> -p '{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"<container>\",\"imagePullPolicy\":\"IfNotPresent\"}]}}}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy", "label": "Pull Policy Configuration"}
        ]
      },
      {
        step: "Pre-pull image if needed",
        commands: ["docker pull <image-name>", "crictl pull <image-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/crictl/", "label": "Debugging Kubernetes nodes with crictl"}
        ]
      }
    ],
    clarifying_questions: ["Is this a locally built image?", "What imagePullPolicy is configured?"],
    examples: [
      {
        name: "Local development image with Never policy",
        symptom: "ErrImageNeverPull when deploying locally built image",
        fix: "Change imagePullPolicy to IfNotPresent or pre-load image",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy", "label": "Image Pull Policies"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "ingressnotworking",
    title: "Ingress Not Working",
    aliases: ["ingressnotworking", "ingress not working", "ingress failed", "load balancer failed"],
    matchers: {
      regex: ["ingressnotworking", "ingress.*not.*working", "ingress.*failed", "load.*balancer.*failed"]
    },
    category: "network",
    summary: "Ingress controller is not routing traffic to backend services.",
    root_causes: [
      {
        name: "Ingress controller not running",
        why: "Ingress controller pods are not deployed or not healthy",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/ingress/", "label": "Ingress"}
        ]
      },
      {
        name: "Backend service issues",
        why: "Target service is not available or misconfigured",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/ingress/", "label": "Ingress"}
        ]
      },
      {
        name: "Ingress configuration errors",
        why: "Ingress resource has incorrect rules or annotations",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/ingress/", "label": "Ingress"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check ingress controller status",
        commands: ["kubectl get pods -n ingress-nginx", "kubectl logs -n ingress-nginx deployment/ingress-nginx-controller"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/ingress/", "label": "Ingress"}
        ]
      },
      {
        step: "Verify ingress configuration",
        commands: ["kubectl describe ingress <ingress-name>", "kubectl get ingress"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/ingress/", "label": "Ingress"}
        ]
      },
      {
        step: "Test backend service connectivity",
        commands: ["kubectl get svc", "kubectl describe svc <service-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      }
    ],
    clarifying_questions: ["Which ingress controller are you using?", "What specific error are you seeing when accessing the application?"],
    examples: [
      {
        name: "External traffic not reaching application",
        symptom: "HTTP requests to ingress return 503 or connection refused",
        fix: "Check ingress controller health and backend service status",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/ingress/", "label": "Ingress"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "invalidimagenameerror",
    title: "InvalidImageName / ErrInvalidImageName",
    aliases: ["invalidimagenameerror", "errinvalidimagename", "invalid image name"],
    matchers: {
      regex: ["invalidimagenameerror", "errinvalidimagename", "invalid.*image.*name"]
    },
    category: "config",
    summary: "The container image name is malformed or contains invalid characters according to Docker/OCI naming conventions.",
    root_causes: [
      {
        name: "Invalid image name format",
        why: "Image name contains invalid characters, uppercase letters, or improper format",
        confidence: 0.9,
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/tag/", "label": "Docker Tag Reference"}
        ]
      },
      {
        name: "Missing registry or tag",
        why: "Image reference is incomplete or malformed",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/", "label": "Container Images"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check image name format",
        commands: ["kubectl get pod <pod-name> -o yaml | grep image"],
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/tag/", "label": "Docker Naming Convention"}
        ]
      },
      {
        step: "Validate image name syntax",
        commands: ["docker pull <image-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/containers/images/", "label": "Image Names"}
        ]
      },
      {
        step: "Fix image name in deployment",
        commands: ["kubectl edit deployment <deployment-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/", "label": "Deployments"}
        ]
      }
    ],
    clarifying_questions: ["What is the exact image name being used?", "Are there any special characters in the image name?"],
    examples: [
      {
        name: "Image name with uppercase letters",
        symptom: "InvalidImageName for 'MyApp:Latest'",
        fix: "Change to lowercase: 'myapp:latest'",
        sources: [
          {"url": "https://docs.docker.com/engine/reference/commandline/tag/", "label": "Docker Tag Rules"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "invalidyaml",
    title: "Invalid YAML",
    aliases: ["invalidyaml", "invalid yaml", "yaml syntax error", "malformed yaml"],
    matchers: {
      regex: ["invalidyaml", "invalid.*yaml", "yaml.*syntax.*error", "malformed.*yaml"]
    },
    category: "config",
    summary: "Kubernetes manifest contains invalid YAML syntax.",
    root_causes: [
      {
        name: "YAML indentation errors",
        why: "Incorrect spaces or tabs used for indentation",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/", "label": "Kubernetes Objects"}
        ]
      },
      {
        name: "Missing or extra quotation marks",
        why: "String values are not properly quoted",
        confidence: 0.7,
        sources: [
          {"url": "https://yaml.org/spec/1.2/spec.html", "label": "YAML Specification"}
        ]
      },
      {
        name: "Invalid special characters",
        why: "Special characters not properly escaped in YAML",
        confidence: 0.6,
        sources: [
          {"url": "https://yaml.org/spec/1.2/spec.html", "label": "YAML Specification"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Validate YAML syntax",
        commands: ["kubectl apply --dry-run=client -f <yaml-file>", "yamllint <yaml-file>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/", "label": "Kubernetes Objects"}
        ]
      },
      {
        step: "Check indentation and formatting",
        commands: ["cat -A <yaml-file>", "python -c \"import yaml; yaml.safe_load(open('<yaml-file>'))\""],
        sources: [
          {"url": "https://yaml.org/spec/1.2/spec.html", "label": "YAML Specification"}
        ]
      },
      {
        step: "Use YAML validator tools",
        commands: ["kubectl explain <resource-type>", "kubectl api-resources"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/kubectl/cheatsheet/", "label": "kubectl Cheat Sheet"}
        ]
      }
    ],
    clarifying_questions: ["What is the specific error message from kubectl?", "Which part of the YAML file is causing the issue?"],
    examples: [
      {
        name: "kubectl apply fails with parsing error",
        symptom: "kubectl returns YAML parsing error when applying manifest",
        fix: "Fix indentation and syntax issues in the YAML file",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/", "label": "Kubernetes Objects"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "kubelet-not-ready",
    title: "Kubelet Not Ready",
    aliases: ["kubelet not ready", "kubelet notready", "kubelet failed", "kubelet down"],
    matchers: {
      regex: ["kubelet.*not.*ready", "kubelet.*notready", "kubelet.*failed"]
    },
    category: "runtime",
    summary: "The kubelet service on a node is not functioning properly, causing the node to be marked as NotReady.",
    root_causes: [
      {
        name: "Kubelet service stopped",
        why: "The kubelet systemd service has crashed or been stopped",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/components/#kubelet", "label": "Node Components"}
        ]
      },
      {
        name: "Resource exhaustion on node",
        why: "Node has run out of disk space, memory, or other critical resources",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node-pressure Eviction"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check kubelet service status",
        commands: ["systemctl status kubelet", "journalctl -u kubelet"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Troubleshooting Clusters"}
        ]
      },
      {
        step: "Check node resource usage",
        commands: ["df -h", "free -h"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Resource Management"}
        ]
      },
      {
        step: "Restart kubelet service",
        commands: ["systemctl restart kubelet"],
        sources: [
          {"url": "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/", "label": "Troubleshooting kubeadm"}
        ]
      }
    ],
    clarifying_questions: ["Can you access the node directly?", "When did the kubelet last work?"],
    examples: [
      {
        name: "Kubelet crashed due to disk full",
        symptom: "Node NotReady with kubelet logs showing disk space errors",
        fix: "Clear disk space and restart kubelet service",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Disk Pressure"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "limitrangeviolation",
    title: "Limit Range Violation",
    aliases: ["limitrangeviolation", "limit range violation", "resource limit violated", "limit exceeded"],
    matchers: {
      regex: ["limitrangeviolation", "limit.*range.*violation", "resource.*limit.*violated", "limit.*exceeded"]
    },
    category: "runtime",
    summary: "Pod resource configuration violates namespace LimitRange constraints.",
    root_causes: [
      {
        name: "Resource requests exceed LimitRange maximum",
        why: "Pod resource requests are higher than allowed by LimitRange",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/limit-range/", "label": "Limit Range"}
        ]
      },
      {
        name: "Resource requests below LimitRange minimum",
        why: "Pod resource requests are lower than required minimum",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/limit-range/", "label": "Limit Range"}
        ]
      },
      {
        name: "Missing resource requests or limits",
        why: "Pod does not specify required resource requests or limits",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/limit-range/", "label": "Limit Range"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check LimitRange constraints",
        commands: ["kubectl describe limitrange", "kubectl get limitrange -o yaml"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/limit-range/", "label": "Limit Range"}
        ]
      },
      {
        step: "Review pod resource configuration",
        commands: ["kubectl describe pod <pod-name>", "kubectl get pod <pod-name> -o yaml  < /dev/null |  grep -A 5 resources"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      },
      {
        step: "Adjust resource requests or limits",
        commands: ["kubectl patch deployment <deployment-name> -p '{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"<container-name>\",\"resources\":{\"requests\":{\"memory\":\"128Mi\"}}}]}}}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    clarifying_questions: ["What are the current LimitRange constraints in the namespace?", "What resource values is the pod trying to use?"],
    examples: [
      {
        name: "Pod creation blocked by LimitRange",
        symptom: "Pod creation fails with LimitRange violation error",
        fix: "Adjust pod resource requests to comply with LimitRange",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/limit-range/", "label": "Limit Range"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "memorypressure",
    title: "MemoryPressure",
    aliases: ["memorypressure", "memory pressure", "low memory"],
    matchers: {
      regex: ["memorypressure", "memory.*pressure", "low.*memory"]
    },
    category: "runtime",
    summary: "Node is experiencing memory pressure due to low available memory, which may trigger pod evictions.",
    root_causes: [
      {
        name: "High memory usage",
        why: "Available memory has fallen below the eviction threshold",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Pressure Eviction"}
        ]
      },
      {
        name: "Memory leaks in applications",
        why: "Applications are consuming more memory over time",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Applications"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check memory usage",
        commands: ["kubectl top nodes", "kubectl describe node <node-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Memory Pressure"}
        ]
      },
      {
        step: "Identify high memory pods",
        commands: ["kubectl top pods --all-namespaces --sort-by=memory"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/", "label": "Resource Monitoring"}
        ]
      },
      {
        step: "Review memory limits",
        commands: ["kubectl get pods -o=custom-columns=NAME:.metadata.name,MEMORY:.spec.containers[0].resources.limits.memory"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    clarifying_questions: ["How much memory is available on the node?", "Which pods are using the most memory?"],
    examples: [
      {
        name: "Node with high memory usage",
        symptom: "MemoryPressure condition causing pod evictions",
        fix: "Add more memory or reduce pod memory requests",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Memory Pressure"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "namespacenotfound",
    title: "Namespace Not Found",
    aliases: ["namespacenotfound", "namespace not found", "namespace missing", "namespace does not exist"],
    matchers: {
      regex: ["namespacenotfound", "namespace.*not.*found", "namespace.*missing", "namespace.*does.*not.*exist"]
    },
    category: "config",
    summary: "Referenced Kubernetes namespace does not exist.",
    root_causes: [
      {
        name: "Namespace was never created",
        why: "Referenced namespace has not been created in the cluster",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      },
      {
        name: "Namespace was deleted",
        why: "Namespace was previously deleted or cleaned up",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      },
      {
        name: "Incorrect namespace name",
        why: "Namespace name is misspelled or incorrect",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "List existing namespaces",
        commands: ["kubectl get namespaces", "kubectl get ns"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      },
      {
        step: "Create missing namespace",
        commands: ["kubectl create namespace <namespace-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      },
      {
        step: "Verify correct namespace name",
        commands: ["kubectl config view --minify  < /dev/null |  grep namespace"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      }
    ],
    clarifying_questions: ["What is the exact namespace name being referenced?", "Was this namespace previously available?"],
    examples: [
      {
        name: "kubectl command fails with namespace not found",
        symptom: "kubectl returns namespace not found error",
        fix: "Create the namespace or fix the namespace name",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "networkunreachable",
    title: "Network Unreachable",
    aliases: ["networkunreachable", "network unreachable", "network connectivity"],
    matchers: {
      regex: ["networkunreachable", "network.*unreachable", "network.*connectivity"]
    },
    category: "network",
    summary: "Network connectivity issues preventing communication between pods, services, or external resources.",
    root_causes: [
      {
        name: "CNI plugin issues",
        why: "Container Network Interface plugin is not functioning properly",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Cluster Networking"}
        ]
      },
      {
        name: "Network policy blocking traffic",
        why: "NetworkPolicy is preventing required network communication",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/network-policies/", "label": "Network Policies"}
        ]
      },
      {
        name: "DNS resolution failure",
        why: "DNS is not resolving service names or external domains",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "label": "DNS for Services and Pods"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Test network connectivity",
        commands: ["kubectl exec -it <pod-name> -- ping <target-ip>", "kubectl exec -it <pod-name> -- nslookup <service-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/", "label": "Debug Services"}
        ]
      },
      {
        step: "Check CNI plugin status",
        commands: ["kubectl get pods -n kube-system | grep -E 'calico|flannel|weave'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Network Plugins"}
        ]
      },
      {
        step: "Review network policies",
        commands: ["kubectl get networkpolicies --all-namespaces"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/network-policies/", "label": "Network Policies"}
        ]
      }
    ],
    clarifying_questions: ["What specific network connection is failing?", "Are there any network policies in place?"],
    examples: [
      {
        name: "Pod cannot reach external API",
        symptom: "Network unreachable when calling external service",
        fix: "Check network policies and firewall rules",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/network-policies/", "label": "Network Policies"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "no-such-host",
    title: "No Such Host",
    aliases: ["no such host", "host not found", "name resolution failed", "nxdomain"],
    matchers: {
      regex: ["no.*such.*host", "host.*not.*found", "name.*resolution.*failed", "nxdomain"]
    },
    category: "network",
    summary: "DNS resolution failed - hostname could not be resolved to an IP address by the cluster DNS service.",
    root_causes: [
      {
        name: "DNS service not working",
        why: "CoreDNS pods are not functioning properly in the cluster",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "label": "DNS for Services and Pods"}
        ]
      },
      {
        name: "Incorrect service name",
        why: "Service name is misspelled or does not exist in namespace",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#services", "label": "Service DNS"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check DNS pods status",
        commands: ["kubectl get pods -n kube-system -l k8s-app=kube-dns"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/", "label": "Debugging DNS Resolution"}
        ]
      },
      {
        step: "Test DNS resolution from pod",
        commands: ["kubectl exec -it <pod-name> -- nslookup kubernetes.default"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/", "label": "DNS Debugging"}
        ]
      },
      {
        step: "Verify service exists",
        commands: ["kubectl get svc", "kubectl get svc -A | grep <name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Service Discovery"}
        ]
      }
    ],
    clarifying_questions: ["What hostname is failing to resolve?", "Is this a Kubernetes service or external hostname?"],
    examples: [
      {
        name: "Service name typo",
        symptom: "No such host error when connecting to misspelled service name",
        fix: "Correct the service name in application configuration",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "label": "DNS Resolution Guide"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "nodefull",
    title: "Node Full",
    aliases: ["nodefull", "node full", "disk full", "node disk full"],
    matchers: {
      regex: ["nodefull", "node.*full", "disk.*full", "no.*space.*left", "insufficient.*disk.*space"]
    },
    category: "runtime",
    summary: "Node has run out of disk space, preventing pod scheduling and potentially triggering pod evictions.",
    root_causes: [
      {
        name: "Node disk space exhaustion",
        why: "Node has consumed all available disk space",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/system-logs/", "label": "System Logs"}
        ]
      },
      {
        name: "Log files consuming excessive space",
        why: "Application or system logs are taking up too much disk space",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/logging/", "label": "Logging"}
        ]
      },
      {
        name: "Container images not being cleaned up",
        why: "Old or unused container images are accumulating",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/garbage-collection/", "label": "Garbage Collection"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check disk space on node",
        commands: ["kubectl describe node <node-name>", "df -h"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debug Cluster"}
        ]
      },
      {
        step: "Clean up unused container images",
        commands: ["docker system prune -a", "crictl rmi --prune"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/garbage-collection/", "label": "Garbage Collection"}
        ]
      },
      {
        step: "Configure log rotation",
        commands: ["logrotate -f /etc/logrotate.conf"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/logging/", "label": "Logging"}
        ]
      }
    ],
    clarifying_questions: ["Which node is experiencing disk space issues?", "What type of data is consuming the most space?"],
    examples: [
      {
        name: "Node evicting pods due to disk pressure",
        symptom: "Pods being evicted from node with DiskPressure condition",
        fix: "Clean up disk space and configure proper garbage collection",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Pressure Eviction"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "nodenotfound",
    title: "Node Not Found",
    aliases: ["nodenotfound", "node not found", "node missing", "node unavailable"],
    matchers: {
      regex: ["nodenotfound", "node.*not.*found", "node.*missing", "node.*unavailable"]
    },
    category: "cluster",
    summary: "Kubernetes node is not found or no longer available in the cluster.",
    root_causes: [
      {
        name: "Node has been removed from cluster",
        why: "Node was manually removed or automatically cleaned up",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/nodes/", "label": "Nodes"}
        ]
      },
      {
        name: "Node has failed and is unreachable",
        why: "Node hardware or network failure has occurred",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debug Cluster"}
        ]
      },
      {
        name: "kubelet has stopped on the node",
        why: "kubelet service is not running or has crashed",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/", "label": "kubelet"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check node status",
        commands: ["kubectl get nodes", "kubectl describe node <node-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/nodes/", "label": "Nodes"}
        ]
      },
      {
        step: "Verify node connectivity",
        commands: ["ping <node-ip>", "ssh <node-ip>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debug Cluster"}
        ]
      },
      {
        step: "Check kubelet service",
        commands: ["systemctl status kubelet", "journalctl -u kubelet"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/", "label": "kubelet"}
        ]
      }
    ],
    clarifying_questions: ["Which specific node is not found?", "When did you last see the node available?"],
    examples: [
      {
        name: "Pod stuck pending on missing node",
        symptom: "Pod shows NodeNotFound in events",
        fix: "Investigate node status and replace if necessary",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/nodes/", "label": "Nodes"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "nodenotready",
    title: "Node Not Ready",
    aliases: ["nodenotready", "node not ready", "notready"],
    matchers: {
      regex: ["nodenotready", "node.*not.*ready", "notready"]
    },
    category: "cluster",
    summary: "Node is in NotReady state and cannot accept new pods due to node-level issues.",
    root_causes: [
      {
        name: "Kubelet not running",
        why: "The kubelet process has stopped or crashed on the node",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/nodes/", "label": "Node Management"}
        ]
      },
      {
        name: "Network connectivity issues",
        why: "Node cannot communicate with the control plane",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debug Clusters"}
        ]
      },
      {
        name: "Resource exhaustion",
        why: "Node is out of disk space or memory",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Pressure Eviction"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check node status",
        commands: ["kubectl get nodes", "kubectl describe node <node-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/architecture/nodes/", "label": "Node Status"}
        ]
      },
      {
        step: "Check kubelet status",
        commands: ["systemctl status kubelet", "journalctl -u kubelet"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debug Cluster"}
        ]
      },
      {
        step: "Check node resources",
        commands: ["kubectl top node <node-name>", "df -h"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Resources"}
        ]
      }
    ],
    clarifying_questions: ["How long has the node been NotReady?", "Are there any recent changes to the node?"],
    examples: [
      {
        name: "Node out of disk space",
        symptom: "Node NotReady with DiskPressure condition",
        fix: "Clean up disk space or add more storage",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Disk Pressure"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "oomkilled",
    title: "OOMKilled",
    aliases: ["oomkilled", "out of memory killed", "memory limit exceeded"],
    matchers: {
      regex: ["oomkilled", "out.*of.*memory", "memory.*limit.*exceeded"]
    },
    category: "runtime",
    summary: "Container was terminated by the system due to exceeding memory limits or running out of available memory.",
    root_causes: [
      {
        name: "Memory limit exceeded",
        why: "Container used more memory than its configured limit",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Managing Resources for Containers"}
        ]
      },
      {
        name: "Memory leak",
        why: "Application has memory leak causing gradual memory increase",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Applications"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check memory usage and limits",
        commands: ["kubectl top pod <pod-name> --containers", "kubectl describe pod <pod-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      },
      {
        step: "Increase memory limit",
        commands: ["kubectl patch deployment <deployment-name> -p '{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"<container-name>\",\"resources\":{\"limits\":{\"memory\":\"512Mi\"}}}]}}}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Limits"}
        ]
      },
      {
        step: "Investigate memory leaks",
        commands: ["kubectl logs <pod-name>", "kubectl exec -it <pod-name> -- top"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Applications"}
        ]
      }
    ],
    clarifying_questions: ["What memory limit is set?", "Is memory usage growing over time?"],
    examples: [
      {
        name: "Java application with memory leak",
        symptom: "OOMKilled with increasing memory usage in logs",
        fix: "Increase memory limit and fix memory leak in application",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "persistentvolumeclaimpending",
    title: "Persistent Volume Claim Pending",
    aliases: ["persistentvolumeclaimpending", "pvc pending", "volume claim pending", "storage pending"],
    matchers: {
      regex: ["persistentvolumeclaimpending", "pvc.*pending", "volume.*claim.*pending", "storage.*pending"]
    },
    category: "storage",
    summary: "PersistentVolumeClaim is stuck in pending state.",
    root_causes: [
      {
        name: "No available persistent volumes",
        why: "No PersistentVolume matches the claim requirements",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      },
      {
        name: "Storage class not found",
        why: "Specified storage class does not exist",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/storage-classes/", "label": "Storage Classes"}
        ]
      },
      {
        name: "Insufficient storage capacity",
        why: "Requested storage size exceeds available capacity",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check PVC status",
        commands: ["kubectl describe pvc <pvc-name>", "kubectl get events"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      },
      {
        step: "List available persistent volumes",
        commands: ["kubectl get pv", "kubectl get storageclass"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      },
      {
        step: "Create or provision storage",
        commands: ["kubectl apply -f pv.yaml"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      }
    ],
    clarifying_questions: ["What storage class is the PVC requesting?", "Are there any available PVs that match the requirements?"],
    examples: [
      {
        name: "PVC waiting for dynamic provisioning",
        symptom: "PVC shows waiting for a volume to be created",
        fix: "Ensure storage class supports dynamic provisioning or create PV manually",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/", "label": "Dynamic Provisioning"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "pod-terminating-stuck",
    title: "Pod Stuck Terminating",
    aliases: ["pod terminating stuck", "terminating forever", "pod won't terminate", "stuck terminating"],
    matchers: {
      regex: ["pod.*terminating.*stuck", "terminating.*forever", "stuck.*terminating"]
    },
    category: "runtime",
    summary: "Pod remains in Terminating state indefinitely, usually due to finalizers or volume cleanup issues preventing deletion.",
    root_causes: [
      {
        name: "Finalizers preventing deletion",
        why: "Pod has finalizers that are not being removed by controllers",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/", "label": "Finalizers"}
        ]
      },
      {
        name: "Volume cleanup issues",
        why: "Attached volumes cannot be cleanly unmounted",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volume Lifecycle"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check pod finalizers",
        commands: ["kubectl get pod <pod-name> -o yaml | grep finalizers"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/", "label": "Working with Finalizers"}
        ]
      },
      {
        step: "Force delete pod if safe",
        commands: ["kubectl delete pod <pod-name> --grace-period=0 --force"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete", "label": "kubectl delete"}
        ]
      },
      {
        step: "Remove finalizers if needed",
        commands: ["kubectl patch pod <pod-name> -p '{\"metadata\":{\"finalizers\":null}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/", "label": "Finalizer Management"}
        ]
      }
    ],
    clarifying_questions: ["How long has the pod been terminating?", "Are there custom controllers involved?"],
    examples: [
      {
        name: "Pod with stuck volume finalizer",
        symptom: "Pod terminating for hours with volume protection finalizer",
        fix: "Check volume attachment status and force detach if needed",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "PV Protection"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "podexitsigterm",
    title: "Pod Exit SIGTERM",
    aliases: ["podexitsigterm", "pod exit sigterm", "terminated", "graceful shutdown"],
    matchers: {
      regex: ["podexitsigterm", "pod.*exit.*sigterm", "terminated", "graceful.*shutdown"]
    },
    category: "runtime",
    summary: "Pod was terminated gracefully with SIGTERM signal during shutdown.",
    root_causes: [
      {
        name: "Normal pod shutdown",
        why: "Pod was gracefully terminated as expected",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/", "label": "Pod Lifecycle"}
        ]
      },
      {
        name: "Application taking too long to shutdown",
        why: "Application did not respond to SIGTERM within grace period",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/", "label": "Pod Lifecycle"}
        ]
      },
      {
        name: "Resource constraints triggering eviction",
        why: "Pod was evicted due to resource pressure",
        confidence: 0.5,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "label": "Node Pressure Eviction"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check pod termination reason",
        commands: ["kubectl describe pod <pod-name>", "kubectl get events"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/", "label": "Pod Lifecycle"}
        ]
      },
      {
        step: "Review application shutdown handling",
        commands: ["kubectl logs <pod-name> --previous"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/", "label": "Pod Lifecycle"}
        ]
      },
      {
        step: "Adjust termination grace period if needed",
        commands: ["kubectl patch deployment <deployment-name> -p '{\"spec\":{\"template\":{\"spec\":{\"terminationGracePeriodSeconds\":60}}}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/", "label": "Pod Lifecycle"}
        ]
      }
    ],
    clarifying_questions: ["Was this an expected pod termination?", "Is the application handling SIGTERM properly?"],
    examples: [
      {
        name: "Deployment rollout terminating old pods",
        symptom: "Pods show terminated with SIGTERM during deployment update",
        fix: "This is normal behavior during rolling updates",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/", "label": "Deployments"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "podpending",
    title: "Pod Stuck in Pending State",
    aliases: ["pending", "pod pending", "stuck pending"],
    matchers: {
      regex: ["pending", "stuck.*pending"]
    },
    category: "scheduler",
    summary: "Pod cannot be scheduled to any node due to resource constraints, node selectors, or other scheduling issues.",
    root_causes: [
      {
        name: "Insufficient resources",
        why: "No nodes have enough CPU or memory to accommodate the pod",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      },
      {
        name: "Node selector mismatch",
        why: "Pod has nodeSelector that doesn't match any available nodes",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Assign Pods to Nodes"}
        ]
      },
      {
        name: "Taints and tolerations",
        why: "Nodes are tainted and pod lacks proper tolerations",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/", "label": "Taints and Tolerations"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check pod events",
        commands: ["kubectl describe pod <pod-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/", "label": "Debug Applications"}
        ]
      },
      {
        step: "Check node resources",
        commands: ["kubectl top nodes", "kubectl describe nodes"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/kubectl/cheatsheet/", "label": "kubectl Commands"}
        ]
      },
      {
        step: "Review resource requests",
        commands: ["kubectl get pod <pod-name> -o yaml"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Requests"}
        ]
      },
      {
        step: "Check node taints and tolerations",
        commands: ["kubectl describe nodes", "kubectl get pod <pod-name> -o yaml"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/", "label": "Taints and Tolerations"}
        ]
      }
    ],
    clarifying_questions: ["What does kubectl describe pod show?", "How much CPU/memory is the pod requesting?"],
    examples: [
      {
        name: "Pod requesting more memory than available",
        symptom: "Pod pending with 'Insufficient memory' in events",
        fix: "Reduce memory request or add more nodes",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "podschedulingfailed",
    title: "Pod Scheduling Failed",
    aliases: ["podschedulingfailed", "pod scheduling failed", "scheduling failed", "unschedulable"],
    matchers: {
      regex: ["podschedulingfailed", "pod.*scheduling.*failed", "scheduling.*failed", "unschedulable"]
    },
    category: "scheduler",
    summary: "Pod could not be scheduled on any available node in the cluster.",
    root_causes: [
      {
        name: "Insufficient resources",
        why: "No nodes have enough CPU or memory to schedule the pod",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "label": "kube-scheduler"}
        ]
      },
      {
        name: "Node selector constraints",
        why: "Pod has node selector that no nodes match",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Assign Pods to Nodes"}
        ]
      },
      {
        name: "Taints and tolerations mismatch",
        why: "Pod does not have tolerations for node taints",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/", "label": "Taints and Tolerations"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check scheduler events",
        commands: ["kubectl describe pod <pod-name>", "kubectl get events --sort-by='.lastTimestamp'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "label": "kube-scheduler"}
        ]
      },
      {
        step: "Review resource requests",
        commands: ["kubectl top nodes", "kubectl describe nodes"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      },
      {
        step: "Check node selectors and taints",
        commands: ["kubectl get nodes --show-labels", "kubectl describe nodes  < /dev/null |  grep -A 5 Taints"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Assign Pods to Nodes"}
        ]
      }
    ],
    clarifying_questions: ["What specific scheduling constraint is failing?", "Are there any node selectors or tolerations defined?"],
    examples: [
      {
        name: "Pod pending due to insufficient CPU",
        symptom: "Pod shows FailedScheduling with insufficient cpu message",
        fix: "Reduce resource requests or add more nodes",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "podsecuritypolicy",
    title: "PodSecurityPolicy Violation",
    aliases: ["podsecuritypolicy", "psp violation", "security policy denied"],
    matchers: {
      regex: ["podsecuritypolicy", "psp.*violation", "security.*policy.*denied"]
    },
    category: "auth",
    summary: "Pod creation was blocked by PodSecurityPolicy due to security constraints violations.",
    root_causes: [
      {
        name: "Privileged container denied",
        why: "PodSecurityPolicy doesn't allow privileged containers",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/pod-security-policy/", "label": "Pod Security Policy"}
        ]
      },
      {
        name: "Invalid security context",
        why: "Container security context violates policy constraints",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/", "label": "Security Context"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check PodSecurityPolicy events",
        commands: ["kubectl get events --field-selector reason=FailedCreate"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/pod-security-policy/", "label": "PSP Troubleshooting"}
        ]
      },
      {
        step: "Review security context",
        commands: ["kubectl get pod <pod-name> -o yaml"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/", "label": "Security Context"}
        ]
      },
      {
        step: "Update pod security settings",
        commands: ["kubectl patch deployment <deployment-name> -p '{\"spec\":{\"template\":{\"spec\":{\"securityContext\":{\"runAsNonRoot\":true}}}}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/pod-security-policy/", "label": "Pod Security Policy"}
        ]
      }
    ],
    clarifying_questions: ["What security constraints are being violated?", "Is the pod trying to run as privileged?"],
    examples: [
      {
        name: "Privileged container blocked",
        symptom: "PodSecurityPolicy violation for privileged=true",
        fix: "Remove privileged: true from security context",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/pod-security-policy/", "label": "PSP Guide"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "podstuckpending",
    title: "Pod Stuck Pending",
    aliases: ["podstuckpending", "pod stuck pending", "pod pending", "pod not scheduled"],
    matchers: {
      regex: ["podstuckpending", "pod.*stuck.*pending", "pod.*pending", "pod.*not.*scheduled"]
    },
    category: "scheduler",
    summary: "Pod remains in pending state and cannot be scheduled.",
    root_causes: [
      {
        name: "Insufficient cluster resources",
        why: "No nodes have enough CPU or memory to run the pod",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "label": "kube-scheduler"}
        ]
      },
      {
        name: "Node selector constraints",
        why: "Pod nodeSelector does not match any available nodes",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Assign Pods to Nodes"}
        ]
      },
      {
        name: "Taints preventing scheduling",
        why: "All nodes have taints that pod cannot tolerate",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/", "label": "Taints and Tolerations"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check why pod is pending",
        commands: ["kubectl describe pod <pod-name>", "kubectl get events --sort-by='.lastTimestamp'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "label": "kube-scheduler"}
        ]
      },
      {
        step: "Review cluster resources",
        commands: ["kubectl top nodes", "kubectl describe nodes"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/", "label": "Resource Usage Monitoring"}
        ]
      },
      {
        step: "Check scheduling constraints",
        commands: ["kubectl get pod <pod-name> -o yaml  < /dev/null |  grep -A 5 nodeSelector", "kubectl get nodes --show-labels"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/", "label": "Assign Pods to Nodes"}
        ]
      }
    ],
    clarifying_questions: ["What error message appears in the pod events?", "Are there any specific scheduling constraints configured?"],
    examples: [
      {
        name: "Pod pending due to insufficient memory",
        symptom: "Pod shows FailedScheduling with insufficient memory message",
        fix: "Scale up cluster or reduce pod memory requirements",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "label": "Resource Management"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "portalreadyallocated",
    title: "Port Already Allocated",
    aliases: ["portalreadyallocated", "port already allocated", "port in use", "address already in use"],
    matchers: {
      regex: ["portalreadyallocated", "port.*already.*allocated", "port.*in.*use", "address.*already.*in.*use"]
    },
    category: "network",
    summary: "Port is already allocated or in use by another service.",
    root_causes: [
      {
        name: "Port conflict between services",
        why: "Multiple services trying to use the same port",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      },
      {
        name: "Host port already in use",
        why: "Pod trying to bind to host port that is already occupied",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/overview/", "label": "Configuration Best Practices"}
        ]
      },
      {
        name: "NodePort range exhaustion",
        why: "All ports in NodePort range are allocated",
        confidence: 0.5,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check existing port allocations",
        commands: ["kubectl get services --all-namespaces", "netstat -tulpn  < /dev/null |  grep <port>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      },
      {
        step: "Review service definitions",
        commands: ["kubectl describe service <service-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      },
      {
        step: "Change port or remove conflicts",
        commands: ["kubectl patch service <service-name> -p '{\"spec\":{\"ports\":[{\"port\":8081}]}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      }
    ],
    clarifying_questions: ["Which port is conflicting?", "Are you using hostPort or NodePort?"],
    examples: [
      {
        name: "Service creation fails with port conflict",
        symptom: "Service shows port already allocated error",
        fix: "Change port number or remove conflicting service",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "quotaexceeded",
    title: "Quota Exceeded",
    aliases: ["quotaexceeded", "quota exceeded", "resource quota exceeded", "limit exceeded"],
    matchers: {
      regex: ["quotaexceeded", "quota.*exceeded", "resource.*quota.*exceeded", "limit.*exceeded"]
    },
    category: "runtime",
    summary: "Resource quota limits have been exceeded in the namespace.",
    root_causes: [
      {
        name: "Namespace resource quota limit reached",
        why: "Total resource usage in namespace exceeds configured quota",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/resource-quotas/", "label": "Resource Quotas"}
        ]
      },
      {
        name: "Too many objects of a type",
        why: "Number of objects exceeds the count limit in quota",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/resource-quotas/", "label": "Resource Quotas"}
        ]
      },
      {
        name: "Storage quota exceeded",
        why: "Persistent volume claim requests exceed storage quota",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/resource-quotas/", "label": "Resource Quotas"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check current quota usage",
        commands: ["kubectl describe quota", "kubectl get resourcequota -o wide"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/resource-quotas/", "label": "Resource Quotas"}
        ]
      },
      {
        step: "Review resource consumption",
        commands: ["kubectl top pods", "kubectl get pods -o wide"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/", "label": "Resource Usage Monitoring"}
        ]
      },
      {
        step: "Increase quota or reduce usage",
        commands: ["kubectl patch resourcequota <quota-name> -p '{\"spec\":{\"hard\":{\"requests.cpu\":\"4\"}}}'"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/resource-quotas/", "label": "Resource Quotas"}
        ]
      }
    ],
    clarifying_questions: ["Which specific quota is being exceeded?", "What type of resources are causing the limit?"],
    examples: [
      {
        name: "Pod creation blocked by CPU quota",
        symptom: "Pod creation fails with exceeded quota message",
        fix: "Increase CPU quota or reduce pod resource requests",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/policy/resource-quotas/", "label": "Resource Quotas"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "rbacpermissiondenied",
    title: "RBAC Permission Denied",
    aliases: ["rbacpermissiondenied", "rbac permission denied", "access denied", "forbidden"],
    matchers: {
      regex: ["rbacpermissiondenied", "rbac.*permission.*denied", "access.*denied", "forbidden"]
    },
    category: "auth",
    summary: "Operation denied due to insufficient RBAC permissions.",
    root_causes: [
      {
        name: "Missing ClusterRole or Role permissions",
        why: "Required permissions are not granted to user or service account",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/", "label": "RBAC Authorization"}
        ]
      },
      {
        name: "Incorrect RoleBinding or ClusterRoleBinding",
        why: "Role is not properly bound to user or service account",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/", "label": "RBAC Authorization"}
        ]
      },
      {
        name: "Wrong namespace scope",
        why: "Trying to access resources in unauthorized namespace",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/", "label": "RBAC Authorization"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check current user permissions",
        commands: ["kubectl auth can-i <verb> <resource>", "kubectl auth can-i --list"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authorization/", "label": "Authorization"}
        ]
      },
      {
        step: "Review existing roles and bindings",
        commands: ["kubectl get roles,rolebindings", "kubectl get clusterroles,clusterrolebindings"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/", "label": "RBAC Authorization"}
        ]
      },
      {
        step: "Create or update RBAC resources",
        commands: ["kubectl create rolebinding <binding-name> --role=<role-name> --user=<user-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/", "label": "RBAC Authorization"}
        ]
      }
    ],
    clarifying_questions: ["What specific operation is being denied?", "Which user or service account is being used?"],
    examples: [
      {
        name: "Service account cannot create pods",
        symptom: "Application returns 403 forbidden when trying to create pods",
        fix: "Grant appropriate permissions to the service account",
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/", "label": "RBAC Authorization"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "readinessprobe",
    title: "Readiness Probe",
    aliases: ["readinessprobe", "readiness probe", "readiness check failed", "not ready"],
    matchers: {
      regex: ["readinessprobe", "readiness.*probe", "readiness.*check.*failed", "not.*ready"]
    },
    category: "runtime",
    summary: "Readiness probe is failing, preventing pod from receiving traffic.",
    root_causes: [
      {
        name: "Application not fully started",
        why: "Application is still initializing and not ready to serve requests",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      },
      {
        name: "Readiness probe misconfigured",
        why: "Probe endpoint or parameters are incorrect",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      },
      {
        name: "Application dependency issues",
        why: "Application cannot connect to required external services",
        confidence: 0.5,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check readiness probe configuration",
        commands: ["kubectl describe pod <pod-name>", "kubectl get pod <pod-name> -o yaml  < /dev/null |  grep -A 10 readinessProbe"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      },
      {
        step: "Test probe endpoint manually",
        commands: ["kubectl exec -it <pod-name> -- curl localhost:8080/health"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      },
      {
        step: "Review application logs",
        commands: ["kubectl logs <pod-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/", "label": "Debug Running Pod"}
        ]
      }
    ],
    clarifying_questions: ["What endpoint is the readiness probe checking?", "Is the application actually ready to serve traffic?"],
    examples: [
      {
        name: "Pod not receiving traffic due to failed readiness",
        symptom: "Pod shows Running but not receiving requests",
        fix: "Fix readiness probe or application startup issues",
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "secretnotfound",
    title: "Secret Not Found",
    aliases: ["secretnotfound", "secret not found", "secret missing", "secret does not exist"],
    matchers: {
      regex: ["secretnotfound", "secret.*not.*found", "secret.*missing", "secret.*does.*not.*exist"]
    },
    category: "config",
    summary: "Referenced Kubernetes secret does not exist in the namespace.",
    root_causes: [
      {
        name: "Secret was never created",
        why: "Referenced secret has not been created in the namespace",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      },
      {
        name: "Secret in wrong namespace",
        why: "Secret exists but in different namespace",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      },
      {
        name: "Secret was deleted",
        why: "Secret was previously deleted or cleaned up",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check if secret exists",
        commands: ["kubectl get secrets", "kubectl get secrets --all-namespaces  < /dev/null |  grep <secret-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      },
      {
        step: "Create the missing secret",
        commands: ["kubectl create secret generic <secret-name> --from-literal=key=value"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      },
      {
        step: "Verify pod configuration",
        commands: ["kubectl describe pod <pod-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      }
    ],
    clarifying_questions: ["What is the name of the missing secret?", "In which namespace should the secret exist?"],
    examples: [
      {
        name: "Pod failing to start due to missing secret",
        symptom: "Pod shows CreateContainerConfigError with secret not found",
        fix: "Create the referenced secret with correct name and namespace",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/secret/", "label": "Secrets"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "servicenotfound",
    title: "Service Not Found",
    aliases: ["servicenotfound", "service not found", "service missing", "service does not exist"],
    matchers: {
      regex: ["servicenotfound", "service.*not.*found", "service.*missing", "service.*does.*not.*exist"]
    },
    category: "network",
    summary: "Referenced Kubernetes service does not exist in the namespace.",
    root_causes: [
      {
        name: "Service was never created",
        why: "Referenced service has not been created",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      },
      {
        name: "Service in wrong namespace",
        why: "Service exists but in different namespace",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      },
      {
        name: "Service name typo",
        why: "Service name is misspelled in configuration",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check if service exists",
        commands: ["kubectl get services", "kubectl get services --all-namespaces  < /dev/null |  grep <service-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      },
      {
        step: "Create the missing service",
        commands: ["kubectl expose deployment <deployment-name> --port=80"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      },
      {
        step: "Verify service configuration",
        commands: ["kubectl describe service <service-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/service/", "label": "Services"}
        ]
      }
    ],
    clarifying_questions: ["What is the exact service name being referenced?", "In which namespace should the service exist?"],
    examples: [
      {
        name: "Ingress pointing to non-existent service",
        symptom: "Ingress shows service not found error",
        fix: "Create the referenced service or fix the service name",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/ingress/", "label": "Ingress"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "startupprobefailed",
    title: "Startup Probe Failed",
    aliases: ["startupprobefailed", "startup probe failed", "startup check failed", "container startup failed"],
    matchers: {
      regex: ["startupprobefailed", "startup.*probe.*failed", "startup.*check.*failed", "container.*startup.*failed"]
    },
    category: "runtime",
    summary: "Container startup probe is failing during initialization.",
    root_causes: [
      {
        name: "Application taking too long to start",
        why: "Application startup time exceeds probe timeout",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      },
      {
        name: "Incorrect startup probe configuration",
        why: "Probe endpoint, port, or path is incorrect",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      },
      {
        name: "Application startup errors",
        why: "Application is failing to start due to configuration or dependency issues",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/", "label": "Debug Running Pod"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check startup probe configuration",
        commands: ["kubectl describe pod <pod-name>", "kubectl get pod <pod-name> -o yaml  < /dev/null |  grep -A 10 startupProbe"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      },
      {
        step: "Review application logs",
        commands: ["kubectl logs <pod-name>", "kubectl logs <pod-name> --previous"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/", "label": "Debug Running Pod"}
        ]
      },
      {
        step: "Test probe endpoint manually",
        commands: ["kubectl exec -it <pod-name> -- curl localhost:8080/healthz"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      }
    ],
    clarifying_questions: ["What is the startup probe checking?", "How long does the application normally take to start?"],
    examples: [
      {
        name: "Pod restarting due to failed startup probe",
        symptom: "Pod shows repeated restarts with startup probe failure",
        fix: "Increase startup probe timeout or fix application startup issues",
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "label": "Configure Probes"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "tls-handshake-timeout",
    title: "TLS Handshake Timeout",
    aliases: ["tls handshake timeout", "ssl handshake timeout", "tls timeout", "handshake timeout"],
    matchers: {
      regex: ["tls.*handshake.*timeout", "ssl.*handshake.*timeout", "handshake.*timeout"]
    },
    category: "network",
    summary: "TLS handshake between client and server timed out, indicating network connectivity issues or certificate problems.",
    root_causes: [
      {
        name: "Network connectivity issues",
        why: "High latency or packet loss preventing TLS handshake completion",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Cluster Networking"}
        ]
      },
      {
        name: "Certificate problems",
        why: "Invalid, expired, or mismatched TLS certificates",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/certificates/", "label": "PKI certificates and requirements"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check network connectivity",
        commands: ["ping <api-server>", "telnet <api-server> 6443"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Troubleshooting Clusters"}
        ]
      },
      {
        step: "Verify certificate validity",
        commands: ["openssl s_client -connect <host>:6443"],
        sources: [
          {"url": "https://kubernetes.io/docs/setup/best-practices/certificates/", "label": "Certificate Management Best Practices"}
        ]
      },
      {
        step: "Check API server status",
        commands: ["kubectl get nodes", "kubectl cluster-info"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debugging Clusters"}
        ]
      }
    ],
    clarifying_questions: ["Is this happening during API server communication?", "Are you using custom certificates?"],
    examples: [
      {
        name: "API server connection timeout",
        symptom: "kubectl commands timeout with TLS handshake timeout",
        fix: "Check network path to API server and verify certificates",
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Cluster Troubleshooting"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "unauthorized",
    title: "Unauthorized",
    aliases: ["unauthorized", "401 unauthorized", "authentication failed", "invalid credentials"],
    matchers: {
      regex: ["unauthorized", "401.*unauthorized", "authentication.*failed"]
    },
    category: "auth",
    summary: "Authentication failed due to invalid, expired, or missing credentials. The request could not be authenticated.",
    root_causes: [
      {
        name: "Invalid or expired token",
        why: "Authentication token is invalid, expired, or malformed",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/", "label": "Authenticating"}
        ]
      },
      {
        name: "Missing authentication credentials",
        why: "No valid authentication method provided in the request",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/", "label": "Controlling Access to Kubernetes API"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check current authentication context",
        commands: ["kubectl config view", "kubectl config current-context"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/", "label": "Configure Access to Multiple Clusters"}
        ]
      },
      {
        step: "Verify credentials are valid",
        commands: ["kubectl cluster-info", "kubectl get nodes"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "Organizing Cluster Access Using kubeconfig Files"}
        ]
      },
      {
        step: "Refresh authentication if expired",
        commands: ["kubectl config use-context <context>"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/#putting-a-bearer-token-in-a-request", "label": "Bearer Token Authentication"}
        ]
      }
    ],
    clarifying_questions: ["Are you using kubectl or in-cluster authentication?", "When did the credentials last work?"],
    examples: [
      {
        name: "Expired kubeconfig token",
        symptom: "All kubectl commands fail with 401 Unauthorized",
        fix: "Regenerate kubeconfig or refresh cloud provider authentication",
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/", "label": "Authentication Strategies"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubernetes",
    canonical_slug: "volumemountfailed",
    title: "Volume Mount Failed",
    aliases: ["volumemountfailed", "volume mount failed", "mount failed", "volume attachment failed"],
    matchers: {
      regex: ["volumemountfailed", "volume.*mount.*failed", "mount.*failed", "volume.*attachment.*failed"]
    },
    category: "storage",
    summary: "PersistentVolumeClaim is stuck in pending state.",
    root_causes: [
      {
        name: "Volume does not exist",
        why: "Referenced volume or PVC does not exist",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      },
      {
        name: "Volume already mounted elsewhere",
        why: "Volume is attached to another node and cannot be multi-attached",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      },
      {
        name: "Storage system issues",
        why: "Underlying storage system is experiencing problems",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check volume and PVC status",
        commands: ["kubectl get pvc", "kubectl describe pvc <pvc-name>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/", "label": "Persistent Volumes"}
        ]
      },
      {
        step: "Review pod events",
        commands: ["kubectl describe pod <pod-name>", "kubectl get events"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      },
      {
        step: "Check storage class and provisioner",
        commands: ["kubectl get storageclass", "kubectl logs -n kube-system <csi-driver-pods>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/storage-classes/", "label": "Storage Classes"}
        ]
      }
    ],
    clarifying_questions: ["What type of volume is failing to mount?", "Is this a new pod or existing one?"],
    examples: [
      {
        name: "Pod stuck in ContainerCreating due to mount failure",
        symptom: "Pod shows FailedMount events and cannot start",
        fix: "Investigate volume availability and storage system health",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/storage/volumes/", "label": "Volumes"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];
