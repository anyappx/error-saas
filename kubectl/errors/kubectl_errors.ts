export type KubectlError = {
  tool: "kubectl";
  canonical_slug: string;
  title: string;
  aliases: string[];
  matchers: { regex: string[] };
  category: "connection" | "authentication" | "authorization" | "syntax" | "resource" | "config";
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

export const KUBECTL_ERRORS: KubectlError[] = [
  {
    tool: "kubectl",
    canonical_slug: "connection-refused",
    title: "Connection Refused",
    aliases: ["connection refused", "connection denied", "unable to connect"],
    matchers: {
      regex: ["connection.*refused", "connection.*denied", "unable.*to.*connect"]
    },
    category: "connection",
    summary: "kubectl cannot connect to the Kubernetes API server.",
    root_causes: [
      {
        name: "API server not running",
        why: "Kubernetes API server is not running or accessible",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debug Cluster"}
        ]
      },
      {
        name: "Incorrect kubeconfig",
        why: "kubeconfig file points to wrong cluster or endpoint",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      },
      {
        name: "Network connectivity issues",
        why: "Network firewall or connectivity problems",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/", "label": "Troubleshooting"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check cluster status",
        commands: ["kubectl cluster-info", "kubectl get nodes"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/kubectl/cheatsheet/", "label": "kubectl Cheat Sheet"}
        ]
      },
      {
        step: "Verify kubeconfig",
        commands: ["kubectl config view", "kubectl config current-context"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      },
      {
        step: "Test API server connectivity",
        commands: ["curl -k https://<api-server>:6443/version"],
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/", "label": "Debug Cluster"}
        ]
      }
    ],
    clarifying_questions: ["What cluster are you trying to connect to?", "Did this work before?"],
    examples: [
      {
        name: "Local cluster not running",
        symptom: "Unable to connect to the server: dial tcp 127.0.0.1:6443: connect: connection refused",
        fix: "Start your local Kubernetes cluster (minikube start, kind, etc.)",
        sources: [
          {"url": "https://minikube.sigs.k8s.io/docs/start/", "label": "Minikube"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubectl",
    canonical_slug: "authentication-failed",
    title: "Authentication Failed",
    aliases: ["authentication failed", "auth failed", "unauthorized", "invalid credentials"],
    matchers: {
      regex: ["authentication.*failed", "auth.*failed", "unauthorized", "invalid.*credentials"]
    },
    category: "authentication",
    summary: "kubectl authentication to Kubernetes API server failed.",
    root_causes: [
      {
        name: "Expired certificates",
        why: "Client certificates have expired",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/", "label": "Authentication"}
        ]
      },
      {
        name: "Invalid service account token",
        why: "Service account token is invalid or expired",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/", "label": "Service Accounts"}
        ]
      },
      {
        name: "Wrong authentication method",
        why: "Using incorrect authentication method for the cluster",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/", "label": "Authentication"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check authentication method",
        commands: ["kubectl config view --raw", "kubectl auth whoami"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "label": "kubeconfig"}
        ]
      },
      {
        step: "Refresh credentials",
        commands: ["kubectl get pods", "gcloud container clusters get-credentials <cluster-name>"],
        sources: [
          {"url": "https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl", "label": "GKE Access"}
        ]
      },
      {
        step: "Verify certificate validity",
        commands: ["openssl x509 -in <cert-file> -text -noout"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/", "label": "Authentication"}
        ]
      }
    ],
    clarifying_questions: ["What authentication method are you using?", "Are you using a cloud provider?"],
    examples: [
      {
        name: "GKE cluster authentication",
        symptom: "Unable to connect to the server: Unauthorized",
        fix: "Run gcloud container clusters get-credentials to refresh authentication",
        sources: [
          {"url": "https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl", "label": "GKE Access"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "kubectl",
    canonical_slug: "resource-not-found",
    title: "Resource Not Found",
    aliases: ["resource not found", "not found", "does not exist"],
    matchers: {
      regex: ["resource.*not.*found", "not.*found", "does.*not.*exist"]
    },
    category: "resource",
    summary: "kubectl cannot find the specified Kubernetes resource.",
    root_causes: [
      {
        name: "Resource does not exist",
        why: "The specified resource has not been created or was deleted",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/reference/kubectl/cheatsheet/", "label": "kubectl Cheat Sheet"}
        ]
      },
      {
        name: "Wrong namespace",
        why: "Resource exists but in a different namespace",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      },
      {
        name: "Incorrect resource name",
        why: "Resource name is misspelled or incorrectly formatted",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/names/", "label": "Object Names"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "List available resources",
        commands: ["kubectl get all", "kubectl get <resource-type>"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/kubectl/cheatsheet/", "label": "kubectl Cheat Sheet"}
        ]
      },
      {
        step: "Check all namespaces",
        commands: ["kubectl get <resource-type> --all-namespaces"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      },
      {
        step: "Verify resource name and type",
        commands: ["kubectl api-resources", "kubectl get <resource-type> -o wide"],
        sources: [
          {"url": "https://kubernetes.io/docs/reference/kubectl/overview/", "label": "kubectl Overview"}
        ]
      }
    ],
    clarifying_questions: ["What resource are you looking for?", "Which namespace are you checking?"],
    examples: [
      {
        name: "Pod not found in current namespace",
        symptom: "Error from server (NotFound): pods nginx not found",
        fix: "Check if the pod exists in a different namespace",
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/", "label": "Namespaces"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Add more kubectl errors here following the same pattern
// Total target: 50 kubectl errors