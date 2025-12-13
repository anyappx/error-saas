export type CNIError = {
  tool: "cni";
  canonical_slug: string;
  title: string;
  aliases: string[];
  matchers: { regex: string[] };
  category: "plugin" | "network" | "ipam" | "bridge" | "config" | "runtime";
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

export const CNI_ERRORS: CNIError[] = [
  {
    tool: "cni",
    canonical_slug: "cni-plugin-not-found",
    title: "CNI Plugin Not Found",
    aliases: ["cni plugin not found", "plugin not found", "cni binary not found"],
    matchers: {
      regex: ["cni.*plugin.*not.*found", "plugin.*not.*found", "cni.*binary.*not.*found"]
    },
    category: "plugin",
    summary: "CNI plugin binary is missing or not executable.",
    root_causes: [
      {
        name: "Plugin binary missing",
        why: "CNI plugin binary is not installed in the expected directory",
        confidence: 0.9,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/", "label": "Network Plugins"}
        ]
      },
      {
        name: "Incorrect plugin path",
        why: "CNI plugin path is misconfigured",
        confidence: 0.7,
        sources: [
          {"url": "https://github.com/containernetworking/cni/blob/master/SPEC.md", "label": "CNI Specification"}
        ]
      },
      {
        name: "Permission issues",
        why: "CNI plugin binary lacks execute permissions",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Cluster Networking"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check CNI plugin installation",
        commands: ["ls -la /opt/cni/bin/", "ls -la /etc/cni/net.d/"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/", "label": "Network Plugins"}
        ]
      },
      {
        step: "Install missing CNI plugins",
        commands: ["sudo wget https://github.com/containernetworking/plugins/releases/download/v1.1.1/cni-plugins-linux-amd64-v1.1.1.tgz", "sudo tar -xzf cni-plugins-linux-amd64-v1.1.1.tgz -C /opt/cni/bin/"],
        sources: [
          {"url": "https://github.com/containernetworking/plugins", "label": "CNI Plugins"}
        ]
      },
      {
        step: "Set correct permissions",
        commands: ["sudo chmod +x /opt/cni/bin/*"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Cluster Networking"}
        ]
      }
    ],
    clarifying_questions: ["Which CNI plugin are you using?", "What container runtime are you using?"],
    examples: [
      {
        name: "Flannel plugin missing",
        symptom: "failed to find plugin flannel in path [/opt/cni/bin]",
        fix: "Install the CNI plugins package and ensure flannel binary exists",
        sources: [
          {"url": "https://github.com/flannel-io/flannel", "label": "Flannel"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "cni",
    canonical_slug: "cni-config-invalid",
    title: "CNI Configuration Invalid",
    aliases: ["cni config invalid", "network config invalid", "cni configuration error"],
    matchers: {
      regex: ["cni.*config.*invalid", "network.*config.*invalid", "cni.*configuration.*error"]
    },
    category: "config",
    summary: "CNI network configuration file contains invalid or malformed configuration.",
    root_causes: [
      {
        name: "JSON syntax error",
        why: "CNI configuration file has invalid JSON syntax",
        confidence: 0.8,
        sources: [
          {"url": "https://github.com/containernetworking/cni/blob/master/SPEC.md", "label": "CNI Specification"}
        ]
      },
      {
        name: "Missing required fields",
        why: "CNI configuration is missing mandatory fields",
        confidence: 0.7,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Cluster Networking"}
        ]
      },
      {
        name: "Plugin-specific configuration error",
        why: "Configuration parameters are invalid for the specific CNI plugin",
        confidence: 0.6,
        sources: [
          {"url": "https://github.com/containernetworking/plugins", "label": "CNI Plugins"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Validate JSON syntax",
        commands: ["cat /etc/cni/net.d/*.conf | jq .", "python -m json.tool /etc/cni/net.d/*.conf"],
        sources: [
          {"url": "https://github.com/containernetworking/cni/blob/master/SPEC.md", "label": "CNI Specification"}
        ]
      },
      {
        step: "Check required fields",
        commands: ["cat /etc/cni/net.d/*.conf"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Cluster Networking"}
        ]
      },
      {
        step: "Review plugin documentation",
        commands: ["kubectl describe node <node-name>"],
        sources: [
          {"url": "https://github.com/containernetworking/plugins", "label": "CNI Plugins"}
        ]
      }
    ],
    clarifying_questions: ["Which CNI plugin are you configuring?", "What specific error message do you see?"],
    examples: [
      {
        name: "Invalid Calico configuration",
        symptom: "error parsing network config: missing 'type' field",
        fix: "Add the required 'type' field to the CNI configuration",
        sources: [
          {"url": "https://docs.projectcalico.org/", "label": "Calico Documentation"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "cni",
    canonical_slug: "ip-allocation-failed",
    title: "IP Allocation Failed",
    aliases: ["ip allocation failed", "ipam failed", "no ip addresses available"],
    matchers: {
      regex: ["ip.*allocation.*failed", "ipam.*failed", "no.*ip.*addresses.*available"]
    },
    category: "ipam",
    summary: "CNI IPAM plugin failed to allocate IP address for the container.",
    root_causes: [
      {
        name: "IP address pool exhausted",
        why: "All available IP addresses in the subnet have been allocated",
        confidence: 0.8,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/cluster-ip-allocation/", "label": "Cluster IP Allocation"}
        ]
      },
      {
        name: "IPAM plugin configuration error",
        why: "IPAM plugin is misconfigured or not properly set up",
        confidence: 0.7,
        sources: [
          {"url": "https://github.com/containernetworking/plugins/tree/master/plugins/ipam", "label": "IPAM Plugins"}
        ]
      },
      {
        name: "Network overlap issues",
        why: "Configured network ranges overlap with existing networks",
        confidence: 0.6,
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Cluster Networking"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Check IP allocation status",
        commands: ["kubectl get pods -o wide", "ip route show"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/services-networking/cluster-ip-allocation/", "label": "Cluster IP Allocation"}
        ]
      },
      {
        step: "Review IPAM configuration",
        commands: ["cat /etc/cni/net.d/*.conf | grep -A 10 ipam"],
        sources: [
          {"url": "https://github.com/containernetworking/plugins/tree/master/plugins/ipam", "label": "IPAM Plugins"}
        ]
      },
      {
        step: "Expand IP range or clean up",
        commands: ["kubectl delete pod <failed-pod>"],
        sources: [
          {"url": "https://kubernetes.io/docs/concepts/cluster-administration/networking/", "label": "Cluster Networking"}
        ]
      }
    ],
    clarifying_questions: ["What IPAM plugin are you using?", "How large is your configured IP range?"],
    examples: [
      {
        name: "Pod creation fails due to no IPs",
        symptom: "failed to allocate for range 0: no IP addresses available in range set",
        fix: "Expand the IP range in CNI configuration or clean up unused IPs",
        sources: [
          {"url": "https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local", "label": "Host-local IPAM"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Add more CNI errors here following the same pattern
// Total target: 20 CNI errors